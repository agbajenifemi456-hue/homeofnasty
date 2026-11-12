import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { deleteVideo } from './deleteVideo' // Correct path

const prisma = new PrismaClient()

export const instant = false;

export default async function Home() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value
  const isAdmin = userRole === 'admin'

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-16 sm:px-16 sm:py-24 ring-1 ring-white/5">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl">
            Discover the <br/>
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
              Ultimate Collection
            </span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400">
            Premium, curated, and completely uncensored. Welcome to Nasty Home.
          </p>
        </div>
      </section>

      {/* Video Grid */}
      <section>
        <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Recently Added</h2>
        </div>
        
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 py-32">
            <p className="text-lg font-medium text-zinc-500">No videos found.</p>
            {isAdmin && (
              <Link href="/admin" className="mt-4 text-sm font-bold text-red-500 hover:text-red-400">
                Upload your first video &rarr;
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((video) => (
              <div key={video.id} className="group relative block">
                
                {/* DELETE BUTTON (Admin Only) */}
                {isAdmin && (
                  <form action={deleteVideo} className="absolute right-2 top-2 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <input type="hidden" name="videoId" value={video.id} />
                    <button 
                      type="submit" 
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-500 hover:scale-110 transition-all"
                      title="Delete Video"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </form>
                )}

                {/* Clickable Video Card */}
                <Link href={`/watch/${video.id}`}>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 transition-all duration-300 group-hover:ring-red-500/50 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                    <Image
                      src={video.thumbnail}
                      alt={video.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xl backdrop-blur-sm">
                        <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="truncate text-base font-bold text-zinc-200 transition-colors group-hover:text-white">
                      {video.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                      {video.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}