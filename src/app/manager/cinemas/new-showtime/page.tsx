'use client'

import CreateShowTimes from '@/components/templates/CreateShowTime'
import { FormProviderScreateShowtime } from '@/forms/createShowtime'

export default function Page() {
  return (
    <FormProviderScreateShowtime>
      <CreateShowTimes />
    </FormProviderScreateShowtime>
  )
}
