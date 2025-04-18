'use client'

import { CreateCinema } from '@/components/templates/CreateCinema'
import { FormProviderCreateCinema } from '@/forms/createCinema'

export default async function Page() {
  return (
    <FormProviderCreateCinema>
      <CreateCinema />
    </FormProviderCreateCinema>
  )
}
