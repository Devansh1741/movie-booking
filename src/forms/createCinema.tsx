import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectionType, SoundSystemType } from '@prisma/client'
import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export const schemaCreateScreen = z.object({
  projectionType: z.nativeEnum(ProjectionType),
  soundSystemType: z.nativeEnum(SoundSystemType),
  rows: z.number().min(1).max(15),
  columns: z.number().min(1).max(15),
  price: z.number().min(10),
})

export const schemaCreateAddress = z.object({
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
})

export const schemaCreateCinema = z.object({
  managerId: z.string().min(1, { message: 'Manager Id is required' }),
  cinemaName: z.string().min(1, { message: 'Cinema name is required' }),
  address: schemaCreateAddress,
  screens: z.array(schemaCreateScreen),
})

export type FormTypeCreateCinema = z.infer<typeof schemaCreateCinema>

export const useFormCreateCinema = () =>
  useForm<FormTypeCreateCinema>({
    resolver: zodResolver(schemaCreateCinema),
    defaultValues: {
      address: { address: '', lat: 0, lng: 0 },
      cinemaName: '',
      screens: [],
    },
  })

export const FormProviderCreateCinema = ({
  children,
}: {
  children: ReactNode
}) => {
  const methods = useFormCreateCinema()
  return <FormProvider {...methods}>{children}</FormProvider>
}
