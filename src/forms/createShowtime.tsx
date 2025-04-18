import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export const schemaCreateShowtime = z.object({
  movieId: z.number(),
  screenId: z.number(),
  showtimes: z.array(z.object({ time: z.string() })),
})

export type FormTypeCreateShowtime = z.infer<typeof schemaCreateShowtime>

export const useFormCreateShowtime = () =>
  useForm<FormTypeCreateShowtime>({
    resolver: zodResolver(schemaCreateShowtime),
    // defaultValues: { movieId: -99, screenId: -99, showtimes: [] },
  })

export const FormProviderScreateShowtime = ({
  children,
}: {
  children: ReactNode
}) => {
  const methods = useFormCreateShowtime()
  return <FormProvider {...methods}>{children}</FormProvider>
}
