// src/utils/config/cloudinary.ts
import { v2 as cloudinaryType } from 'cloudinary'

let cloudinary: typeof cloudinaryType | undefined
if (typeof window === 'undefined') {
  cloudinary = require('cloudinary').v2 // Use require in server-side context

  if (cloudinary) {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }
}

export default cloudinary

export interface CloudinaryResource {
  context?: {
    alt?: string
    caption?: string
  }
  public_id: string
  secure_url: string
}
