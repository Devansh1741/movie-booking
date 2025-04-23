import { trpcServer } from '@/trpc/clients/server'
import { redirect } from 'next/navigation'

type Booking = {
  session_id: string
  screenId: number
  seats: string
  showtimeId: number
  price: number
  userId: string
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const bookingString = searchParams?.booking as string
  const booking = JSON.parse(bookingString) as Booking
  const seats = JSON.parse(booking.seats)
  console.log(booking)
  if (!booking.session_id) {
    return <div>Session id is missing</div>
  }

  const ticket = await trpcServer.stripe.checkout.mutate({ ...booking, seats })

  if (ticket?.id) {
    redirect('user/tickets')
  }

  return <div></div>
}
