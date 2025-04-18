import { schemaCreateManager } from '@/forms/createManager'
import { createTRPCRouter, protectedProcedure } from '..'
import { TRPCError } from '@trpc/server'

export const managerRoutes = createTRPCRouter({
  create: protectedProcedure('admin')
    .input(schemaCreateManager)
    .mutation(async ({ ctx, input }) => {
      const [admin, user] = await Promise.all([
        ctx.db.manager.findUnique({ where: input }),
        ctx.db.user.findUnique({ where: input }),
      ])

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }
      if (admin) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'The user is already an admin',
        })
      }

      return ctx.db.manager.create({ data: input })
    }),

  findAll: protectedProcedure('admin').query(({ ctx }) => {
    return ctx.db.manager.findMany({ include: { User: true } })
  }),
  managerMe: protectedProcedure('manager', 'admin').query(({ ctx }) => {
    return ctx.db.manager.findUnique({ where: { id: ctx.userId } })
  }),
  dashboard: protectedProcedure('admin', 'manager').query(async ({ ctx }) => {
    const uid = ctx.userId

    const [cinemas, movies] = await Promise.all([
      ctx.db.cinema.count({ where: { Managers: { some: { id: uid } } } }),
      ctx.db.showtime.count({
        where: { Screen: { Cinema: { Managers: { some: { id: uid } } } } },
      }),
    ])

    return { cinemas, movies }
  }),
})
