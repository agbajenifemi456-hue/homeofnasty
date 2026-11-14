'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function getMessages() {
  try {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' },
      take: 50
    })
    return messages
  } catch (error) {
    return []
  }
}

export async function sendMessage(formData: FormData) {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get('user_email')?.value

  if (!userEmail) return { error: 'You must be logged in to chat.' }

  const text = formData.get('text') as string
  const replyTo = formData.get('replyTo') as string | null
  
  if (!text || text.trim() === '') return { error: 'Message is empty.' }

  // LINK BLOCKER
  const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi
  if (linkRegex.test(text)) {
    return { error: 'Links are not allowed! Spamming links will get you muted.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return { error: 'User not found.' }

    // CHECK IF MUTED
    if (user.mutedUntil && user.mutedUntil > new Date()) {
      return { error: `You are muted until ${user.mutedUntil.toLocaleTimeString()}` }
    }

    // Check for fighting words (Simple filter - add more as you see fit)
    const badWords = ['fuck', 'shit', 'bitch', 'idiot', 'stupid']
    const isFighting = badWords.some(word => text.toLowerCase().includes(word))
    
    if (isFighting) {
      // Mute for 30 mins
      const muteTime = new Date(Date.now() + 30 * 60 * 1000)
      await prisma.user.update({ where: { id: user.id }, data: { mutedUntil: muteTime } })
      return { error: 'Inappropriate language detected. You have been muted for 30 minutes.' }
    }

    await prisma.chatMessage.create({
      data: { text, username: user.username, replyTo: replyTo || null }
    })

    return { success: true }
  } catch (error) {
    return { error: 'Failed to send message.' }
  } finally {
    await prisma.$disconnect()
  }
}

export async function deleteMessage(formData: FormData) {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value

  if (userRole !== 'admin') return { error: 'Unauthorized' }

  const messageId = parseInt(formData.get('messageId') as string)

  try {
    await prisma.chatMessage.delete({ where: { id: messageId } })
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete message.' }
  }
}