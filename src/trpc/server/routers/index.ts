import { createTRPCRouter, protectedProcedure, publicProcedure } from '..'
import { adminsRouter } from './admins'
import { cinemasRouter } from './cinemas'
import { managerRoutes } from './managers'
import { moviesRouter } from './movies'
import { showtimesRoute } from './showtimes'
import { stripeRoutes } from './stripe'
import { ticketsRoutes } from './tickets'

export const appRouter = createTRPCRouter({
  movies: moviesRouter,
  admins: adminsRouter,
  cinemas: cinemasRouter,
  managers: managerRoutes,
  showtimes: showtimesRoute,
  stripe: stripeRoutes,
  tickets: ticketsRoutes,
})

export type AppRouter = typeof appRouter
