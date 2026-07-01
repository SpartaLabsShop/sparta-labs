'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Package, LifeBuoy, TrendingUp, Heart, Calendar, MapPin, Wallet, Users, Star, CreditCard } from 'lucide-react'
import { motion, Variants } from 'framer-motion'

export interface AccountOverviewProps {
  stats: {
    ordersPlaced: number;
    wishlistCount: number;
    maxxPoints: number;
    memberSince: string;
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    date: string;
    status: string;
    total: number;
  }[];
  defaultAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;
  affiliateStatus?: 'none' | 'pending' | 'approved' | 'rejected' | 'suspended';
}

export function AccountOverviewClient({ stats, recentOrders, defaultAddress, affiliateStatus = 'none', userName = '' }: AccountOverviewProps & { userName?: string }) {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <h1 className="text-4xl font-bold text-[#CC292B] mt-1">{userName || 'there'}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm">
            <Star size={18} className="text-[#CC292B]" />
            <span className="text-sm font-semibold text-slate-700">Sparta Points</span>
            <span className="text-sm font-bold text-slate-900 ml-2">{stats.maxxPoints}</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
            {(userName || '?')[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sparta Points', value: stats.maxxPoints, icon: Star },
          { label: 'Orders Placed', value: stats.ordersPlaced, icon: Package },
          { label: 'Wishlist Items', value: stats.wishlistCount, icon: Heart },
          { label: 'Member Since', value: stats.memberSince, icon: Calendar },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={itemVars} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-[#CC292B]/10 flex items-center justify-center shrink-0">
              <stat.icon size={22} className="text-[#CC292B]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
              <span className="text-xl font-bold text-slate-900 leading-tight mt-0.5">{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Partner Program Banner */}
      <motion.div variants={itemVars} className="relative bg-[#FFF5F5] rounded-3xl overflow-hidden border border-[#FFEBEB]">
        <div className="relative z-10 p-8 sm:p-10 flex flex-col items-start max-w-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Partner Program</h3>
          <p className="text-slate-600 mb-6">Earn 15% commission by referring researchers.</p>
          <Link href="/affiliates" className="bg-[#CC292B] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#b02224] transition-colors">
            Apply Now
          </Link>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
           <img src="https://res.cloudinary.com/denskvdyt/image/upload/v1782719216/partner-graphic_nsiflz.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-left" />
        </div>
      </motion.div>

      {/* Two Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">

        {/* Recent Orders */}
        <motion.div variants={itemVars} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
            <Link href="/account/orders" className="text-sm font-bold text-[#CC292B] hover:text-[#b02224] transition-colors">
              View All
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-900">#{order.orderNumber}</span>
                    <span className="text-xs text-slate-500">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      order.status === 'paid' || order.status === 'completed' ? 'bg-green-50 text-green-700' :
                      order.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      order.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                      'bg-slate-50 text-slate-600'
                    }`}>{order.status}</span>
                    <span className="text-sm font-bold text-slate-900">${order.total.toFixed(2)}</span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full bg-[#FFF5F5] flex items-center justify-center">
                <Package size={28} className="text-[#CC292B]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">No orders yet</h4>
                <p className="text-slate-500 text-sm">Looks like you haven't placed any orders.</p>
              </div>
              <Link href="/shop" className="bg-[#CC292B] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#b02224] transition-colors mt-2">
                Start Shopping
              </Link>
            </div>
          )}
        </motion.div>

        {/* Right Column */}
        <motion.div variants={itemVars} className="flex flex-col gap-6">
          {/* Default Address */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Default Address</h3>
              <Link href="/account/addresses" className="text-sm font-bold text-[#CC292B] hover:text-[#b02224] transition-colors">
                Edit
              </Link>
            </div>

            {defaultAddress ? (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFF5F5] flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-[#CC292B]" />
                </div>
                <div className="flex flex-col text-sm text-slate-600">
                  <span className="font-bold text-slate-900">{defaultAddress.name}</span>
                  <span>{defaultAddress.street}</span>
                  <span>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip}</span>
                  <span>{defaultAddress.country}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF5F5] flex items-center justify-center">
                  <MapPin size={28} className="text-[#CC292B]" />
                </div>
                <p className="text-slate-500 text-sm">No address saved yet.</p>
                <Link href="/account/addresses" className="border border-[#CC292B] text-[#CC292B] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#FFF5F5] transition-colors">
                  Add Address
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-slate-900">Quick Links</h3>
            <div className="flex flex-col gap-1">
              {[
                { label: 'Earn 15% Commission', desc: 'Join the Partner Program', href: '/affiliates', icon: Users },
                { label: 'Track Order', desc: null, href: '/track', icon: TrendingUp },
                { label: 'Contact Us', desc: null, href: '/contact', icon: LifeBuoy },
              ].map((link, i) => (
                <Link key={link.label} href={link.href} className="flex items-center justify-between py-3 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFF5F5] flex items-center justify-center group-hover:bg-[#CC292B]/10 transition-colors">
                      <link.icon size={20} className="text-[#CC292B]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{link.label}</span>
                      {link.desc && <span className="text-xs text-slate-500">{link.desc}</span>}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
