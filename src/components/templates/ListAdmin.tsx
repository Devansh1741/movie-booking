import { trpcServer } from '@/trpc/clients/server'
import { Title2 } from '../atoms/typography'
import { UserCard } from '../organisms/UserCard'

export const ListAdmins = async () => {
  const admins = await trpcServer.admins.findAll.query()

  return (
    <div className="mt-6">
      <Title2>Admins</Title2>
      <div className="flex gap-10 md:gap-5 flex-wrap">
        {admins?.map(({ User: { id, image, name } }) => (
          <UserCard key={id} user={{ id, image, name }} />
        ))}
      </div>
    </div>
  )
}
