'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addVideoAction } from './actions'

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    // Call the server action
    const result = await addVideoAction(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // If successful, smoothly route to the homepage without crashing
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-900/80 p-8 shadow-2xl ring-1 ring-white/10 sm:p-10">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Upload Video</h1>
            <p className="mt-2 text-sm text-zinc-400">Add new content to HomeOfNasty.</p>
          </div>
          <span className="rounded-full bg-red-600/20 px-3 py-1 text-xs font-bold text-red-500 ring-1 ring-red-600/30 uppercase tracking-widest">
            Admin
          </span>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-600/20 p-3 text-center text-sm font-bold text-red-500 ring-1 ring-red-600/30">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Video Name</label>
            <input name="name" required placeholder="e.g. Midnight Session" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-sm text-white transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Description</label>
            <textarea name="description" required rows={3} placeholder="Write a short description..." className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-sm text-white transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Video Link (Embed)</label>
            <input name="videoLink" required placeholder="https://www.youtube.com/embed/..." className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-sm text-white transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Thumbnail Image</label>
            <input type="file" name="thumbnail" accept="image/*" required className="w-full cursor-pointer rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-zinc-700" />
          </div>

          <button disabled={loading} type="submit" className="mt-2 w-full rounded-xl bg-red-600 p-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50">
            {loading ? 'Publishing...' : 'Publish Video'}
          </button>

        </form>
      </div>
    </div>
  )
}