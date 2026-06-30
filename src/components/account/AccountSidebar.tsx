'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, MapPin, Heart, Settings, LogOut, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { useState } from 'react'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

const NAV_ITEMS = [
  { name: 'Overview', href: '/account', icon: Home },
  { name: 'Orders', href: '/account/orders', icon: Package },
  { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { name: 'Settings', href: '/account/settings', icon: Settings },
  { name: 'Partner Program', href: '/affiliates', icon: Users },
]

export function AccountSidebar({
  userName = 'User',
  maxxPoints = 0,
  affiliateStatus = 'none'
}: {
  userName?: string
  maxxPoints?: number
  affiliateStatus?: 'none' | 'pending' | 'approved' | 'rejected' | 'suspended'
}) {
  const pathname = usePathname() || ''
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <aside className="w-full h-full flex flex-col pt-8 lg:pt-12 px-6 lg:px-8 pb-12">
      <div className="mb-6 lg:mb-10 px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Account Portal</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/account'
            ? pathname === '/account'
            : pathname.includes(item.href)

          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                ${isActive
                  ? 'text-[#CC292B]'
                  : 'text-slate-800 hover:bg-slate-100'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 bg-[#CC292B]/10 rounded-xl z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={18} className={`relative z-10 ${isActive ? 'text-[#CC292B]' : 'text-slate-600'}`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold text-[#CC292B] hover:bg-[#CC292B]/5 transition-all duration-300 w-full">
              <LogOut size={18} className="text-[#CC292B]" />
              <span>Sign out</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white border-0 p-8 rounded-2xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className={`text-2xl font-bold tracking-tight text-[#0A0A0A] ${spaceGrotesk.className}`}>
                Sign Out
              </DialogTitle>
              <DialogDescription className="text-sm text-[#8A8A8A] mt-2">
                Are you sure you want to sign out of your account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-end">
              <DialogClose asChild>
                <button className="px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] text-black bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto text-center">
                  Cancel
                </button>
              </DialogClose>
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
                  router.push('/')
                  router.refresh()
                }}
                className="px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] text-white bg-[#CC292B] hover:bg-[#b02224] transition-colors w-full sm:w-auto text-center"
              >
                Yes, Sign Out
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  )
}

