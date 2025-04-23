// utils/FakeStripeService.ts
import { v4 as uuidv4 } from 'uuid'

type BookingInfo = {
  seats: { row: string; column: string }[]
  screenId: string
  showtimeId: string
  userId: string
  price: number
}

type Session = {
  id: string
  payment_method_types: string[]
  line_items: {
    quantity: number
    price_data: {
      product_data: { name: string }
      currency: string
      unit_amount: number
    }
  }[]
  mode: string
  success_url?: string
  cancel_url?: string
  metadata: {
    bookingInfo: string
    uid?: string
  }
  status: 'open' | 'paid' | 'cancelled'
}

export class StripeService {
  private sessions: Record<string, Session> = {}

  async createCheckoutSession({
    payment_method_types,
    line_items,
    mode,
    success_url,
    cancel_url,
    metadata,
  }: {
    payment_method_types: string[]
    line_items: Session['line_items']
    mode: string
    success_url?: string
    cancel_url?: string
    metadata: Session['metadata']
  }): Promise<{ id: string }> {
    const id = 'sess_' + uuidv4()
    this.sessions[id] = {
      id,
      payment_method_types,
      line_items,
      mode,
      success_url,
      cancel_url,
      metadata,
      status: 'open',
    }

    return { id }
  }

  async retrieveSession(sessionId: string): Promise<Session> {
    const session = this.sessions[sessionId]
    if (!session) throw new Error('Session not found')
    return session
  }

  async simulatePayment(sessionId: string): Promise<void> {
    if (!this.sessions[sessionId]) throw new Error('Invalid session ID')
    this.sessions[sessionId].status = 'paid'
  }

  async cancelSession(sessionId: string): Promise<void> {
    if (!this.sessions[sessionId]) throw new Error('Invalid session ID')
    this.sessions[sessionId].status = 'cancelled'
  }
}
