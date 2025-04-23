import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '..'
import { TRPCError } from '@trpc/server'
import { format } from 'date-fns'
import * as bwipjs from 'bwip-js'
import bufferUpload from '@/utils/upload/bufferUpload'

const schemaPayment = z.object({
  session_id: z.string(),
  userId: z.string(),
  screenId: z.number(),
  showtimeId: z.number(),
  price: z.number(),
  seats: z.array(z.object({ column: z.number(), row: z.number() })),
})

export const stripeRoutes = createTRPCRouter({
  checkout: protectedProcedure()
    .input(schemaPayment)
    .mutation(async ({ ctx, input: bookingInfo }) => {
      if (!bookingInfo) {
        throw new TRPCError({
          message: 'Payload missing',
          code: 'UNPROCESSABLE_CONTENT',
        })
      }

      const success = true

      if (success) {
        const { seats, screenId, showtimeId, userId } = bookingInfo
        const ticket = await ctx.db.ticket.create({
          data: {
            uid: userId,
            Bookings: {
              create: seats.map((seat) => ({
                row: +seat.row,
                column: +seat.column,
                screenId: +screenId,
                showtimeId: +showtimeId,
                userId,
              })),
            },
          },
          include: {
            Bookings: {
              include: { Seat: true, Showtime: { include: { Movie: true } } },
            },
          },
        })

        const qrData = {
          userId: ticket.uid,
          ticketId: ticket.id,
          seats: ticket.Bookings.map(
            (booking) => `${booking.Seat.row}-${booking.Seat.column}`,
          ),
          time: format(new Date(ticket.Bookings[0].Showtime.startTime), 'PPp'),
        }

        const png = await bwipjs.toBuffer({
          bcid: 'qrcode',
          text: JSON.stringify(qrData),
          textxalign: 'center',
        })

        const qrCodeRes = await bufferUpload(png, 'QR_Code')

        if (!qrCodeRes.status) {
          throw new TRPCError({
            message: 'QR image could not be created',
            code: 'INTERNAL_SERVER_ERROR',
          })
        }
        // Update the ticket with the QR code URL
        const updatedTicket = await ctx.db.ticket.update({
          where: { id: ticket.id },
          data: {
            qrCode: `https://res.cloudinary.com/do5r2uhax/image/upload/v1745133946/${qrCodeRes.result.public_id}`,
          }, // Assuming 'qrCode' field exists in ticket model
        })
        return ticket
      }
    }),
})
