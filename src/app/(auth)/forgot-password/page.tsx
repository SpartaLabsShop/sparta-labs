'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { TurnstileWidget } from '@/components/TurnstileWidget'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!turnstileToken) { setError('Please complete the verification challenge.'); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data?.errors?.[0]?.message || 'Something went wrong.')
        return
      }
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white selection:bg-black/10">
      {/* Left Column */}
      <div className="w-full lg:w-[45%] relative min-h-[30vh] lg:min-h-screen order-first lg:order-none flex flex-col justify-between p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 overflow-hidden">
        <Image src="https://res.cloudinary.com/denskvdyt/image/upload/v1781825980/sparta-peptide-lab-image_yp7lht.webp" alt="Laboratory" fill className="object-cover object-center z-0" priority unoptimized />
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

        <div className="relative z-10 flex justify-between items-center w-full">
          <Link href="/login" className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-white hover:opacity-80 transition-opacity drop-shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>
          <svg viewBox="0 0 190 300" width="28" height="36" className="fill-white drop-shadow-sm">
            <path d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full max-w-sm mt-12 lg:mt-0 drop-shadow-md">
          <h2 className="text-[10px] font-bold text-white/80 tracking-[0.25em] uppercase mb-6">Account Recovery</h2>
          <h1 className="text-4xl lg:text-5xl leading-[1.1] font-bold tracking-tighter text-white mb-6 font-[family-name:var(--font-inter)]">
            Reset your password.
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-[320px]">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-[420px] flex flex-col">
          {sent ? (
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-6" />
              <h1 className="text-2xl font-bold tracking-tight text-black mb-2 font-[family-name:var(--font-inter)]">Check your email</h1>
              <p className="text-sm text-gray-500 mb-8">
                If an account exists for <strong>{email}</strong>, we've sent a password reset link. Check your inbox and spam folder.
              </p>
              <Link href="/login" className="text-[10px] text-black font-bold uppercase tracking-widest hover:underline">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-black mb-1 font-[family-name:var(--font-inter)]">Forgot password?</h1>
              <p className="text-sm text-gray-500 mb-8">Enter your email and we'll send you a reset link</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-800">Email Address</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required autoComplete="email" placeholder="hello@example.com"
                    className="border border-gray-200 focus:border-black focus:ring-1 focus:ring-black focus:outline-none h-14 text-black rounded-none placeholder:text-gray-400 px-4"
                  />
                </div>

                <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />

                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                <button type="submit" disabled={isLoading || !turnstileToken}
                  className="bg-black hover:bg-gray-900 text-white w-full h-14 text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center mt-2 disabled:opacity-60">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-gray-100 pt-8">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Remember your password? </span>
                <Link href="/login" className="text-[10px] text-black font-bold uppercase tracking-widest hover:underline">Sign In</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
