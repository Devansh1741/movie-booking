'use client'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Map } from '../organisms/Map/Map'
import { Panel } from '../organisms/Map/Panel'
import { DefaultZoomControls } from '../organisms/Map/ZoomControls'
import { LngLatBounds, useMap } from 'react-map-gl'
import { LocateIcon, MapPin, MapPinnedIcon, Pin } from 'lucide-react'
import { SimpleDialog } from '../molecules/SimpleDialog'
import { cities } from '@/utils/statis'
import { useGetCinema, useHandleSearch, useKeypress } from '@/utils/hooks'
import { trpcClient } from '@/trpc/clients/client'
import { Marker } from '../organisms/Map/MapMarker'
import { RouterOutputs } from '@/trpc/clients/types'
import { BrandIcon } from './CreateCinema'
import { SelectMovie } from '../organisms/SelectMovie'
import { SelectShowtimes } from '../organisms/SelectShowtime'
import { SelectSeats } from '../organisms/SelectSeats'

export interface ISearchCinemasProps {}

export const SearchCinemas = ({}: ISearchCinemasProps) => {
  return (
    <Map>
      <Panel position="right-center">
        <DefaultZoomControls />
      </Panel>

      <DisplayCinemas />

      <Panel position="left-top">
        <SetCity />
      </Panel>
    </Map>
  )
}

export const SetCity = () => {
  const [open, setOpen] = useState(false)
  const { current: map } = useMap()

  useKeypress(['l'], () => setOpen((state) => !state))

  return (
    <div>
      <button
        className="flex flex-col items-center gap-1"
        onClick={() => setOpen(true)}
      >
        <MapPinnedIcon />
        <div className="flex items-center justify-center w-4 h-4 border rounded shadow">
          L
        </div>
      </button>
      <SimpleDialog open={open} setOpen={setOpen} title="Select City">
        <div className="grid grid-cols-3 gap-3">
          {cities.map((city) => (
            <button
              onClick={() => {
                map?.flyTo({
                  center: { lat: city.lat, lng: city.lng },
                  zoom: 10,
                  essential: true,
                })
                setOpen(false)
              }}
              className="p-3 rounded hover:shadow-2xl transition-shadow border"
              key={city.id}
            >
              <div>{city.englishName}</div>
            </button>
          ))}
        </div>
      </SimpleDialog>
    </div>
  )
}

export const DisplayCinemas = () => {
  const { current: map } = useMap()

  const [bounds, setBounds] = useState<LngLatBounds>()

  useEffect(() => {
    const handleBounds = () => {
      const bounds = map?.getBounds()
      setBounds(bounds)
    }
    map?.on('load', handleBounds)
    map?.on('dragend', handleBounds)
    map?.on('zoomend', handleBounds)

    return () => {
      map?.off('dragend', handleBounds)
      map?.off('zoomend', handleBounds)
    }
  }, [map])

  const addressWhere = useMemo(
    () => ({
      ne_lat: bounds?._ne.lat || 0,
      ne_lng: bounds?._ne.lng || 0,
      sw_lat: bounds?._sw.lat || 0,
      sw_lng: bounds?._sw.lng || 0,
    }),
    [bounds],
  )

  const { data } = trpcClient.cinemas.searchCinemas.useQuery({ addressWhere })
  return (
    <>
      <MovieDialog />
      {data?.map((cinema) => <MarkerCinema key={cinema.id} cinema={cinema} />)}
    </>
  )
}

export const MarkerCinema = ({
  cinema,
}: {
  cinema: RouterOutputs['cinemas']['searchCinemas'][0]
}) => {
  //   const { addParam } = useHandleSearch()

  const { addParam } = useHandleSearch()

  if (!cinema.Address?.lat || !cinema.Address?.lng || !cinema.id) {
    return null
  }

  return (
    <Marker
      anchor="bottom"
      latitude={cinema.Address.lat}
      longitude={cinema.Address.lng}
      onClick={() => {
        addParam('cinemaId', cinema.id)
      }}
    >
      {/* <BrandIcon /> */}
      <MapPin fill="white" className="cursor-pointer" />
      <MarkerText>{cinema.name.split(' ').slice(0, 2).join(' ')}</MarkerText>
    </Marker>
  )
}

export const MovieDialog = () => {
  const { params, deleteAll } = useHandleSearch()

  const cinemaId = params.get('cinemaId')
  const movieId = params.get('movieId')
  const showtimeId = params.get('showtimeId')
  const screenId = params.get('screenId')

  const { cinema } = useGetCinema({ cinemaId })
  const { current: map } = useMap()
  const [openDialog, setOpenDialog] = useState(Boolean(cinemaId))

  useEffect(() => {
    if (cinema?.Address) {
      setOpenDialog(true)
      map?.flyTo({
        center: { lat: cinema.Address.lat, lng: cinema.Address.lng },
        zoom: 10,
      })
    } else {
      setOpenDialog(false)
    }
  }, [cinema, map])

  if (!cinema) return null

  return (
    <SimpleDialog
      title="Book tickets"
      open={openDialog}
      setOpen={(state) => {
        deleteAll()
        setOpenDialog(state)
      }}
    >
      {cinema?.name}
      <div>
        <SelectMovie cinemaId={cinema.id} />
        {movieId ? (
          <SelectShowtimes
            cinemaId={Number(cinemaId)}
            movieId={Number(movieId)}
            showtimeId={showtimeId ? +showtimeId : null}
          />
        ) : null}

        {screenId && showtimeId ? (
          <SelectSeats showtimeId={Number(showtimeId)} />
        ) : null}
      </div>
    </SimpleDialog>
  )
}

export const MarkerText = ({ children }: { children: ReactNode }) => (
  <div className="absolute max-w-xs -translate-x-1/2 left-1/2">
    <div className="mt-1 leading-4 text-center min-w-max px-0.5 rounded backdrop-blur-sm bg-white/50">
      {children}
    </div>
  </div>
)
