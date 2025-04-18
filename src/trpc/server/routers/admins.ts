import { schemaCreateAdmin } from '@/forms/createAdmin'
import { createTRPCRouter, protectedProcedure } from '..'
import { TRPCError } from '@trpc/server'

export const adminsRouter = createTRPCRouter({
  dashboard: protectedProcedure('admin').query(async ({ ctx }) => {
    const [cinemas, movies, admins, managers, users] = await Promise.all([
      ctx.db.cinema.count(),
      ctx.db.movie.count(),
      ctx.db.admin.count(),
      ctx.db.manager.count(),
      ctx.db.user.count(),
    ])

    return { cinemas, movies, admins, managers, users }
  }),

  findAll: protectedProcedure('admin').query(({ ctx }) => {
    return ctx.db.admin.findMany({ include: { User: true } })
  }),
  adminMe: protectedProcedure().query(({ ctx }) => {
    return ctx.db.admin.findUnique({ where: { id: ctx.userId } })
  }),
  create: protectedProcedure('admin')
    .input(schemaCreateAdmin)
    .mutation(async ({ ctx, input }) => {
      const [admin, user] = await Promise.all([
        ctx.db.admin.findUnique({ where: input }),
        ctx.db.user.findUnique({ where: input }),
      ])

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }
      if (admin) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'The user is already an manager',
        })
      }

      return ctx.db.admin.create({ data: input })
    }),
})
