'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateThumbnail(formData: FormData) {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value

  if (userRole !== 'admin') throw new Error('Unauthorized')

  const videoId = parseInt(formData.get('videoId') as string)
  const file = formData.get('thumbnail') as File

  let thumbnailUrl = ''

  try {
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const base64Image = Buffer.from(bytes).toString('base64')
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
        method: 'POST',
        body: (() => {
          const fd = new FormData()
          fd.append('image', base64Image)
          return fd
        })(),
      })

      const data = await response.json()
      if (!data.success) throw new Error('ImgBB upload failed')
      
      thumbnailUrl = data.data.url

      await prisma.video.update({
        where: { id: videoId },
        data: { thumbnail: thumbnailUrl }
      })
    }
  } catch (error) {
    console.error(error)
  }

  revalidatePath('/')
}