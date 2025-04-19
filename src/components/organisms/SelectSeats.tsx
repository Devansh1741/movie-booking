import { trpcClient } from '@/trpc/clients/client'
import { generateSeatComment, groupSeatsByRow } from '@/utils/functions'
import { CurvedScreen, SeatNumber, Square } from './ScreenUtils'
import { useSeatSelection } from '@/utils/hooks'
import { Button } from '../atoms/button'

export const SelectSeats = ({ showtimeId }: { showtimeId: number }) => {
  const { data, isLoading } = trpcClient.showtimes.seats.useQuery({
    showtimeId,
  })

  const rows = groupSeatsByRow(data?.seats || []) || []

  const {
    state: { selectedSeats },
    toggleSeat,
    resetSeats,
  } = useSeatSelection()

  return (
    <div className="mt-8">
      {/* <StaightMovieScreen />
      {isLoading ? <Loading /> : null} */}
      <div className="flex justify-center rotate-180">
        <CurvedScreen />
        {/* <div className="text-gray-500 text-sx">Eyes this way</div> */}
      </div>
      <div className="flex justify-center overflow-x-auto py-2">
        <div>
          {Object.entries(rows).map(([rowNumber, seatsInRow]) => (
            <div key={rowNumber} className="flex gap-2 mt-1">
              {seatsInRow.map((seat) => (
                <button
                  key={`${seat.row}-${seat.column}`}
                  disabled={Boolean(seat?.booked)}
                  onClick={() => {
                    toggleSeat(seat)
                  }}
                >
                  <Square
                    key={`${seat.row}-${seat.column}`}
                    booked={Boolean(seat?.booked)}
                    selected={Boolean(
                      selectedSeats?.find(
                        (selectedSeat) =>
                          seat.column === selectedSeat.column &&
                          seat.row === selectedSeat.row,
                      ),
                    )}
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="py-4">
        <div className="text-lg font-light">
          {generateSeatComment({ allSeats: rows, selectedSeats })}
        </div>

        {selectedSeats.length ? (
          <div className="my-4">
            <div>Seats</div>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(({ row, column }) => (
                <SeatNumber
                  key={`${row}-${column}`}
                  row={row}
                  column={column}
                />
              ))}
            </div>
          </div>
        ) : null}
        <div className="flex justify-between mt-4">
          <Button
            disabled={Boolean(!selectedSeats.length)}
            onClick={resetSeats}
            variant="destructive"
            size="sm"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
