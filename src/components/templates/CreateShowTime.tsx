'use client'

import { FormTypeCreateShowtime } from '@/forms/createShowtime'
import { trpcClient } from '@/trpc/clients/client'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useToast } from '../molecules/Toaster/use-toast'
import { useRouter } from 'next/navigation'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { revalidatePath } from '@/utils/actions/revalidate'

export default function CreateShowTimes() {
  const {
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext<FormTypeCreateShowtime>()

  const {
    isLoading,
    data,
    error,
    mutateAsync: createShowTime,
  } = trpcClient.showtimes.create.useMutation()

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (data) {
      reset()
      toast({ title: 'Showtimes created.' })
      revalidatePath('/manager/cinemas')
      router.replace('/manager/cinemas')
    }
  }, [data, toast, reset, router])

  useEffect(() => {
    if (error) {
      console.log(error)
      toast({ title: 'Action failed.' })
    }
  }, [error, toast])

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log('form submitted: ', data)
        await createShowTime(data)
      })}
    >
      <SelectMovie />
      <SelectScreen />
      <AddShows />
      <Button type="submit">Submit</Button>
    </form>
  )
}

export const SelectMovie = () => {
  const { data, isLoading } = trpcClient.movies.movies.useQuery()
  const { setValue } = useFormContext<FormTypeCreateShowtime>()
  return (
    <Label title="Movie">
      <select
        onChange={(event) => setValue('movieId', Number(event.target.value))}
        className="w-full px-3 py-2 border rounded border-input"
      >
        {isLoading ? (
          <option value="">Loading...</option>
        ) : (
          <option value="">Select a movie...</option>
        )}

        {data?.map((movie) => (
          <option key={movie.id} value={movie.id}>
            {movie.title}
          </option>
        ))}
      </select>
    </Label>
  )
}

export const SelectScreen = () =>
  //     {
  //   setValue,
  // }: {
  //   setValue: (id: number) => void
  // }
  {
    const { data, isLoading } = trpcClient.cinemas.myScreens.useQuery()
    const { setValue } = useFormContext<FormTypeCreateShowtime>()

    return (
      <Label title="Screen number">
        <select
          onChange={(event) => setValue('screenId', Number(event.target.value))}
          className="w-full px-3 py-2 border rounded border-input"
        >
          {isLoading ? (
            <option value="">Loading...</option>
          ) : (
            <option value="">Select a screen...</option>
          )}

          {data?.map((screen) => (
            <option key={screen.id} value={screen.id}>
              {screen.Cinema.name} - {screen.number}
            </option>
          ))}
        </select>
      </Label>
    )
  }

export const AddShows = () => {
  const { control, register } = useFormContext<FormTypeCreateShowtime>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'showtimes',
  })

  return (
    <div>
      <Label title="Shows">
        <div className="grid grid-cols-3 gap-2">
          {fields.map((showtime, showtimeIndex) => (
            <div key={showtime.id}>
              <Label>
                <Input
                  {...register(`showtimes.${showtimeIndex}.time`)}
                  type="datetime-local"
                />
              </Label>

              <Button
                size="sm"
                variant="link"
                onClick={() => remove(showtimeIndex)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Label>

      <Button
        className="flex items-center justify-center w-full py-2 mt-2 text-xs border border-dashed"
        size="sm"
        variant="link"
        onClick={() =>
          append({
            time: '',
          })
        }
      >
        <Plus className="w-4 h-4" /> Add show
      </Button>
    </div>
  )
}
