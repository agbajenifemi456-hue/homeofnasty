'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function likeVideo(formData: FormData) {
  const videoId = parseInt(formData.get('videoId') as string)
  const action = formData.get('action') as string

  try {
    if (action === 'like') {
      await prisma.video.update({ where: { id: videoId }, data: { likes: { increment: 1 } } })
    } else if (action === 'dislike') {
      await prisma.video.update({ where: { id: videoId }, data: { dislikes: { increment: 1 } } })
    }
  } catch (error) {
    console.error(error)
  }
  revalidatePath(`/watch/${videoId}`)
}