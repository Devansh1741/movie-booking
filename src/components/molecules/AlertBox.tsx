import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface IAlertBoxProps {
  children: ReactNode
  className?: string
}

export const AlertBox = ({ children, className }: IAlertBoxProps) => {
  return (
    <div
      className={cn(
        'flex items-center rounded justify-center py-12 bg-gray-100',
        className,
      )}
    >
      {children}
    </div>
  )
}
