'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function addComment(formData: FormData) {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get('user_email')?.value

  if (!userEmail) return { error: 'You must be logged in to comment.' }

  const text = formData.get('text') as string
  const videoId = parseInt(formData.get('videoId') as string)

  try {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return { error: 'User not found.' }

    await prisma.comment.create({ data: { text, userId: user.id, videoId } })
    revalidatePath(`/watch/${videoId}`)
    return { success: true }
  } catch (error) {
    return { error: 'Failed to post comment.' }
  } finally {
    await prisma.$disconnect()
  }
}