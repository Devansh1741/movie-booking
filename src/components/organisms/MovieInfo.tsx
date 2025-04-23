import { RouterOutputs } from '@/trpc/clients/types'
import Image from 'next/image'
export const MovieInfo = ({
  movie,
}: {
  movie: RouterOutputs['movies']['movies'][0]
}) => {
  return (
    <div>
      <Image
        src={movie.posterUrl || '/film.png'}
        alt="Poster"
        className="aspect-square object-cover rounedd shadow-lg"
        width={300}
        height={420}
      />

      <div className="text-lg font-semibold">{movie.title}</div>
      <div>{movie.director}</div>
      <div className="text-xs text-gray-500 mt-2">{movie.genre}</div>
    </div>
  )
}
