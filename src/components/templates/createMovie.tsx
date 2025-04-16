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

import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { CloudinaryResult } from '@/utils/types'
import { useRef, useState } from 'react'
import { Trash, Trash2 } from 'lucide-react'
import { FileUpload } from '../atoms/fileUpload'

export interface ICreateMovieProps {}

export const CreateMovie = ({}: ICreateMovieProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useFormCreateMovie()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    data,
    isLoading,
    mutateAsync: createMovie,
  } = trpcClient.movies.createMovie.useMutation()

  const { toast } = useToast()
  const router = useRouter()
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (imageFile) {
          setImageUploadLoading(true)
          const formData = new FormData()
          formData.append('file', imageFile)
          formData.append('upload_preset', 'yf_directory_poster')
          const uploadRes = await fetch(
            'https://api.cloudinary.com/v1_1/do5r2uhax/image/upload',
            {
              method: 'POST',
              body: formData,
            },
          )

          const uploadData = await uploadRes.json()
          if (!uploadRes.ok) {
            toast({ title: `Poster upload failed. Please try again` })
            return
          }
          const posterUrl = uploadData.secure_url
          data.posterUrl = posterUrl
        }
        const movie = await createMovie(data)
        setImageUploadLoading(false)
        if (movie) {
          reset()
          toast({ title: `Movie ${data.title} created successfully.` })
          revalidatePath('/admin/movies')
          router.replace('/admin/movies')
        }
      })}
    >
      <div className="flex gap-10">
        <div className="w-[60%]">
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
          <Button
            className="w-full"
            isLoading={isLoading || imageUploadLoading}
            variant="default"
            type="submit"
          >
            Submit
          </Button>
        </div>

        <div className="w-[40%]">
          <div className="flex justify-between gap-2 ">
            <Label title="Poster">
              <FileUpload
                ref={fileInputRef}
                imageFile={imageFile}
                setImageFile={setImageFile}
                accept="image/*"
                multiple={false}
              />
            </Label>

            <Trash2
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
                setImageFile?.(null)
              }}
              className="my-auto hover:cursor-pointer"
            />
          </div>
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="poster"
              className="w-80 h-auto mt-4"
            />
          )}
        </div>
      </div>
    </form>
  )
}
