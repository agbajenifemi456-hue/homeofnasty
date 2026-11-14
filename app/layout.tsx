import './globals.css'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { ChatBox } from './ChatBox'

const prisma = new PrismaClient()

export const metadata = {
  title: 'HomeOfNasty | Premium Adult Videos',
  description: 'The ultimate curated collection of premium videos.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get('user_email')?.value
  const userRole = cookieStore.get('user_role')?.value
  const isAdmin = userRole === 'admin'

  let username = ''
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (user) username = user.username
  }

  async function logout() {
    'use server'
    const c = await cookies()
    c.delete('user_email')
    c.delete('user_role')
    redirect('/')
  }

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-red-600 selection:text-white relative">
        
        {/* Premium Ambient Glow Background */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-red-900/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[150px]" />
        </div>

        <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/40 backdrop-blur-2xl transition-all">
          <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white transition-all duration-300 group-hover:text-red-500">
                HOMEOF<span className="text-red-600 group-hover:text-white">NASTY</span>
              </span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-6">
              {isAdmin && (
                <Link href="/admin" className="hidden sm:block rounded-lg bg-zinc-800 px-4 py-2 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-zinc-700">
                  Upload
                </Link>
              )}

              {userEmail ? (
                <div className="flex items-center gap-3 sm:gap-4 border-l border-white/10 pl-3 sm:pl-6">
                  <span className="hidden text-sm font-bold text-white sm:block">
                    {username}
                  </span>
                  <form action={logout}>
                    <button className="text-[10px] sm:text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider">
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                  <Link href="/login" className="text-[10px] sm:text-xs font-bold text-zinc-300 hover:text-white uppercase tracking-wider transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="rounded-lg bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold text-black uppercase tracking-wider transition-colors hover:bg-zinc-200">
                    Register
                  </Link>
                </div>
              )}
            </div>
            
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8 min-h-[80vh]">
          {children}
        </main>

        {/* Premium Floating Chat Widget (Bottom Right) */}
        <ChatBox isAdmin={isAdmin} isLoggedIn={!!userEmail} />

      </body>
    </html>
  )
}