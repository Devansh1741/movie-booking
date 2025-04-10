'use client'

import { useFormCreateMovie } from '@/forms/createMovie'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { HtmlSelect } from '../atoms/select'
import { Genre } from '@prisma/client'
import { trpcClient } from '@/trpc/clients/client'
import { useToast } from '../molecules/Toaster/use-toast'
import { useRouter } from 'next/navigation'
import { revalidatePath } from '@/utils/actions/revalidate'

export interface ICreateMovieProps {}

export const CreateMovie = ({}: ICreateMovieProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormCreateMovie()

  const { data, isLoading, mutateAsync } =
    trpcClient.movies.createMovie.useMutation()

  console.log('errors', errors)
  const { toast } = useToast()
  const router = useRouter()
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log(data)
        const movie = await mutateAsync(data)
        if (movie) {
          reset()
          toast({ title: `Movie ${data.title} created successfully.` })
          revalidatePath('/admin/movies')
          router.replace('/admin/movies')
        }
      })}
    >
      <Label title="Title" error={errors.title?.message}>
        <Input {...register('title')} placeholder="Enter a movie title" />
      </Label>

      <Label title="Director name" error={errors.director?.message}>
        <Input {...register('director')} placeholder="Director Name" />
      </Label>

      <Label title="Duration" error={errors.duration?.message}>
        <Input
          {...register('duration', { valueAsNumber: true })}
          placeholder="Duration"
        />
      </Label>

      <Label title="Release Date" error={errors.releaseDate?.message}>
        <Input
          type="date"
          {...register('releaseDate', {
            setValueAs: (value) => {
              const date = new Date(value)
              return isNaN(date.getTime()) ? '' : date.toISOString()
            },
          })}
          placeholder="Release Date"
        />
      </Label>

      <Label title="Genre" error={errors.genre?.message}>
        <HtmlSelect placeholder="projection type" {...register('genre')}>
          {Object.values(Genre).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </HtmlSelect>
      </Label>

      <Button isLoading={isLoading} variant="default" type="submit">
        Submit
      </Button>
    </form>
  )
}
