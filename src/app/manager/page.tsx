import { StatCard } from '@/components/organisms/StatCard'
import { trpcServer } from '@/trpc/clients/server'
import { Key } from 'lucide-react'
import React from 'react'

export default async function page() {
  const dashboard = await trpcServer.managers.dashboard.query()

  return (
    <main className="flex flex-col gap-3">
      <StatCard title="Cinemas" href="/manager/cinemas">
        {dashboard.cinemas}
      </StatCard>
      <StatCard title="Movies" href="/manager/movies">
        {dashboard.movies}
      </StatCard>
    </main>
  )
}
