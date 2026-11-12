import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const prisma = new PrismaClient()

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const video = await prisma.video.findUnique({
    where: { id: parseInt(id) }
  })

  if (!video) {
    notFound()
  }

  const relatedVideos = await prisma.video.findMany({
    where: { NOT: { id: video.id } },
    take: 4,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="mx-auto max-w-7xl py-2 sm:py-6">
      
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3">
        
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          
          <div className="aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-black ring-1 ring-white/10 shadow-2xl shadow-red-900/20">
            {video.videoLink ? (
              <iframe
                src={video.videoLink}
                className="h-full w-full"
                allowFullScreen
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                <p className="text-zinc-500">No video link provided.</p>
              </div>
            )}
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-zinc-900/40 p-4 sm:p-6 ring-1 ring-white/10 backdrop-blur-md">
            <h1 className="text-xl font-black text-white sm:text-3xl">{video.name}</h1>
            <p className="mt-2 sm:mt-4 text-sm leading-relaxed text-zinc-400">
              {video.description}
            </p>
          </div>

          <div className="flex h-20 sm:h-24 w-full items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">Adsterra Banner Space (728x90)</span>
          </div>

        </div>

        <div className="space-y-4 sm:space-y-6">
          <h2 className="border-b border-white/10 pb-2 sm:pb-3 text-lg font-bold text-white">Up Next</h2>
          
          {relatedVideos.length === 0 ? (
            <p className="text-sm text-zinc-500">No other videos yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {relatedVideos.map((relVideo) => (
                <Link key={relVideo.id} href={`/watch/${relVideo.id}`} className="group flex gap-3 sm:gap-4">
                  <div className="relative h-16 w-28 sm:h-20 sm:w-36 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-white/10">
                    <Image
                      src={relVideo.thumbnail}
                      alt={relVideo.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-red-500 transition-colors">
                      {relVideo.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}