'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function addVideoAction(formData: FormData) {
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
  const imgbbKey = process.env.IMGBB_API_KEY

  try {
    if (!imgbbKey) {
      throw new Error('IMGBB_API_KEY is missing')
    }

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const base64Image = Buffer.from(bytes).toString('base64')
      
      const fd = new FormData()
      fd.append('image', base64Image)

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: 'POST',
        body: fd,
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(`ImgBB Error: ${JSON.stringify(data)}`)
      }
      
      thumbnailUrl = data.data.url
    }

    await prisma.video.create({
      data: { name, description, videoLink, thumbnail: thumbnailUrl }
    })

    return { success: true }
  } catch (error) {
    console.error("UPLOAD FAILED DETAILS:", error)
    return { error: 'Something went wrong while saving the video.' }
  } finally {
    await prisma.$disconnect()
  }
}