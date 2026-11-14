'use client'

import { updateThumbnail } from './updateThumbnail'

export function EditThumbnailButton({ videoId }: { videoId: number }) {
  return (
    <form action={updateThumbnail}>
      <input type="hidden" name="videoId" value={videoId} />
      <label className="flex h-8 w-8 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 hover:scale-110 transition-all" title="Change Thumbnail">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>
        <input 
          type="file" 
          name="thumbnail" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => {
            if (e.target.files?.length) {
              e.target.closest('form')?.requestSubmit()
            }
          }} 
        />
      </label>
    </form>
  )
}