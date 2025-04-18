import Link from 'next/link'
import { ReactNode } from 'react'

export const StatCard = ({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: ReactNode
}) => {
  const Comp = title !== 'users' ? Link : 'div'
  return (
    <Comp href={href || '/'} className="p-4 border rounded-lg shadow-lg">
      <div className="text-lg capitalize">{title}</div>
      <div className="text-2xl font-bold">{children}</div>
    </Comp>
  )
}
