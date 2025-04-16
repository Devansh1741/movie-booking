import { RouterOutputs } from '@/trpc/clients/types'
import { CinemaInfo } from '../organisms/CinemaInfo'

export interface IListMoviesProps {
  cinemas: RouterOutputs['cinemas']['cinemas']
}

export const ListCinemas = ({ cinemas }: IListMoviesProps) => {
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
