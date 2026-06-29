'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Settings2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SettingsClientProps {
  initialCurrency: string;
}

export function SettingsClient({ initialCurrency }: SettingsClientProps) {
  // Animation variants
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
  
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 max-w-3xl"
    >
      <motion.div variants={itemVars}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Settings
        </h1>
        <p className="text-slate-500">Configure your payout preferences and account details.</p>
      </motion.div>
      
      <motion.div variants={itemVars} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden hover:border-[#CC292B]/30 transition-colors">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-[#CC292B] pointer-events-none">
          <Settings2 size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Payout Method</h3>
            <p className="text-sm text-slate-500">Configure how you want to receive your commissions.</p>
          </div>
          
          <form className="space-y-6">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Preferred Currency</label>
              <div className="relative">
                <select 
                  defaultValue={initialCurrency || 'USD'}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#CC292B] focus:border-transparent transition-all shadow-sm cursor-pointer"
                >
                  <option value="USD">USD (US Dollar)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT_ERC20">USDT (ERC-20)</option>
                  <option value="USDT_TRC20">USDT (TRC-20)</option>
                  <option value="STORE_CREDIT">Store Credit</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="button" className="rounded-xl h-12 px-8 text-xs font-bold uppercase tracking-widest gap-2 bg-[#CC292B] hover:bg-[#b02224] text-white border-none shadow-md">
                <Save size={16} />
                Save Preferences
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}
