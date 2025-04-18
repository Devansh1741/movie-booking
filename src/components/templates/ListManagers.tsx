import { trpcServer } from '@/trpc/clients/server'
import { Title2 } from '../atoms/typography'
import { UserCard } from '../organisms/UserCard'

export const ListManagers = async () => {
  const managers = await trpcServer.managers.findAll.query()

  return (
    <div className="mt-6">
      <Title2>Managers</Title2>
      <div className="flex gap-10 md:gap-5 flex-wrap">
        {managers?.map(({ User: { id, image, name } }) => (
          <UserCard key={id} user={{ id, image, name }} />
        ))}
      </div>
    </div>
  )
}
