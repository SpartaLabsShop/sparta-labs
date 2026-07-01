'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { HeroBreadcrumb } from '@/components/shared/HeroBreadcrumb'
import { ShieldCheck, Upload, CheckCircle2, ChevronDown } from 'lucide-react'
import { TurnstileWidget } from '@/components/TurnstileWidget'

const BRANCHES = [
  { value: 'army', label: 'Army' },
  { value: 'navy', label: 'Navy' },
  { value: 'air_force', label: 'Air Force' },
  { value: 'marines', label: 'Marine Corps' },
  { value: 'coast_guard', label: 'Coast Guard' },
  { value: 'space_force', label: 'Space Force' },
  { value: 'national_guard', label: 'National Guard' },
]

const SERVICE_STATUSES = [
  { value: 'active_duty', label: 'Active Duty' },
  { value: 'veteran', label: 'Veteran' },
  { value: 'retired', label: 'Retired' },
  { value: 'reservist', label: 'Reservist' },
  { value: 'national_guard', label: 'National Guard' },
]

export default function MilitaryDiscountPage() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [fileName, setFileName] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (!turnstileToken) { setError('Please complete the verification challenge.'); return }
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('turnstileToken', turnstileToken)
    const res = await fetch('/api/military-discount', { method: 'POST', body: formData })
    const result = await res.json()

    setSubmitting(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-xl text-center py-24">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-3">Application Submitted</h1>
          <p className="text-gray-500 leading-relaxed">
            Thank you for your service. We&apos;ve received your application and will review your ID proof shortly. Once approved, your discount code will be emailed to you.
          </p>
          <p className="text-sm text-gray-400 mt-4">Review typically takes 1–2 business days.</p>
          <Link href="/shop" className="inline-block mt-8 px-6 py-3 bg-black text-white rounded font-medium text-sm hover:bg-gray-800 transition-colors">
            Browse Products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-24">
      {/* Hero */}
      <section className="px-4 md:px-8 container mx-auto mb-12">
        <div className="relative w-full h-[200px] md:h-[280px] rounded-lg overflow-hidden">
          <img 
            src="https://res.cloudinary.com/denskvdyt/image/upload/v1782864394/military-discount-banner_minejn.webp" 
            alt="Military Discount" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-2">Military Discount</h1>
            <HeroBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Military Discount' }]} />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left — Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white" size={20} />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Exclusively for service members</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-4 leading-tight">
              15% Off For Those Who Served
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              As a thank-you to military personnel, veterans, and their families, Sparta Labs offers a permanent 15% discount on all orders. Submit your application and we&apos;ll verify your status within 1–2 business days.
            </p>

            <div className="space-y-4">
              {[
                { title: 'Submit your application', desc: 'Fill out the form and upload proof of service (military ID, DD-214, or equivalent).' },
                { title: 'We verify your status', desc: 'Our team reviews your document within 1–2 business days.' },
                { title: 'Receive your coupon code', desc: 'Once approved, your personal 15% discount code is sent to your email.' },
                { title: 'Apply at checkout', desc: "Enter the code in the coupon field at checkout — it's that simple." },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{step.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong className="text-gray-700">Accepted documents:</strong> Military ID, CAC card, DD-214, VA card, discharge papers, or any official document confirming active, veteran, reserve, or retired status.
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-ink mb-6">Apply for Military Discount</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">First Name *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Last Name *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                    placeholder="john@example.com"
                  />
                  <p className="text-xs text-gray-400 mt-1">Your coupon code will be sent here.</p>
                </div>

                <div>
                  <label htmlFor="branch" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Branch of Service *</label>
                  <div className="relative">
                    <select
                      id="branch"
                      name="branch"
                      required
                      defaultValue=""
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-black transition-colors appearance-none bg-white"
                    >
                      <option value="" disabled>Select branch...</option>
                      {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="serviceStatus" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Service Status *</label>
                  <div className="relative">
                    <select
                      id="serviceStatus"
                      name="serviceStatus"
                      required
                      defaultValue=""
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-black transition-colors appearance-none bg-white"
                    >
                      <option value="" disabled>Select status...</option>
                      {SERVICE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">ID Proof / Proof of Service *</span>
                  <label
                    htmlFor="idProofInput"
                    className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center cursor-pointer hover:border-gray-400 transition-colors block"
                  >
                    <Upload size={20} className="mx-auto mb-2 text-gray-400" />
                    {fileName ? (
                      <p className="text-sm text-ink font-medium">{fileName}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500">Click to upload PDF, JPG, or PNG</p>
                        <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
                      </>
                    )}
                    <input
                      id="idProofInput"
                      ref={fileInputRef}
                      name="idProof"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      required
                      onChange={e => setFileName(e.target.files?.[0]?.name || '')}
                    />
                  </label>
                </div>

                <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !turnstileToken}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By submitting you confirm the information is accurate. We treat all documents with strict confidentiality.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
