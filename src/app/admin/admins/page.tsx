import { CreateAdmin } from '@/components/templates/CreateAdmin'
import { ListAdmins } from '@/components/templates/ListAdmin'

export default function Page() {
  return (
    <div>
      <div>Manage Admins</div>
      <CreateAdmin />
      <ListAdmins />
    </div>
  )
}
