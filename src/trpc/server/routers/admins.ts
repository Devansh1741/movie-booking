import { createTRPCRouter, protectedProcedure } from '..'

export const adminsRouter = createTRPCRouter({
  admins: protectedProcedure('admin').query(({ ctx }) => {
    return ctx.db.admin.findMany()
  }),
  adminMe: protectedProcedure().query(({ ctx }) => {
    return ctx.db.admin.findUnique({ where: { id: ctx.userId } })
  }),
})
