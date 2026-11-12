'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from './actions' // We will create this next

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    const result = await registerUser(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      // Wait 2 seconds so the user can read the success message
      setTimeout(() => {
        router.push(result.role === 'admin' ? '/admin' : '/')
      }, 2000)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900/80 p-8 shadow-2xl ring-1 ring-white/10 sm:p-10">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">Create Account</h1>
          <p className="mt-2 text-sm text-zinc-400">Join Nasty Home today.</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-600/20 p-3 text-center text-sm font-bold text-red-500 ring-1 ring-red-600/30">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success ? (
          <div className="rounded-xl bg-green-600/20 p-6 text-center ring-1 ring-green-600/30">
            <svg className="mx-auto mb-3 h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-lg font-bold text-white">Registration Successful!</h2>
            <p className="mt-1 text-sm text-zinc-400">Taking you to the dashboard...</p>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Username</label>
              <input name="username" type="text" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Email</label>
              <input name="email" type="email" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Password</label>
              <input name="password" type="password" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            
            <button disabled={loading} type="submit" className="w-full rounded-xl bg-red-600 p-3.5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-red-500 disabled:opacity-50">
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-500">
            Already have an account? <Link href="/login" className="text-red-500 hover:text-red-400 font-bold">Log in here</Link>
          </p>
        </div>

      </div>
    </div>
  )
}