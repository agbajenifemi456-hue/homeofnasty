'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

export async function loginUser(formData: FormData) {
  const prisma = new PrismaClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || user.password !== password) {
      return { error: 'Invalid email or password.' }
    }

    let role = user.role
    if (user.email === 'agbajenifemi456@gmail.com') {
      role = 'admin'
      if (user.role !== 'admin') {
        await prisma.user.update({
          where: { email: user.email },
          data: { role: 'admin' }
        })
      }
    }

    const cookieStore = await cookies()
    cookieStore.set('user_email', user.email, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
    cookieStore.set('user_role', role, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })

    return { success: true, role: role }
  } catch (error) {
    console.error(error)
    return { error: 'Database connection failed. Please try again.' }
  } finally {
    await prisma.$disconnect()
  }
}