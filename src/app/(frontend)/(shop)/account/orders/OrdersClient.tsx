'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Filter, Package } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { motion, AnimatePresence } from 'framer-motion'

export interface OrderItem {
  id: string;
  date: string;
  status: string;
  total: number;
  itemCount: number;
}

export interface AccountOrdersProps {
  orders: OrderItem[];
}

const statusStyles = (status: string) => {
  switch (status) {
    case 'Processing': return { dot: 'bg-amber-500', bg: 'bg-amber-50 border-amber-100 text-amber-700 rounded-full' }
    case 'Shipped': case 'Placed': return { dot: 'bg-blue-500', bg: 'bg-blue-50 border-blue-100 text-blue-700 rounded-full' }
    case 'Delivered': return { dot: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-100 text-emerald-700 rounded-full' }
    case 'Cancelled': case 'Returned': return { dot: 'bg-[#CC292B]', bg: 'bg-[#FFF5F5] border-[#FFEBEB] text-[#CC292B] rounded-full' }
    default: return { dot: 'bg-slate-400', bg: 'bg-slate-50 border-slate-200 text-slate-700 rounded-full' }
  }
}

export function OrdersClient({ orders }: AccountOrdersProps) {
  const [filter, setFilter] = useState('all')

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status.toLowerCase() === filter)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col w-full gap-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">
            Order History
          </h1>
          <p className="text-sm text-slate-500">Track, manage, and return your recent purchases.</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <div className="pl-3 hidden sm:flex items-center justify-center">
            <Filter size={16} className="text-slate-400" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px] bg-transparent border-none shadow-none focus:ring-0 text-sm font-semibold text-slate-700">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-xl shadow-xl shadow-black/5">
              <SelectItem value="all" className="text-sm font-semibold text-slate-700">All Orders</SelectItem>
              <SelectItem value="processing" className="text-sm font-semibold text-slate-700">Processing</SelectItem>
              <SelectItem value="delivered" className="text-sm font-semibold text-slate-700">Delivered</SelectItem>
              <SelectItem value="returned" className="text-sm font-semibold text-[#CC292B]">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredOrders.length > 0 ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {filteredOrders.map((order, i) => {
              const styles = statusStyles(order.status)
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-300 gap-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10 flex-1">
                    <div className="w-12 h-12 rounded-full bg-[#FFF5F5] flex items-center justify-center shrink-0 hidden md:flex">
                       <Package size={22} className="text-[#CC292B]" />
                    </div>

                    <div className="flex flex-col gap-1 min-w-[130px]">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Order Placed</span>
                      <span className="text-sm font-semibold text-slate-900">{order.date}</span>
                      <span className="text-xs text-slate-400 mt-0.5">#{order.id}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 hidden md:block">Status</span>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 border ${styles.bg} self-start`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{order.status}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-3 md:mt-0 md:ml-auto md:text-right">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 hidden md:block">Total</span>
                      <div className="flex items-end gap-2 md:justify-end">
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">
                          ${order.total.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 mb-1">({order.itemCount} items)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center shrink-0 mt-3 md:mt-0">
                    <Link href={`/account/orders/${order.id}`} className="w-full md:w-auto bg-white border border-slate-200 text-slate-700 group-hover:border-[#CC292B] group-hover:text-[#CC292B] px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 text-center">
                      View Details
                    </Link>
                  </div>
                </motion.div>
              )
            })}

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6 gap-4">
              <span className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-900">1</span> to <span className="font-bold text-slate-900">{filteredOrders.length}</span> of <span className="font-bold text-slate-900">{filteredOrders.length}</span> results
              </span>
              <div className="flex items-center gap-2">
                <button disabled className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed">
                  <ChevronLeft size={18} />
                </button>
                <button disabled className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-12"
          >
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <div className="w-20 h-20 rounded-full bg-[#FFF5F5] flex items-center justify-center">
                <Package size={36} className="text-[#CC292B]" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">No orders found</h4>
                <p className="text-slate-500">You haven't placed any orders that match this filter.</p>
              </div>
              <Link href="/shop" className="bg-[#CC292B] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#b02224] transition-colors mt-4">
                Start Shopping
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
