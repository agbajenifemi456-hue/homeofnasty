import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { LikeButton } from '@/app/LikeButton'
import { addComment } from '@/app/addComment'
import Script from 'next/script'

const prisma = new PrismaClient()

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const videoId = parseInt(id)

  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!video) notFound()

  const cookieStore = await cookies()
  const userEmail = cookieStore.get('user_email')?.value

  const relatedVideos = await prisma.video.findMany({
    where: { NOT: { id: video.id } },
    take: 4,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="mx-auto max-w-7xl py-4 sm:py-8">
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white shadow-lg ring-1 ring-white/10 transition-all hover:bg-zinc-800 hover:ring-red-500/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 shadow-2xl shadow-red-900/20">
            {video.videoLink ? (
              <iframe src={video.videoLink} className="h-full w-full" allowFullScreen referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                <p className="text-zinc-500">No video link provided.</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-zinc-900/60 p-6 ring-1 ring-white/10 backdrop-blur-md">
            <h1 className="text-2xl font-black text-white sm:text-4xl">{video.name}</h1>
            <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/10 pt-5 gap-4">
              <p className="text-sm leading-relaxed text-zinc-300 max-w-2xl">
                {video.description}
              </p>
              <LikeButton videoId={video.id} initialLikes={video.likes} initialDislikes={video.dislikes} />
            </div>
          </div>

          {/* ADSTERRA 728x90 */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/30 py-4">
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
              <Script id="adsterra-banner-728-src" src="https://biomanos.org/22/7a11ffba3137e462ac4b32a3a19504a5" strategy="afterInteractive" />
            </div>
          </div>

          {/* Comments Section */}
          <div className="rounded-2xl bg-zinc-900/60 p-6 ring-1 ring-white/10 backdrop-blur-md mt-6">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Comments ({video.comments.length})</h2>
            
            {userEmail ? (
              <form action={addComment} className="flex gap-3 mb-8">
                <input type="hidden" name="videoId" value={video.id} />
                <input name="text" required placeholder="Add a public comment..." className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
                <button type="submit" className="rounded-xl bg-red-600 px-8 font-bold text-white hover:bg-red-500 transition-colors">Post</button>
              </form>
            ) : (
              <div className="mb-8 rounded-xl border border-zinc-700 bg-zinc-800/50 p-5 text-center text-sm text-zinc-400">
                Please <Link href="/login" className="text-red-500 font-bold hover:underline">log in</Link> to leave a comment.
              </div>
            )}

            <div className="space-y-6">
              {video.comments.length === 0 ? (
                <p className="text-sm text-zinc-500">No comments yet. Be the first!</p>
              ) : (
                video.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-lg font-bold text-red-500">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{comment.user.username}</span>
                        <span className="text-xs text-zinc-500">{comment.createdAt.toLocaleDateString()}</span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-300">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <h2 className="border-b border-white/10 pb-3 text-xl font-bold text-white">Up Next</h2>
          {relatedVideos.map((relVideo) => (
            <Link key={relVideo.id} href={`/watch/${relVideo.id}`} className="group flex gap-4">
              <div className="relative h-20 w-36 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 transition-all group-hover:ring-red-500/50">
                <Image 
                  src={relVideo.thumbnail} 
                  alt={relVideo.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover transition duration-300 group-hover:scale-110" 
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="line-clamp-2 text-sm font-bold text-zinc-200 group-hover:text-red-500 transition-colors">{relVideo.name}</h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}