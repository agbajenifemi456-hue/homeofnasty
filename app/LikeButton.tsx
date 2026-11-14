'use client'

import { useState, useEffect } from 'react'
import { likeVideo } from './likeVideo'

export function LikeButton({ videoId, initialLikes, initialDislikes }: { videoId: number, initialLikes: number, initialDislikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null)

  useEffect(() => {
    const storedAction = localStorage.getItem(`action_${videoId}`) as 'like' | 'dislike' | null
    if (storedAction) setUserAction(storedAction)
  }, [videoId])

  async function handleAction(action: 'like' | 'dislike') {
    const formData = new FormData()
    formData.append('videoId', videoId.toString())
    
    if (userAction === action) {
      setUserAction(null)
      localStorage.removeItem(`action_${videoId}`)
      if (action === 'like') setLikes(prev => prev - 1)
      if (action === 'dislike') setDislikes(prev => prev - 1)
    } else {
      if (userAction === 'like') setLikes(prev => prev - 1)
      if (userAction === 'dislike') setDislikes(prev => prev - 1)

      setUserAction(action)
      localStorage.setItem(`action_${videoId}`, action)
      
      if (action === 'like') setLikes(prev => prev + 1)
      if (action === 'dislike') setDislikes(prev => prev + 1)
      
      formData.append('action', action)
      await likeVideo(formData)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => handleAction('like')} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${userAction === 'like' ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill={userAction === 'like' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" /></svg>
        {likes}
      </button>

      <button onClick={() => handleAction('dislike')} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${userAction === 'dislike' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill={userAction === 'dislike' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.367 13.75c-.806 0-1.533.446-2.031 1.08a9.041 9.041 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672v.692a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H4.415c-1.026 0-1.945-.694-2.054-1.715A18.63 18.63 0 012.293 13c0-2.821.982-5.415 2.649-7.521.388-.482.987-.729 1.605-.729H9.77c.483 0 .964.078 1.423.23l3.114 1.04a4.501 4.501 0 001.423.23h3.366M9.75 15h-2.25m10.596-9.75a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C15.613 3.953 14.833 3.5 14 3.5h-1.053c-.472 0-.745.556-.5.96a8.958 8.958 0 011.302 4.665c0 1.194-.232 2.333-.654 3.375z" /></svg>
        {dislikes}
      </button>
    </div>
  )
}