'use client'
import { trpcClient } from '@/trpc/clients/client'
import { useHandleSearch } from '@/utils/hooks'
import { CinemaSelectCard } from './CinemaSelectCard'
import { AlertBox } from '../molecules/AlertBox'
import { Title2 } from '../atoms/typography'
import { Loading } from '../molecules/Loading'

export const SelectMovie = ({ cinemaId }: { cinemaId: number }) => {
  const { data, isLoading } = trpcClient.movies.moviesPerCinema.useQuery({
    cinemaId,
  })

  const { params, addParam, deleteParams } = useHandleSearch()

  if (data?.length === 0) {
    return <AlertBox>Currently no shows are running in this cinema.</AlertBox>
  }

  return (
    <div>
      <Title2>Select movie</Title2>
      {isLoading ? <Loading /> : null}

      <div className="grid grid-cols-3 gap-2">
        {data?.map((movie) => (
          <button
            key={movie.id}
            onClick={() => {
              deleteParams(['screenId', 'showtimeId'])
              addParam('movieId', movie.id)
            }}
          >
            <CinemaSelectCard
              movie={movie}
              selected={params.get('movieId') === movie.id.toString()}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
