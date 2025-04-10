import { trpcServer } from '@/trpc/clients/server'

export default async function Home() {
  const movies = await trpcServer.movies.movies.query()
  return <main>Hello World</main>
}
