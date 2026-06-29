'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Link as LinkIcon, Target, DollarSign, WalletCards, Settings, LogOut, Medal } from 'lucide-react'
import { motion } from 'framer-motion'

import { useAuth } from '@/lib/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { useState } from 'react'

const NAV_ITEMS = [
  { name: 'Overview', href: '/affiliates/dashboard', icon: LayoutDashboard },
  { name: 'Links & Assets', href: '/affiliates/dashboard/links', icon: LinkIcon },
  { name: 'Conversions', href: '/affiliates/dashboard/conversions', icon: Target },
  { name: 'Payouts', href: '/affiliates/dashboard/payouts', icon: WalletCards },
  { name: 'Settings', href: '/affiliates/dashboard/settings', icon: Settings },
]

export function AffiliateSidebar({ 
  userName = 'Partner', 
  tier = 'standard'
}: { 
  userName?: string
  tier?: string
}) {
  const pathname = usePathname() || ''
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  
  return (
    <aside className="w-full h-full flex flex-col pt-8 lg:pt-12 px-6 lg:px-8 pb-12">
      {/* Greeting */}
      <div className="mb-6 lg:mb-10 px-4 flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Affiliate Portal</span>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight hidden lg:block">
          {userName}
        </h2>
      </div>

      {/* Tier Widget */}
      <div className="flex flex-col gap-3 bg-[#FFF5F5] border border-[#CC292B]/20 shadow-sm p-5 rounded-2xl w-full relative overflow-hidden group mb-6 lg:mb-8">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-[#CC292B] pointer-events-none">
          <Medal size={80} />
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-[#CC292B]/10 text-[#CC292B] flex items-center justify-center shrink-0 border border-[#CC292B]/20">
            <Medal size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#CC292B]">Current Status</span>
            <span className="text-lg font-bold text-[#CC292B] leading-none mt-1 capitalize">{tier} Tier</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {NAV_ITEMS.map((item) => {
          // Strict exact match for root /dashboard
          const isActive = item.href === '/affiliates/dashboard' 
            ? pathname.endsWith('/dashboard') 
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
                  layoutId="affiliate-active-pill"
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

        {/* Back to Shop Link */}
        <Link
          href="/account"
          className="relative flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-slate-500 hover:bg-slate-100 mt-2"
        >
          <span className="relative z-10">&larr; Back to Account</span>
        </Link>
      </nav>
      
      <div className="mt-auto pt-8">
        {/* Sign out */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold text-[#CC292B] hover:bg-[#CC292B]/5 transition-all duration-300 w-full">
              <LogOut size={18} className="text-[#CC292B]" />
              <span>Sign out</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white border-0 p-8 rounded-2xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                Sign Out
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-2">
                Are you sure you want to sign out of your account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-end">
              <DialogClose asChild>
                <button className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto text-center">
                  Cancel
                </button>
              </DialogClose>
              <button 
                onClick={async () => {
                  await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
                  router.push('/')
                  router.refresh()
                }}
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#CC292B] hover:bg-[#b02224] transition-colors w-full sm:w-auto text-center"
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
