import cloudinary from '../config/cloudinary'
import streamifier from 'streamifier'

export default async function bufferUpload(
  buffer: Buffer,
  folder: string,
): Promise<{ status: boolean; result?: any; error?: string }> {
  return new Promise((resolve, reject) => {
    if (cloudinary) {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder, // Pass the folder dynamically
          resource_type: 'image', // Automatically detect file type
        },
        (error, result) => {
          if (error) {
            return resolve({ status: false, error: 'Cloudinary upload failed' }) // Rejects as status false with error message
          }
          // Resolve with a success status and result
          resolve({ status: true, result })
        },
      )

      // Create a readable stream from the buffer and pipe to Cloudinary's uploader stream
      const bufferStream = streamifier.createReadStream(buffer)
      bufferStream.pipe(stream)
    } else {
      resolve({ status: false, error: 'Cloudinary not found' }) // Return status false if cloudinary is undefined
    }
  })
}
