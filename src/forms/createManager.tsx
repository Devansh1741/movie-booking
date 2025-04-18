import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const schemaCreateManager = z.object({
  id: z.string().min(1, { message: 'Manager id is required' }),
})

export type FormTypeCreateManager = z.infer<typeof schemaCreateManager>

export const useFormCreateManager = () =>
  useForm<FormTypeCreateManager>({ resolver: zodResolver(schemaCreateManager) })
