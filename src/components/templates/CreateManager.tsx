'use client'
import { useFormCreateManager } from '@/forms/createManager'
import { trpcClient } from '@/trpc/clients/client'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { useToast } from '../molecules/Toaster/use-toast'
import { revalidatePath } from '@/utils/actions/revalidate'
import { useEffect } from 'react'

export const CreateManager = () => {
  const { register, handleSubmit, reset } = useFormCreateManager()

  const {
    mutateAsync: createManager,
    isLoading,
    data,
    error,
  } = trpcClient.managers.create.useMutation()

  const { toast } = useToast()

  useEffect(() => {
    if (error) {
      toast({ title: error.message })
    }
  }, [error, toast])

  useEffect(() => {
    if (data) {
      reset()
      toast({ title: 'Admin Created' })
      revalidatePath('/admin/admins')
    }
  }, [data, reset, toast])

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const manager = await createManager(data)

        if (manager) {
          reset()
          toast({ title: 'Manager Created' })
          revalidatePath('/admin/managers')
        } else {
          toast({ title: 'Action Failed' })
        }
      })}
    >
      <Label title="UID">
        <Input placeholder="Enter the uid" {...register('id')} />
      </Label>
      <Button type="submit" isLoading={isLoading}>
        Submit
      </Button>
    </form>
  )
}
