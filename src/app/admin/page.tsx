import { StatCard } from '@/components/organisms/StatCard'
import { trpcServer } from '@/trpc/clients/server'
import { Key } from 'lucide-react'
import React from 'react'

export default async function page() {
  const dashboard = await trpcServer.admins.dashboard.query()

  return (
    <main className="flex flex-col gap-3">
      <StatCard title={'Cinemas'} href="/admin/admins">
        {dashboard.cinemas}
      </StatCard>
      <StatCard title={'Movies'} href="/admin/movies">
        {dashboard.movies}
      </StatCard>
      <StatCard title={'Users'}>{dashboard.users}</StatCard>
      <StatCard title={'Managers'} href="/admin/managers">
        {dashboard.managers}
      </StatCard>
      <StatCard title={'Admins'} href="/admin/admins">
        {dashboard.admins}
      </StatCard>
    </main>
  )
}
