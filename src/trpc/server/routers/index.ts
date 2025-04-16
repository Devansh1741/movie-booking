import { createTRPCRouter, protectedProcedure, publicProcedure } from '..'
import { adminsRouter } from './admins'
import { cinemasRouter } from './cinemas'
import { moviesRouter } from './movies'

export const appRouter = createTRPCRouter({
  movies: moviesRouter,
  admins: adminsRouter,
  cinemas: cinemasRouter,
})

export type AppRouter = typeof appRouter
