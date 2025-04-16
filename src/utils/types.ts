import { ReactNode } from 'react'

export type Role = 'admin' | 'manager'

export type BaseComponent = {
  children?: ReactNode
  className?: string
}

export type CloudinaryResult = {
  event: 'success'
  info: {
    secure_url: string
    public_id: string
    [key: string]: any
  }
}
