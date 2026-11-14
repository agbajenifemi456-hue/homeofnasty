import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'

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

          {/* ADSTERRA 728x90 BANNER */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/30 py-4">
            <span className="mb-2 text-[10px] uppercase tracking-widest text-zinc-600">Advertisement</span>
            <div className="flex w-full justify-center overflow-hidden">
              <Script id="adsterra-banner-728" strategy="afterInteractive">
                {`
                  atOptions = {
                    'key' : '7a11ffba3137e462ac4b32a3a19504a5',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                  };
                `}
              </Script>
              <Script 
                id="adsterra-banner-728-src" 
                src="https://biomanos.org/22/7a11ffba3137e462ac4b32a3a19504a5" 
                strategy="afterInteractive" 
              />
            </div>
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
                    {relVideo.thumbnail && !relVideo.thumbnail.includes('placehold.co') ? (
                      <Image
                        src={relVideo.thumbnail}
                        alt={relVideo.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                         <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600/90 text-white">
                          <svg className="ml-0.5 h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
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