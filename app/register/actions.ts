'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

export async function registerUser(formData: FormData) {
  const prisma = new PrismaClient()
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { error: 'Email is already registered. Please log in.' }
    }

    const role = email === 'agbajenifemi456@gmail.com' ? 'admin' : 'user'
    const user = await prisma.user.create({ data: { username, email, password, role } })
    
    const cookieStore = await cookies()
    cookieStore.set('user_email', user.email, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
    cookieStore.set('user_role', user.role, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
    
    return { success: true, role: user.role }
  } catch (error) {
    console.error(error)
    return { error: 'Database error. Please try again.' }
  } finally {
    await prisma.$disconnect()
  }
}