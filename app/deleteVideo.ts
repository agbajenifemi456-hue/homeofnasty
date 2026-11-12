'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export async function deleteVideo(formData: FormData) {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value

  // Security check: Only admin can delete
  if (userRole !== 'admin') {
    throw new Error('Unauthorized')
  }

  const videoId = parseInt(formData.get('videoId') as string)

  // Find the video first so we can delete the image file
  const video = await prisma.video.findUnique({
    where: { id: videoId }
  })

  if (video) {
    // 1. Delete the image file from the public folder
    if (video.thumbnail) {
      const filepath = path.join(process.cwd(), 'public', video.thumbnail)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
    }

    // 2. Delete from the database
    await prisma.video.delete({
      where: { id: videoId }
    })
  }

  // Refresh the homepage so the video disappears instantly
  revalidatePath('/')
}