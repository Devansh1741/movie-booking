import { createTRPCRouter, protectedProcedure, publicProcedure } from '..'
import { adminsRouter } from './admins'
import { cinemasRouter } from './cinemas'
import { managerRoutes } from './managers'
import { moviesRouter } from './movies'
import { showtimesRoute } from './showtimes'

export const appRouter = createTRPCRouter({
  movies: moviesRouter,
  admins: adminsRouter,
  cinemas: cinemasRouter,
  managers: managerRoutes,
  showtimes: showtimesRoute,
})

export type AppRouter = typeof appRouter
