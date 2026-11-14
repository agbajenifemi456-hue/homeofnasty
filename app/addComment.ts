'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function addComment(formData: FormData): Promise<void> {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get('user_email')?.value

  if (!userEmail) return

  const text = formData.get('text') as string
  const videoId = parseInt(formData.get('videoId') as string)

  try {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return

    await prisma.comment.create({ 
      data: { text, userId: user.id, videoId } 
    })
    
    revalidatePath(`/watch/${videoId}`)
  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}