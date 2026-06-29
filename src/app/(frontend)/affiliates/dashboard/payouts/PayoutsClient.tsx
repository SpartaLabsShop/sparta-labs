'use client'

import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { WalletCards, ArrowRight, Loader2, CheckCircle2, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PayoutsClientProps {
  payoutRequests: {
    id: string;
    date: string;
    amount: number; // in cents
    method: string;
    details: string;
    status: string;
  }[];
  availableBalance: number;
  totalPendingHold: number;
  minimumThreshold: number;
  pendingPeriodDays: number;
}

export function PayoutsClient({ payoutRequests, availableBalance, totalPendingHold, minimumThreshold, pendingPeriodDays }: PayoutsClientProps) {
  const router = useRouter()
  
  const [amount, setAmount] = useState<string>('')
  const [method, setMethod] = useState<'zelle' | 'cashapp' | 'applepay'>('zelle')
  const [details, setDetails] = useState<string>('')
  
  const [isRequesting, setIsRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount.')
      return
    }

    if (parsedAmount * 100 < minimumThreshold) {
      setError(`Minimum payout amount is ${formatMoney(minimumThreshold)}`)
      return
    }

    if (parsedAmount * 100 > availableBalance) {
      setError('Amount exceeds your available balance.')
      return
    }

    if (!details.trim()) {
      setError('Please provide your payout details.')
      return
    }

    setIsRequesting(true)
    
    try {
      const res = await fetch('/api/affiliates/payout-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          method,
          details,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess('Payout request submitted successfully.')
        setAmount('')
        setDetails('')
        router.refresh()
      } else {
        setError(data.error || 'Failed to submit request.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setIsRequesting(false)
    }
  }

  // Animation variants
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
      className="flex flex-col gap-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Balance Card */}
        <motion.div variants={itemVars} className="bg-[#CC292B] p-8 rounded-3xl text-white shadow-md shadow-[#CC292B]/20 flex flex-col justify-between min-h-[200px]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Available Balance
            </h1>
            <p className="text-white/80 text-sm">Funds cleared and ready to withdraw.</p>
          </div>
          <div className="mt-8">
            <span className="text-5xl font-black text-white tracking-tight">{formatMoney(availableBalance)}</span>
          </div>
        </motion.div>

        {/* Pending Hold Card */}
        <motion.div variants={itemVars} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-slate-400" />
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {pendingPeriodDays}-Day Hold
              </h1>
            </div>
            <p className="text-slate-500 text-sm">Pending commissions from recent orders. They will automatically clear after {pendingPeriodDays} days.</p>
          </div>
          <div className="mt-8">
            <span className="text-4xl font-black text-slate-300 tracking-tight">{formatMoney(totalPendingHold)}</span>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVars} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
          Request Payout
        </h2>
        
        <form onSubmit={handleRequestPayout} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Amount ($)</label>
            <input 
              type="number" 
              step="0.01"
              min={(minimumThreshold / 100).toString()}
              max={(availableBalance / 100).toString()}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#CC292B] focus:border-transparent transition-all"
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex-1 w-full flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Method</label>
            <select
              value={method}
              onChange={e => setMethod(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#CC292B] focus:border-transparent transition-all"
            >
              <option value="zelle">Zelle</option>
              <option value="cashapp">CashApp</option>
              <option value="applepay">Apple Pay</option>
            </select>
          </div>

          <div className="flex-[1.5] w-full flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Payout Details (Phone/ID)</label>
            <input 
              type="text" 
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#CC292B] focus:border-transparent transition-all"
              placeholder="e.g. $cashtag, Apple Pay #..."
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isRequesting || availableBalance < minimumThreshold}
            className="w-full md:w-auto bg-[#CC292B] text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#b02224] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isRequesting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {success}
          </div>
        )}
      </motion.div>
      
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 px-2">
          Payout History
        </h2>
        {payoutRequests.length === 0 ? (
          <motion.div variants={itemVars} className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-4 text-slate-500">
            <WalletCards size={48} className="text-slate-200" />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-slate-900">No Requests Yet</h3>
              <p className="text-sm">Submit your first payout request above.</p>
            </div>
          </motion.div>
        ) : (
          payoutRequests.map((req) => (
            <motion.div 
              key={req.id} 
              variants={itemVars}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:border-[#CC292B]/30 transition-all duration-300 gap-6 relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CC292B] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              
              <div className="flex flex-col gap-2 pl-2 md:w-1/4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Date</span>
                <span className="text-base font-bold text-slate-900">{req.date}</span>
              </div>

              <div className="flex flex-col gap-2 md:w-1/4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Method</span>
                <span className="text-sm font-medium text-slate-700 capitalize">{req.method}</span>
                <span className="text-xs text-slate-500 truncate max-w-[150px]">{req.details}</span>
              </div>
              
              <div className="flex flex-col md:items-end gap-2 md:w-1/2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Amount</span>
                <div className="flex items-center gap-4">
                  <span className="text-base text-slate-900 font-bold">{formatMoney(req.amount)}</span>
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      req.status === 'pending' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 
                      req.status === 'paid' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 
                      req.status === 'rejected' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' :
                      'bg-[#CC292B] shadow-[0_0_8px_rgba(204,41,43,0.8)]'
                    }`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{req.status}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
