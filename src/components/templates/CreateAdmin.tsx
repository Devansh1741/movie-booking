'use client'
import { useFormCreateAdmin } from '@/forms/createAdmin'
import { trpcClient } from '@/trpc/clients/client'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { useToast } from '../molecules/Toaster/use-toast'
import { revalidatePath } from '@/utils/actions/revalidate'
import { useEffect } from 'react'

export const CreateAdmin = () => {
  const { register, handleSubmit, reset } = useFormCreateAdmin()

  const {
    mutateAsync: createAdmin,
    isLoading,
    error,
    data,
  } = trpcClient.admins.create.useMutation()

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
  }, [data, toast, reset])

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await createAdmin(data)
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
