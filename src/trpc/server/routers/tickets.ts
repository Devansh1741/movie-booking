import { createTRPCRouter, protectedProcedure } from '..'

export const ticketsRoutes = createTRPCRouter({
  myTickets: protectedProcedure().query(({ ctx }) => {
    return ctx.db.ticket.findMany({
      where: { uid: ctx.userId },
      include: {
        Bookings: {
          include: {
            Showtime: {
              include: { Movie: true, Screen: { include: { Cinema: true } } },
            },
          },
        },
      },
    })
  }),
})
