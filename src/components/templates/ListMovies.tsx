import { trpcServer } from '@/trpc/clients/server'
import { MovieInfo } from '../organisms/MovieInfo'

export interface IListMoviesProps {}
export const ListMovies = async ({}: IListMoviesProps) => {
  const movies = await trpcServer.movies.movies.query()

  return (
    <div className="grid grid-cols-3 gap-4">
      {movies.map((movie) => (
        <MovieInfo movie={movie} key={movie.id} />
      ))}
    </div>
  )
}
