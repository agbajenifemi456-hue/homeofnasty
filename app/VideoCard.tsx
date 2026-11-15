'use client'

import Link from 'next/link'
import Image from 'next/image'
import { EditThumbnailButton } from './EditThumbnailButton'
import { deleteVideo } from './deleteVideo'

const ADSTERRA_SMARTLINK = "https://auctionr.org/4/9f081db75ac611bf82be7beb33bf02d8"

export function VideoCard({ video, isAdmin }: { video: any, isAdmin: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    // This opens the Smartlink in a new tab
    window.open(ADSTERRA_SMARTLINK, '_blank');
    // The current tab will follow the href to /watch/[id] automatically
  }

  return (
    <div className="group relative block">
      
      {isAdmin && (
        <div className="absolute right-2 top-2 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex gap-2">
          <EditThumbnailButton videoId={video.id} />
          <form action={deleteVideo}>
            <input type="hidden" name="videoId" value={video.id} />
            <button type="submit" className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-500 hover:scale-110 transition-all" title="Delete Video">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <Link 
        href={`/watch/${video.id}`} 
        onClick={handleClick}
        className="block"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 ring-1 ring-white/10 transition-all duration-300 group-hover:ring-red-500/50 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]">
          {video.thumbnail && !video.thumbnail.includes('placehold.co') && (
            <Image src={video.thumbnail} alt={video.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-80" />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100 z-10 pointer-events-none">
            <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xl backdrop-blur-sm">
              <svg className="ml-1 h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="truncate text-sm sm:text-base font-bold text-zinc-200 transition-colors group-hover:text-white">{video.name}</h3>
          <p className="mt-1 line-clamp-1 text-xs sm:text-sm text-zinc-500">{video.description}</p>
        </div>
      </Link>
    </div>
  )
}