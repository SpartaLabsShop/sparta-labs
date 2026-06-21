'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultView?: 'login' | 'register'
}

export function AuthModal({ open, onOpenChange, defaultView = 'login' }: AuthModalProps) {
  const router = useRouter()
  const [view, setView] = useState<'login' | 'register'>(defaultView)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Reset state when modal opens/closes or view changes
  React.useEffect(() => {
    if (open) {
      setError('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
  }, [open, view])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.errors?.[0]?.message || 'Invalid email or password.')
        setIsLoading(false)
        return
      }
      onOpenChange(false)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { 
      setError('Passwords do not match')
      return 
    }

    setIsLoading(true)
    try {
      // 1. Create user account
      const registerRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const registerData = await registerRes.json()
      if (!registerRes.ok) {
        setError(registerData?.errors?.[0]?.message || 'Could not create account.')
        setIsLoading(false)
        return
      }

      // 2. Auto-login after registration
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      
      onOpenChange(false)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden border-0 bg-white max-w-4xl shadow-2xl rounded-2xl sm:rounded-3xl" showCloseButton={false}>
        <div className="flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Side: Brand Image */}
          <div className="hidden md:flex w-2/5 bg-black relative flex-col justify-between p-8">
            <Image 
              src="https://res.cloudinary.com/denskvdyt/image/upload/v1781825980/sparta-peptide-lab-image_yp7lht.webp" 
              alt="Laboratory" 
              fill 
              className="object-cover object-center z-0 opacity-60" 
              priority 
              unoptimized 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80 z-0 pointer-events-none" />
            
            <div className="relative z-10">
              <svg viewBox="0 0 190 300" width="24" height="32" className="fill-white drop-shadow-sm mb-6">
                <path d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z" />
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col justify-center max-w-[200px] drop-shadow-md pb-4">
              <h1 className="text-3xl leading-[1.1] font-bold tracking-tighter text-white mb-3">
                {view === 'login' ? 'Welcome back.' : 'Join The Lab.'}
              </h1>
              <p className="text-white/80 text-xs leading-relaxed">
                {view === 'login' 
                  ? 'Sign in to access your account and manage orders.' 
                  : 'Register to manage orders and view exclusive pricing.'}
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-3/5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative">
            
            <button 
              onClick={() => onOpenChange(false)} 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-2xl font-bold tracking-tight text-black">
                {view === 'login' ? 'Sign In' : 'Create an account'}
              </DialogTitle>
              <p className="text-sm text-gray-500">
                {view === 'login' ? 'Sign in to your Sparta Labs account' : 'Join Sparta Labs today'}
              </p>
            </DialogHeader>

            <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-800">Email Address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required autoComplete="email" placeholder="hello@example.com"
                  className="border border-gray-200 focus:border-black focus:ring-1 focus:ring-black focus:outline-none h-12 text-black rounded-lg placeholder:text-gray-400 px-4 text-sm transition-all"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-800">Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  required autoComplete={view === 'login' ? "current-password" : "new-password"} placeholder="••••••••"
                  className="border border-gray-200 focus:border-black focus:ring-1 focus:ring-black focus:outline-none h-12 text-black rounded-lg placeholder:text-gray-400 px-4 text-sm transition-all"
                />
              </div>

              {view === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-800">Confirm Password</label>
                  <input
                    type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    required autoComplete="new-password" placeholder="••••••••"
                    className="border border-gray-200 focus:border-black focus:ring-1 focus:ring-black focus:outline-none h-12 text-black rounded-lg placeholder:text-gray-400 px-4 text-sm transition-all"
                  />
                </div>
              )}

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

              <button type="submit" disabled={isLoading}
                className="bg-black hover:bg-gray-900 text-white w-full h-12 rounded-lg text-xs font-bold uppercase tracking-[0.15em] transition-colors flex items-center justify-center mt-2 disabled:opacity-60 shadow-md">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (view === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-8 text-center">
              {view === 'login' ? (
                <>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Don't have an account? </span>
                  <button type="button" onClick={() => setView('register')} className="text-[10px] text-black font-bold uppercase tracking-widest hover:underline">Sign Up</button>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Already have an account? </span>
                  <button type="button" onClick={() => setView('login')} className="text-[10px] text-black font-bold uppercase tracking-widest hover:underline">Sign In</button>
                </>
              )}
            </div>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
