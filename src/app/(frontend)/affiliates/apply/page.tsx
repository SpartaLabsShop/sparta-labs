'use client'

import React, { useState } from 'react'
import { FadeUp } from '@/components/motion/FadeUp'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AffiliateApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <main className="bg-[#f3f4f6] min-h-screen pt-32 lg:pt-40 pb-24">
      <section className="px-4 md:px-6 max-w-[900px] mx-auto">
        
        {/* Header */}
        <div className="mb-12 lg:mb-16 text-center">
          <FadeUp>
            <span className="inline-block px-4 py-1.5 bg-white border border-gray-100 shadow-sm text-ink rounded-full text-xs font-bold uppercase tracking-widest mb-6">Affiliates</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-6 tracking-tight leading-tight">Partner Application</h1>
            <p className="text-lg lg:text-xl text-gray-500 leading-relaxed font-light max-w-2xl mx-auto">
              Apply to join the most rigorous peptide testing facility's affiliate program. We review applications weekly.
            </p>
          </FadeUp>
        </div>

        {/* Form Container */}
        <FadeUp delay={0.1}>
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-16 shadow-sm">
            {submitted ? (
              <div className="text-center h-full flex flex-col items-center justify-center py-12">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-bold text-ink mb-4 tracking-tight">Application Received</h3>
                <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed mb-10">
                  Your application has been submitted successfully. Our team will review your details and be in touch soon.
                </p>
                <Link href="/affiliates">
                  <Button size="lg" className="h-14 px-10 rounded-xl bg-ink text-white hover:bg-[#1a1a1a] hover:shadow-lg transition-all duration-300 font-bold tracking-wider uppercase text-sm border-none">
                    Return to Affiliates
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-ink tracking-tight border-b border-gray-100 pb-2">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="text-sm font-semibold text-ink ml-1">Display Name <span className="text-[#5984c4]">*</span></Label>
                      <Input id="displayName" required placeholder="John Doe or Channel Name" className="h-14 rounded-xl bg-gray-50 border-transparent focus:ring-1 focus:ring-[#5984c4] px-4" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl" className="text-sm font-semibold text-ink ml-1">Website URL</Label>
                      <Input id="websiteUrl" type="url" placeholder="https://example.com" className="h-14 rounded-xl bg-gray-50 border-transparent focus:ring-1 focus:ring-[#5984c4] px-4" />
                    </div>
                  </div>
                </div>

                {/* 2. Social Links */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-ink tracking-tight border-b border-gray-100 pb-2">Primary Platform</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="platform" className="text-sm font-semibold text-ink ml-1">Platform <span className="text-[#5984c4]">*</span></Label>
                      <Select defaultValue="youtube" required>
                        <SelectTrigger id="platform" className="h-14 rounded-xl bg-gray-50 border-transparent focus:ring-1 focus:ring-[#5984c4] px-4">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="twitter">Twitter / X</SelectItem>
                          <SelectItem value="reddit">Reddit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socialUrl" className="text-sm font-semibold text-ink ml-1">Profile URL <span className="text-[#5984c4]">*</span></Label>
                      <Input id="socialUrl" type="url" required placeholder="https://youtube.com/c/..." className="h-14 rounded-xl bg-gray-50 border-transparent focus:ring-1 focus:ring-[#5984c4] px-4" />
                    </div>
                  </div>
                </div>

                {/* 3. Audience & Methods */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-ink tracking-tight border-b border-gray-100 pb-2">Audience & Strategy</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="reach" className="text-sm font-semibold text-ink ml-1">Estimated Monthly Reach <span className="text-[#5984c4]">*</span></Label>
                      <Select defaultValue="1k-10k" required>
                        <SelectTrigger id="reach" className="h-14 rounded-xl bg-gray-50 border-transparent focus:ring-1 focus:ring-[#5984c4] px-4">
                          <SelectValue placeholder="Select reach" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="<1k">Less than 1,000</SelectItem>
                          <SelectItem value="1k-10k">1,000 - 10,000</SelectItem>
                          <SelectItem value="10k-100k">10,000 - 100,000</SelectItem>
                          <SelectItem value="100k+">100,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="niche" className="text-sm font-semibold text-ink ml-1">Your Niche</Label>
                      <Input id="niche" placeholder="e.g. Biohacking, Fitness, Longevity" className="h-14 rounded-xl bg-gray-50 border-transparent focus:ring-1 focus:ring-[#5984c4] px-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="methods" className="text-sm font-semibold text-ink ml-1">Promotion Methods <span className="text-[#5984c4]">*</span></Label>
                    <Textarea 
                      id="methods" 
                      required 
                      placeholder="How do you plan to promote our products?" 
                      className="min-h-[120px] rounded-xl bg-gray-50 border-transparent focus:ring-1 focus:ring-[#5984c4] p-4 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whyJoin" className="text-sm font-semibold text-ink ml-1">Why do you want to join?</Label>
                    <Textarea 
                      id="whyJoin" 
                      placeholder="Tell us a little bit about yourself and why our lab is a good fit." 
                      className="min-h-[120px] rounded-xl bg-gray-50 border-transparent focus:ring-1 focus:ring-[#5984c4] p-4 resize-none"
                    />
                  </div>
                </div>

                {/* 4. Terms & Submit */}
                <div className="pt-6 border-t border-gray-100 flex flex-col items-start gap-6">
                  <div className="flex flex-row items-start space-x-3 space-y-0 bg-gray-50 p-4 rounded-xl border border-transparent">
                    <Checkbox id="terms" required className="mt-1" />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="terms" className="text-sm font-semibold text-ink cursor-pointer">
                        Accept terms and conditions
                      </Label>
                      <p className="text-xs text-gray-500 font-light">
                        I agree to the Affiliate Program Terms of Service and acknowledge that I will only promote products in accordance with legal and platform guidelines.
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full flex justify-end">
                    <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full md:w-auto h-14 px-10 rounded-xl bg-ink text-white hover:bg-[#1a1a1a] hover:shadow-lg transition-all duration-300 font-bold tracking-wider uppercase text-sm border-none">
                      Submit Application
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </FadeUp>
      </section>
    </main>
  )
}
