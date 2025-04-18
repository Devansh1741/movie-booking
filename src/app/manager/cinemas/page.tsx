import { CinemaInfo } from '@/components/organisms/CinemaInfo'
import { trpcServer } from '@/trpc/clients/server'

export default async function page() {
  const cinemas = await trpcServer.cinemas.myCinemas.query()
  return (
    <div>
      <div>
        {cinemas.length === 0 ? (
          <div>You have not created any cinemas yet.</div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {cinemas.map((cinema) => (
          <CinemaInfo key={cinema.id} cinema={cinema} />
        ))}
      </div>
    </div>
  )
}
