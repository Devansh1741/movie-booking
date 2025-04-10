import { RouterOutputs } from '@/trpc/clients/types'
export const MovieInfo = ({
  movie,
}: {
  movie: RouterOutputs['movies']['movies'][0]
}) => {
  return (
    <div>
      <img
        src={
          movie.posterUrl ||
          'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/9b2ca95a-7874-4fdf-9b22-d90792a9234e/dicnexf-643811bc-6ee7-4075-9eff-afbc7fff9c22.png/v1/fit/w_578,h_709/harry_potter_the_philosopher_s_stone__2001__folder_by_foldericonboy_dicnexf-375w-2x.png'
        }
        alt="Poster"
        className="aspect-square object-cover rounedd shadow-lg"
        width={300}
        height={300}
      />

      <div className="text-lg font-semibold">{movie.title}</div>
      <div>{movie.director}</div>
      <div className="text-xs text-gray-500 mt-2">{movie.genre}</div>
    </div>
  )
}
