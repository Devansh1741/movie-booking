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
import { Map } from '../organisms/Map/Map'
import { Marker } from '../organisms/Map/MapMarker'
import { Panel } from '../organisms/Map/Panel'
import { CenterOfMap, DefaultZoomControls } from '../organisms/Map/ZoomControls'
import { RectangleHorizontal } from 'lucide-react'
import { SimpleAccordion } from '../molecules/SimpleAccordian'
import { SearchPlace } from '../organisms/SearchPlace'

export const CreateCinema = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useFormContext<FormTypeCreateCinema>()

  const { mutateAsync: createCinema, isLoading } =
    trpcClient.cinemas.createCinema.useMutation()
  const formData = useWatch()
  // console.log('formData', formData)
  const { toast } = useToast()
  const router = useRouter()
  return (
    <div className="grid grid-cols-2 gap-4">
      <form
        onSubmit={handleSubmit(async (data) => {
          const cinema = await createCinema(data)

          if (cinema) {
            reset()
            toast({ title: `Cinema ${data.cinemaName} created` })
            revalidatePath('/admin/cinemas')
            revalidatePath('/manager')
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

      <Map
        initialViewState={{
          longitude: 80.2,
          latitude: 12.9,
          zoom: 8,
        }}
      >
        <MapMarker />

        <Panel position="left-top">
          {/* <SearchBox
            onChange={({ lat, lng }) => {
              setValue('address.lat', lat, { shouldValidate: true })
              setValue('address.lng', lng, { shouldValidate: true })
            }}
          /> */}
          <SearchPlace />
          <DefaultZoomControls>
            <CenterOfMap
              onClick={(latLng) => {
                const lat = parseFloat(latLng.lat.toFixed(6))
                const lng = parseFloat(latLng.lng.toFixed(6))

                setValue('address.lat', lat, { shouldValidate: true })
                setValue('address.lng', lng, { shouldValidate: true })
              }}
            />
          </DefaultZoomControls>
        </Panel>
      </Map>
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
          <SimpleAccordion title={`Screen ${screenIndex + 1}`} key={screen.id}>
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
          </SimpleAccordion>
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

const MapMarker = () => {
  const { address } = useWatch<FormTypeCreateCinema>()
  const { setValue } = useFormContext<FormTypeCreateCinema>()

  return (
    <Marker
      pitchAlignment="auto"
      longitude={address?.lng || 0}
      latitude={address?.lat || 0}
      draggable
      onDragEnd={({ lngLat }) => {
        const { lat, lng } = lngLat
        setValue('address.lat', lat || 0)
        setValue('address.lng', lng || 0)
      }}
    >
      <BrandIcon />
    </Marker>
  )
}

export const BrandIcon = () => (
  <div style={{ perspective: '20px' }}>
    <RectangleHorizontal style={{ transform: 'rotateX(22deg)' }} />
  </div>
)
