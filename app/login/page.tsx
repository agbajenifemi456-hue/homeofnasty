import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

export const instant = false;

export default function LoginPage() {
  
  async function login(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const user = await prisma.user.findUnique({ where: { email } })
    
    if (user && user.password === password) {
      const cookieStore = await cookies()
      cookieStore.set('user_email', user.email, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
      cookieStore.set('user_role', user.role, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
      
      if (user.role === 'admin') redirect('/admin')
      redirect('/')
    } else {
      redirect('/login?error=invalid')
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900/80 p-8 shadow-2xl ring-1 ring-white/10 sm:p-10">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-zinc-400">Log in to your account.</p>
        </div>

        <form action={login} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Email</label>
            <input name="email" type="email" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-sm text-white focus:border-red-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Password</label>
            <input name="password" type="password" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-sm text-white focus:border-red-500 focus:outline-none" />
          </div>
          
          <button type="submit" className="w-full rounded-xl bg-red-600 p-3.5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-red-500">
            Log In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-500">
            Don't have an account? <Link href="/register" className="text-red-500 hover:text-red-400 font-bold">Register here</Link>
          </p>
        </div>

      </div>
    </div>
  )
}