'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getMessages, sendMessage, deleteMessage } from './chatActions'

type Message = {
  id: number
  text: string
  username: string
  replyTo: string | null
  createdAt: Date
}

export function ChatBox({ isAdmin, isLoggedIn }: { isAdmin: boolean, isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !isLoggedIn) return
    const fetchMsgs = async () => {
      const msgs = await getMessages()
      setMessages(msgs)
    }
    fetchMsgs()
    const interval = setInterval(fetchMsgs, 3000)
    return () => clearInterval(interval)
  }, [isOpen, isLoggedIn])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend(formData: FormData) {
    setError('')
    if (replyTo) formData.append('replyTo', replyTo)

    const result = await sendMessage(formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      const form = document.getElementById('chat-form') as HTMLFormElement
      form.reset()
      setReplyTo(null)
      const msgs = await getMessages()
      setMessages(msgs)
    }
  }

  async function handleDelete(messageId: number) {
    const formData = new FormData()
    formData.append('messageId', messageId.toString())
    await deleteMessage(formData)
    const msgs = await getMessages()
    setMessages(msgs)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl ring-1 ring-white/10 animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          <div className="flex items-center justify-between bg-zinc-900 px-5 py-4 border-b border-white/5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Chat
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">✕</button>
          </div>

          {!isLoggedIn ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-4 bg-gradient-to-b from-zinc-950 to-zinc-900">
              <div className="rounded-full bg-red-600/10 p-4 ring-1 ring-red-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h4 className="text-xl font-black text-white">Members Only</h4>
              <p className="text-sm text-zinc-400">You must be logged in to join the live conversation.</p>
              <Link href="/login" className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-black hover:bg-zinc-200 transition-colors">
                Log In to Chat
              </Link>
            </div>
          ) : (
            <>
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-zinc-600 mt-10">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="group relative">
                      {msg.replyTo && (
                        <div className="mb-1 text-[10px] text-zinc-500 border-l-2 border-red-500/50 pl-2">
                          Replying to <span className="font-bold text-zinc-400">@{msg.replyTo}</span>
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm bg-zinc-900 p-2 rounded-lg rounded-tl-none border border-white/5">
                          <span className="font-bold text-red-500 block text-xs mb-1">{msg.username}</span>
                          <span className="text-zinc-300">{msg.text}</span>
                        </div>
                        
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setReplyTo(msg.username)} className="text-[10px] text-zinc-400 hover:text-white">Reply</button>
                          {isAdmin && (
                            <button onClick={() => handleDelete(msg.id)} className="text-[10px] text-red-500 hover:text-red-400">Delete</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/5 p-3 bg-zinc-900">
                {error && <p className="text-xs text-red-500 mb-2 px-2 font-bold">{error}</p>}
                {replyTo && (
                  <div className="mb-2 flex items-center justify-between rounded-lg bg-zinc-800 p-2 text-xs text-zinc-300">
                    <span>Replying to @{replyTo}</span>
                    <button onClick={() => setReplyTo(null)} className="text-red-500 hover:text-red-400">✕</button>
                  </div>
                )}
                <form id="chat-form" action={handleSend} className="flex gap-2">
                  <input 
                    name="text" 
                    required 
                    placeholder="Type a message..." 
                    className="flex-1 rounded-xl bg-zinc-950 px-4 py-3 text-sm text-white border border-white/5 focus:outline-none focus:border-red-500/50 transition-colors" 
                  />
                  <button type="submit" className="rounded-xl bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-500 transition-colors">Send</button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:bg-red-500 hover:scale-110 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </button>
    </div>
  )
}