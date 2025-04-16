'use client'

import { FormTypeCreateCinema } from '@/forms/createCinema'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { TextArea } from '../atoms/textArea'
import { Button } from '../atoms/button'
import { trpcClient } from '@/trpc/clients/client'
import { useToast } from '../molecules/Toaster/use-toast'
import { useRouter } from 'next/navigation'
import { revalidatePath } from '@/utils/actions/revalidate'
import { HtmlSelect } from '../atoms/select'
import { ProjectionType, SoundSystemType } from '@prisma/client'
import { Grid } from '../organisms/ScreenUtils'

export const CreateCinema = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormContext<FormTypeCreateCinema>()

  const { mutateAsync: createCinema, isLoading } =
    trpcClient.cinemas.createCinema.useMutation()
  console.log(errors)

  const { toast } = useToast()
  const router = useRouter()
  return (
    <div>
      <form
        onSubmit={handleSubmit(async (data) => {
          console.log('data', data)
          const cinema = await createCinema(data)

          if (cinema) {
            reset()
            toast({ title: `Cinema ${data.cinemaName} created` })
            revalidatePath('/admin/cinemas')
            router.replace('/admin/cinemas')
          }
        })}
      >
        <Label title="Cinema" error={errors.cinemaName?.message}>
          <Input placeholder="Cinema name" {...register('cinemaName')} />
        </Label>

        <Label title="Manager ID" error={errors.managerId?.message}>
          <Input placeholder="Manager ID" {...register('managerId')} />
        </Label>

        <Label title="Address" error={errors.address?.address?.message}>
          <TextArea placeholder="Address" {...register('address.address')} />
        </Label>

        <AddScreens />

        <Button type="submit" isLoading={isLoading}>
          Create Cinema
        </Button>
      </form>
    </div>
  )
}

const AddScreens = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormTypeCreateCinema>()

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'screens',
  })

  const { screens } = useWatch<FormTypeCreateCinema>()

  return (
    <div>
      {fields.map((screen, screenIndex) => {
        return (
          <div key={screen.id}>
            <div className={`flex justify-end my-2`}>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-xs text-gray-600 underline underline-offset-2"
                onClick={() => {
                  remove(screenIndex)
                }}
              >
                remove screen
              </Button>
            </div>

            <div className={`flex flex-col gap-2`}>
              <div className="grid grid-cols-2 gap-2">
                <Label
                  title="Projection type"
                  error={errors.screens?.[screenIndex]?.type?.toString()}
                >
                  <HtmlSelect
                    placeholder="projection type"
                    {...register(`screens.${screenIndex}.projectionType`)}
                  >
                    {Object.values(ProjectionType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </HtmlSelect>
                </Label>
                <Label
                  title="Sound system type"
                  error={errors.screens?.[screenIndex]?.type?.toString()}
                >
                  <HtmlSelect
                    placeholder="sound system type"
                    {...register(`screens.${screenIndex}.soundSystemType`)}
                  >
                    {Object.values(SoundSystemType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </HtmlSelect>
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Label
                  title="Rows"
                  error={errors.screens?.[screenIndex]?.rows?.message}
                >
                  <Input
                    placeholder="Enter the name"
                    {...register(`screens.${screenIndex}.rows`, {
                      valueAsNumber: true,
                    })}
                  />
                </Label>
                <Label
                  title="Columns"
                  error={errors.screens?.[screenIndex]?.columns?.message}
                >
                  <Input
                    type="number"
                    placeholder="Enter the name"
                    {...register(`screens.${screenIndex}.columns`, {
                      valueAsNumber: true,
                    })}
                  />
                </Label>
                <Label
                  title="Price"
                  error={errors.screens?.[screenIndex]?.price?.message}
                >
                  <Input
                    type="number"
                    placeholder="Enter the price"
                    {...register(`screens.${screenIndex}.price`, {
                      valueAsNumber: true,
                    })}
                  />
                </Label>
              </div>
              <Grid
                rows={screens?.[screenIndex]?.rows || 0}
                columns={screens?.[screenIndex]?.columns || 0}
              />
            </div>
          </div>
        )
      })}
      <div className={`flex justify-end my-2`}>
        <Button
          variant="link"
          size="sm"
          className="text-xs text-gray-600 underline underline-offset-2"
          onClick={() => {
            append({
              columns: 0,
              price: 0,
              projectionType: 'IMAX',
              rows: 0,
              soundSystemType: 'IMAX_ENHANCED',
            })
          }}
        >
          add screen
        </Button>
      </div>
    </div>
  )
}
