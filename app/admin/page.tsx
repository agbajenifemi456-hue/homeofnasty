import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { v2 as cloudinary } from 'cloudinary'
import { revalidatePath } from 'next/cache' // Added to fix the crash

const prisma = new PrismaClient()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function addVideo(formData: FormData) {
  'use server'
  
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value

  if (userRole !== 'admin') throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const videoLink = formData.get('videoLink') as string
  const file = formData.get('thumbnail') as File

  let thumbnailUrl = ''

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'homeofnasty' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })
    
    thumbnailUrl = uploadResponse.secure_url
  }

  await prisma.video.create({
    data: { name, description, videoLink, thumbnail: thumbnailUrl }
  })

  // Force the homepage to clear its cache and show the new video
  revalidatePath('/')

  redirect('/')
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value

  if (userRole !== 'admin') {
    redirect('/login')
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

        <form action={addVideo} className="space-y-6">
          
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

          <button type="submit" className="mt-2 w-full rounded-xl bg-red-600 p-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            Publish Video
          </button>

        </form>
      </div>
    </div>
  )
}