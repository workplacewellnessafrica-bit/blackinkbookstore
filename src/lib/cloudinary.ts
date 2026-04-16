import { v2 as cloudinary } from 'cloudinary'

let isConfigured = false

function ensureConfig() {
  if (isConfigured) return
  
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    })
    isConfigured = true
  }
}

/**
 * Uploads an image to Cloudinary using a buffer
 */
export async function uploadToCloudinary(file: File) {
  ensureConfig()
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'blackink-books' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })
}

export { cloudinary }
