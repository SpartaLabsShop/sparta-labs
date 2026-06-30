'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MousePointerClick, Target, DollarSign, Wallet, Copy, Check, ExternalLink } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'

export interface DashboardClientProps {
  stats: {
    totalClicks: number;
    totalConversions: number;
    conversionRate: string;
    totalCommissionPending: number; // in cents
    totalCommissionApproved: number; // in cents
    totalCommissionPaid: number; // in cents
    referralSlug: string;
    couponCode: string;
  };
  recentConversions: {
    id: string;
    date: string;
    amount: number; // commission amount in cents
    status: string;
  }[];
}

export function DashboardClient({ stats, recentConversions }: DashboardClientProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const handleCopy = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text)
    if (type === 'link') {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } else {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  // Formatting helpers
  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`
  const [baseUrl, setBaseUrl] = useState('https://spartalabs.shop')
  
  React.useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const referralUrl = `${baseUrl}/ref/${stats.referralSlug}`

  // Animation variants
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
  
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-12"
    >
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div variants={itemVars} className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-[#CC292B]/50 hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-[#CC292B]">
            <MousePointerClick size={80} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Total Clicks</span>
            <span className="text-5xl text-slate-900 leading-none font-bold tracking-tight">{stats.totalClicks}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVars} className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-[#CC292B]/50 hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-emerald-500">
            <Target size={80} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Conversions</span>
            <div className="flex items-end gap-3">
              <span className="text-5xl text-slate-900 leading-none font-bold tracking-tight">{stats.totalConversions}</span>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg mb-1">{stats.conversionRate}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVars} className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-[#CC292B]/50 hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-amber-500">
            <DollarSign size={80} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Pending Commission</span>
            <span className="text-5xl text-slate-900 leading-none font-bold tracking-tight">{formatMoney(stats.totalCommissionPending)}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVars} className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-[#CC292B]/50 hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-[#CC292B]">
            <Wallet size={80} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Total Paid Out</span>
            <span className="text-5xl text-slate-900 leading-none font-bold tracking-tight">{formatMoney(stats.totalCommissionPaid)}</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-12 items-start">
        
        {/* Left Column: Recent Conversions */}
        <motion.div variants={itemVars} className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Recent Conversions</h3>
            <Link href="/affiliates/dashboard/conversions" className="text-xs font-bold uppercase tracking-widest text-[#CC292B] hover:text-white transition-colors bg-[#FFF5F5] hover:bg-[#CC292B] px-4 py-2 rounded-xl">
              View All
            </Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {recentConversions.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-4 text-slate-500">
                <Target size={36} className="text-slate-300" />
                <p className="text-sm">No conversions recorded yet.</p>
                <p className="text-xs text-slate-400">Share your referral link to start earning!</p>
              </div>
            ) : (
              recentConversions.map((conv, i) => (
                <motion.div 
                  key={conv.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#CC292B]/30 transition-all duration-300 gap-4 cursor-pointer relative overflow-hidden"
                >
                  {/* Highlight bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CC292B] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                  
                  <div className="flex flex-col gap-2 pl-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Order #{conv.id.substring(0, 8)}</span>
                    <span className="text-sm font-medium text-slate-500">{conv.date}</span>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2">
                    <span className="text-base text-emerald-600 font-bold">+{formatMoney(conv.amount)}</span>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        conv.status === 'pending' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 
                        conv.status === 'approved' ? 'bg-[#CC292B] shadow-[0_0_8px_rgba(204,41,43,0.8)]' : 
                        'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                      }`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{conv.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Right Column: Share Tools */}
        <motion.div variants={itemVars} className="flex flex-col gap-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4">Share Tools</h3>
          
          {/* Referral Link */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Referral Link</span>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm font-mono text-slate-700 break-all border border-slate-200">
                {referralUrl}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleCopy(referralUrl, 'link')}
                  variant="outline" 
                  className="flex-1 rounded-xl h-12 text-xs font-bold uppercase tracking-widest gap-2 bg-white border-slate-200 hover:bg-[#FFF5F5] hover:text-[#CC292B] hover:border-[#CC292B]"
                >
                  {copiedLink ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  {copiedLink ? 'Copied!' : 'Copy'}
                </Button>
                <a href={referralUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 hover:bg-[#FFF5F5] border border-slate-200 hover:border-[#CC292B] hover:text-[#CC292B] text-slate-500 transition-colors">
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          {stats.couponCode && (
            <div className="flex flex-col gap-3 mt-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Coupon Code (15% Off)</span>
              <div className="bg-[#FFF5F5] p-5 rounded-3xl border border-[#CC292B]/20 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#CC292B]/10 rounded-full blur-xl" />
                <div className="bg-white rounded-xl px-4 py-4 text-xl font-mono font-bold text-[#CC292B] text-center border border-[#CC292B]/20 relative z-10">
                  {stats.couponCode}
                </div>
                <Button 
                  onClick={() => handleCopy(stats.couponCode, 'code')}
                  className="w-full rounded-xl h-12 text-xs font-bold uppercase tracking-widest gap-2 bg-[#CC292B] hover:bg-[#b02224] text-white border-none shadow-md"
                >
                  {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </motion.div>
  )
}
