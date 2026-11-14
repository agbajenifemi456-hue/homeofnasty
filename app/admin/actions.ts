'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function addVideoAction(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value

  if (userRole !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const videoLink = formData.get('videoLink') as string
  const file = formData.get('thumbnail') as File

  let thumbnailUrl = ''

  try {
    if (file && file.size > 0) {
      // Convert image to base64 for ImgBB upload
      const bytes = await file.arrayBuffer()
      const base64Image = Buffer.from(bytes).toString('base64')

      const formDataImgBB = new FormData()
      formDataImgBB.append('image', base64Image)

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
        method: 'POST',
        body: formDataImgBB,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error('ImgBB upload failed')
      }

      thumbnailUrl = data.data.url
    }

    await prisma.video.create({
      data: { name, description, videoLink, thumbnail: thumbnailUrl }
    })

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong while saving the video.' }
  } finally {
    await prisma.$disconnect()
  }
}