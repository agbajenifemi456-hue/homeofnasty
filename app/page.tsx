import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { VideoCard } from './VideoCard'
import { AdBanner } from './AdBanner'

const prisma = new PrismaClient()

export default async function Home() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value
  const isAdmin = userRole === 'admin'

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8 sm:space-y-12 pb-20">
      
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-12 sm:px-16 sm:py-24 ring-1 ring-white/5">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-red-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-7xl">
            Discover the <br/>
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
              Ultimate Collection
            </span>
          </h1>
          <p className="mt-4 text-sm sm:mt-6 sm:text-lg text-zinc-400">
            Premium, curated, and completely uncensored. Welcome to HomeOfNasty.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-6 sm:mb-8 flex items-end justify-between border-b border-white/5 pb-4">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white">Recently Added</h2>
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </section>

      {/* 320x50 BANNER AT THE BOTTOM */}
      <div className="flex flex-col items-center justify-center border-t border-white/5 pt-8 pb-4">
        <span className="mb-2 text-[10px] uppercase tracking-widest text-zinc-600">Advertisement</span>
        <AdBanner 
          width={320} 
          height={50} 
          adKey="486caba38baa41d56508e2453b004a56" 
          adSrc="https://biomanos.org/22/486caba38baa41d56508e2453b004a56" 
        />
      </div>

    </div>
  )
}