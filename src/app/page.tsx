import { trpcServer } from '@/trpc/clients/server'

export default async function Home() {
  const movies = await trpcServer.movies.movies.query()
  return (
    <main>
      Hello World
      <div>
        {movies.map((movie) => (
          <>
            <div>{movie.title}</div>
            <div>{movie.director}</div>
            <div>{movie.genre}</div>
            <img src={movie.posterUrl || ''} alt="harry potter" />
          </>
        ))}
      </div>
    </main>
  )
}
