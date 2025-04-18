import { CreateManager } from '@/components/templates/CreateManager'
import { ListManagers } from '@/components/templates/ListManagers'

export default async function Page() {
  return (
    <div>
      <div>Manager Managers</div>

      <CreateManager />
      <ListManagers />
    </div>
  )
}
