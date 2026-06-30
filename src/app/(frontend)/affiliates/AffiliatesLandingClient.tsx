'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { HeroBreadcrumb } from '@/components/shared/HeroBreadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, DollarSign, Clock, ShieldCheck, Activity, BarChart3, Link as LinkIcon, XCircle, AlertTriangle, FileText, ArrowRight } from 'lucide-react'
import FAQ from '@/components/FAQ'
import { submitAffiliateApplication } from './actions'
import { useRouter } from 'next/navigation'
import { CTASection } from '@/components/shared/CTASection'
const AFFILIATE_FAQS = [
  { question: 'How does the affiliate program work?', answer: 'Sparta Labs affiliate program is a referral-based marketing system where you earn commission by directing customers to our website. You receive unique tracking links and discount codes that identify purchases from your referrals. When someone uses your link or code to buy research peptides, you earn 15% commission on their order value. Our automated system tracks everything and calculates your earnings in real-time.' },
  { question: 'How do I get paid as an affiliate?', answer: 'Payouts are available via PayPal, Stripe, or bank transfer once your approved commissions reach $30. You control how and when you receive payments through your affiliate dashboard settings.' },
  { question: 'When do I receive commissions?', answer: 'Commissions are paid on the first week of each month for the previous month\'s approved sales (e.g., January sales are paid the first week of February), after a 14-day protection period.' },
  { question: 'Can beginners join this affiliate program?', answer: 'Yes! There is zero technical setup required, and we provide dedicated affiliate support. It is perfect for beginners exploring affiliate marketing.' },
  { question: 'How are referrals tracked?', answer: 'We use a dual attribution system with both referral links and personalized discount codes to ensure you never miss a commission.' },
  { question: 'What is cookie duration and why does it matter?', answer: 'We offer a 7-day cookie duration. If a customer clicks your link but buys within 7 days, you still receive full commission credit.' },
  { question: 'Are there any costs to join the affiliate program?', answer: 'No, there are zero upfront costs or technical setup requirements. Just straightforward affiliate marketing opportunities.' },
  { question: 'What marketing methods can I use?', answer: 'You can promote through your website, blog, email list, social media, or scientific community platforms, ensuring you maintain a scientific tone and comply with our content standards.' },
  { question: 'Can I use my own discount code?', answer: 'Yes, you will have access to a dashboard to generate custom referral links and personalized discount codes for your audience.' },
  { question: 'What products should I promote as an affiliate?', answer: 'You can promote our premium research peptides, positioning all products as "research use only" without any medical or athletic performance claims.' },
  { question: 'How do I maximize my affiliate earnings?', answer: 'Share your custom 15% discount code widely; it provides genuine value to your audience and significantly improves conversion rates.' },
  { question: 'What happens if someone uses another affiliate\'s code after clicking my link?', answer: 'Our dual tracking system ensures accurate attribution. Typically, the custom discount code used at checkout takes precedence.' },
  { question: 'Can I promote on social media?', answer: 'Yes, social media promotion is encouraged. However, avoid bodybuilding, performance enhancement, or athletic language, and include appropriate disclaimers.' },
]

export type UserAffiliateStatus = 'guest' | 'user' | 'pending_application' | 'affiliate_approved' | 'affiliate_pending' | 'affiliate_rejected'

interface Props {
  userStatus: UserAffiliateStatus;
}

export function AffiliatesLandingClient({ userStatus }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    const result = await submitAffiliateApplication(formData)
    
    setIsSubmitting(false)
    
    if (result.success) {
      setSubmitted(true)
    } else {
      if (result.error === 'Unauthorized. Please log in to apply.') {
        router.push('/login?redirect=/affiliates#apply')
      } else {
        setError(result.error || 'Something went wrong.')
      }
    }
  }

  // Hero Parallax
  const { scrollYProgress: heroScroll } = useScroll({
    offset: ["start start", "end start"]
  });
  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "100%"]);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="px-4 md:px-8 container mx-auto mt-24 mb-8 lg:mb-12">
        <div className="relative w-full h-[250px] md:h-[350px] rounded-lg overflow-hidden bg-ink">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div className="absolute inset-0 w-full h-[120%]" style={{ y: heroImageY }}>
              <Image
                src="https://res.cloudinary.com/denskvdyt/image/upload/v1782708405/afilliate_hero_image_uum4vj.webp"
                alt="Affiliate Program"
                fill
                className="object-cover object-center opacity-60"
                priority
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/20 to-ink/95" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16 z-10">
            <FadeUp>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight">Affiliates</h1>
            </FadeUp>
            <HeroBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Affiliates' }]} />
          </div>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <FadeUp delay={0.2} className="flex flex-col gap-8">
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.05] text-ink font-medium tracking-tight uppercase">
              Earn Passive Income.
            </h2>
            <div className="flex items-center gap-6 md:gap-10 text-ink">
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">15%</span>
                <span className="text-xs md:text-sm font-light mt-2 text-ink/70 uppercase tracking-wider">Commission</span>
              </div>
              <div className="w-px h-16 bg-ink/20" />
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">$0</span>
                <span className="text-xs md:text-sm font-light mt-2 text-ink/70 uppercase tracking-wider">Upfront Cost</span>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.4} className="flex flex-col items-start md:items-end justify-between h-full gap-8">
            <p className="text-ink/80 text-sm md:text-base md:text-right leading-relaxed font-light max-w-md">
              Partner with Sparta Labs and unlock a lucrative affiliate marketing opportunity in the growing life sciences industry.
            </p>

            <div className="flex flex-col items-start md:items-end w-full md:w-auto relative gap-6">
              <div className="w-full md:w-auto">
                <Link href="#apply" className="block w-full">
                  <Button className="w-full md:w-auto bg-ink text-white hover:bg-ink/90 rounded-xl px-8 py-7 text-base lg:text-lg font-medium flex items-center justify-center gap-4 transition-all duration-300">
                    Join the Program
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-start md:justify-end gap-4 w-full md:w-auto border-t border-ink/20 pt-4">
                <span className="text-ink/60 text-xs sm:text-sm font-light tracking-wide">
                  No technical setup required
                </span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* How It Works — Pillars Style */}
      <section className="pt-16 pb-16 lg:pt-16 lg:pb-20 px-4 md:px-8 lg:px-10 bg-white relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr] gap-8 lg:gap-16">

            {/* Left Column: Title + Curve */}
            <div className="relative">
              <FadeUp className="mb-12 lg:mb-0 lg:pt-10 relative z-20">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-ink leading-[1.1] tracking-tight">
                  How It
                  <br />
                  Works.
                </h2>
                <p className="text-base text-ink-muted leading-relaxed font-light max-w-xs mt-6">
                  A win-win referral model that creates strong conversion rates by offering genuine value to both you and your audience.
                </p>
              </FadeUp>

              <div className="hidden lg:block absolute left-0 top-[350px] bottom-[50px] w-full pointer-events-none z-0">
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0,0 Q 100,50 0,100" stroke="#e5e5e5" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="absolute top-[12.5%] right-0 h-px border-b border-dashed border-[#ccc]" style={{ left: '21.875%' }} />
                <div className="absolute top-[12.5%] w-2.5 h-2.5 rounded-full bg-[#888] -translate-x-1/2 -translate-y-1/2" style={{ left: '21.875%' }} />
                <div className="absolute top-[37.5%] right-0 h-px border-b border-dashed border-[#ccc]" style={{ left: '46.875%' }} />
                <div className="absolute top-[37.5%] w-2.5 h-2.5 rounded-full bg-[#888] -translate-x-1/2 -translate-y-1/2" style={{ left: '46.875%' }} />
                <div className="absolute top-[62.5%] right-0 h-px border-b border-dashed border-[#ccc]" style={{ left: '46.875%' }} />
                <div className="absolute top-[62.5%] w-2.5 h-2.5 rounded-full bg-[#888] -translate-x-1/2 -translate-y-1/2" style={{ left: '46.875%' }} />
                <div className="absolute top-[87.5%] right-0 h-px border-b border-dashed border-[#ccc]" style={{ left: '21.875%' }} />
                <div className="absolute top-[87.5%] w-2.5 h-2.5 rounded-full bg-[#888] -translate-x-1/2 -translate-y-1/2" style={{ left: '21.875%' }} />
              </div>
            </div>

            {/* Right Column: Steps */}
            <div className="flex flex-col justify-around gap-16 lg:gap-0 lg:pt-[350px] lg:pb-[50px] min-h-[600px] lg:min-h-[1200px]">
              {[
                { num: '01', title: 'Join the Program', desc: 'Complete our simple registration form. Approval is typically instant. No technical setup required.' },
                { num: '02', title: 'Get Your Links', desc: 'Access your dashboard to generate custom referral links and personalized discount codes.' },
                { num: '03', title: 'Share Your Links', desc: 'Promote through your website, blog, email list, social media, or scientific community platforms.' },
                { num: '04', title: 'Earn Commissions', desc: 'Earn 15% commission on every purchase. Track clicks, conversions, and payouts in real-time.' },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 xl:gap-16 w-full relative z-10"
                >
                  <div
                    className="text-[80px] sm:text-[100px] xl:text-[120px] font-black text-red-400 leading-none tracking-tighter select-none shrink-0"
                    style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
                  >
                    {step.num}
                  </div>
                  <div className="flex-1 max-w-xl">
                    <h3 className="text-2xl sm:text-3xl font-medium text-ink mb-3 tracking-tight">{step.title}</h3>
                    <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-light">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Commission Structure — Services Style */}
      <section className="bg-white text-ink py-16 lg:py-20 px-4 md:px-8 lg:px-10">
        <div className="container mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — Heading + Commission Details */}
          <FadeUp>
            <div className="flex flex-col">
              <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-6">
                Commission Structure
              </h2>
              <p className="text-base lg:text-lg text-ink-muted leading-relaxed font-light max-w-md mb-10 lg:mb-16">
                Your commission is calculated on the full order value before discounts, maximizing your earning potential.
              </p>

              {/* Commission Example Table */}
              <div className="space-y-4 text-sm mb-10">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-ink-muted font-light">Customer Order Value</span>
                  <span className="font-medium text-ink">$200</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-ink-muted font-light">Customer Discount (15%)</span>
                  <span className="font-medium text-red-500">-$30</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-ink-muted font-light">Customer Pays</span>
                  <span className="font-medium text-ink">$170</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-ink font-medium">Your Commission (15% of $200)</span>
                  <span className="font-semibold text-3xl text-ink tracking-tight">$30</span>
                </div>
              </div>

              {/* Earnings Tiers */}
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-ink/50 uppercase tracking-[0.15em] mb-4">Realistic Monthly Earnings</h4>
                {[
                  { referrals: '10 referrals/mo', avg: '@ $150 avg order', earning: '$225' },
                  { referrals: '25 referrals/mo', avg: '@ $150 avg order', earning: '$562.5' },
                  { referrals: '50 referrals/mo', avg: '@ $150 avg order', earning: '$1,125' },
                ].map((tier, i) => (
                  <div key={i} className={`flex justify-between items-center p-4 rounded-xl border transition-colors ${i === 2 ? 'border-ink/20 bg-ink/[0.03]' : 'border-gray-100'}`}>
                    <div>
                      <div className="font-medium text-ink text-sm">{tier.referrals}</div>
                      <div className="text-[10px] text-ink/40 uppercase tracking-wider mt-0.5">{tier.avg}</div>
                    </div>
                    <div className={`font-semibold text-lg ${i === 2 ? 'text-ink' : 'text-ink/70'}`}>{tier.earning}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Right — Metric Cards */}
          <FadeUp delay={0.2}>
            <div className="grid grid-cols-2 gap-5 lg:gap-6 lg:mt-24">
              {[
                { value: '7', label: 'Day Cookie Duration' },
                { value: '$30', label: 'Payout Threshold' },
                { value: '14', label: 'Day Protection' },
                { value: 'Dual', label: 'Tracking System' },
              ].map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="aspect-square rounded-2xl border border-gray-100 flex flex-col items-start justify-end p-6 lg:p-8 hover:-translate-y-1 transition-transform duration-300"
                >
                  <span className="text-4xl md:text-5xl lg:text-6xl font-light text-ink tracking-tight mb-2">{metric.value}</span>
                  <span className="text-xs font-light text-ink/50 uppercase tracking-wider">{metric.label}</span>
                </motion.div>
              ))}
            </div>
          </FadeUp>

        </div>
      </section>

      {/* Tracking & Tools — Interactive Split */}
      <section className="bg-white text-ink py-16 lg:py-20 px-4 md:px-8 lg:px-10">
        <div className="container mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — Tracking Technology */}
          <FadeUp>
            <div className="flex flex-col">
              <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-6">
                Your Tools
              </h2>
              <p className="text-base lg:text-lg text-ink-muted leading-relaxed font-light max-w-md mb-10 lg:mb-16">
                Advanced tracking technology and comprehensive management tools to maximize your affiliate performance.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Clock, title: '7-Day Cookie Duration', desc: 'If a customer clicks your link but buys within 7 days, you still receive full commission credit.' },
                  { icon: LinkIcon, title: 'Dual Attribution System', desc: 'Both referral link tracking and coupon-code tracking ensure you never miss a commission.' },
                  { icon: Activity, title: 'Real-Time Commission Tracking', desc: 'Your affiliate dashboard provides instant visibility into total clicks, conversion rates, and earnings.' },
                  { icon: DollarSign, title: 'Flexible Payment Options', desc: 'Once your account reaches $30 in approved commissions, you\'re eligible for monthly payout via PayPal, Stripe, or bank transfer.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex gap-5 group"
                  >
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-ink/40 transition-colors">
                      <item.icon className="w-4 h-4 text-ink/60" />
                    </div>
                    <div>
                      <h4 className="font-medium text-ink mb-1">{item.title}</h4>
                      <p className="text-sm text-ink-muted font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Right — Management Tools */}
          <FadeUp delay={0.2}>
            <div className="flex flex-col gap-8 lg:mt-24">
              {[
                { icon: BarChart3, title: 'Performance Analytics', items: ['Real-time traffic and conversion data', 'Click-through rates by link', 'Top-performing products', 'Revenue trends and forecasting'] },
                { icon: LinkIcon, title: 'Link & Discount Management', items: ['Referral link generator for any product or page', 'Create unlimited custom links & track performance', 'Generate personalized coupon codes', 'Track usage and redemption rates by code'] },
                { icon: FileText, title: 'Commission Reports & Resources', items: ['Detailed transaction history (pending vs. approved)', 'Monthly earnings summaries & downloadable reports', 'Pre-approved promotional content & product images', 'Compliance guidelines & educational materials'] },
              ].map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border border-gray-100 rounded-2xl p-6 lg:p-8 hover:border-gray-200 transition-colors"
                >
                  <h4 className="font-medium text-ink flex items-center gap-3 mb-4">
                    <tool.icon className="w-4 h-4 text-ink/40" />
                    {tool.title}
                  </h4>
                  <ul className="text-sm text-ink-muted font-light space-y-2">
                    {tool.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-ink/30 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </FadeUp>

        </div>
      </section>

      {/* Why Choose — Clean Editorial Grid */}
      <section className="bg-white text-ink py-16 lg:py-20 px-4 md:px-8 lg:px-10">
        <div className="container mx-auto">
          <FadeUp>
            <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-4">
              Why Choose
              <br className="hidden sm:block" />
              Our Program
            </h2>
            <p className="text-base lg:text-lg text-ink-muted leading-relaxed font-light max-w-lg mb-16">
              A true passive income opportunity where previous work continues generating commissions over time.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {[
              { title: 'High Conversion Rates', desc: 'The built-in 15% customer discount significantly improves conversion rates compared to programs without discounts. Your audience receives immediate value.' },
              { title: '15% Commission', desc: 'Strong earning potential in the scientific products niche. Many lab supplies programs offer only 5-10%—our rate is among the best in biotech.' },
              { title: 'No Technical Setup', desc: 'Join in minutes with zero coding or website requirements. Perfect for beginners exploring affiliate marketing opportunities.' },
              { title: 'Growing Market', desc: 'The research peptide industry continues expanding. Promote products with genuine demand from laboratories and scientific professionals.' },
              { title: 'Premium Quality', desc: 'We maintain rigorous quality standards with third-party testing and purity verification. Confidently promote products knowing they meet specifications.' },
              { title: 'Dedicated Support', desc: 'Our affiliate management team provides assistance with strategy, compliance questions, and technical support. You\'re never alone.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-white p-8 lg:p-10 flex flex-col"
              >
                <span className="text-xs font-medium text-ink/30 uppercase tracking-[0.15em] mb-4">0{i + 1}</span>
                <h4 className="text-lg font-medium text-ink mb-3 tracking-tight">{feature.title}</h4>
                <p className="text-sm text-ink-muted leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guidelines & Compliance */}
      <section className="bg-white text-ink py-16 lg:py-20 px-4 md:px-8 lg:px-10">
        <div className="container mx-auto max-w-5xl">
          <FadeUp>
            <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-4">
              Guidelines &
              <br className="hidden sm:block" />
              Compliance
            </h2>
            <p className="text-base lg:text-lg text-ink-muted leading-relaxed font-light max-w-md mb-16">
              Maintaining our scientific integrity is essential.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FadeUp delay={0.1}>
              <div className="border border-red-200/60 rounded-2xl p-8 lg:p-10 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="text-xl font-medium text-ink tracking-tight">Prohibited Practices</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /><span className="text-sm text-ink-muted font-light">No misleading or exaggerated earnings claims</span></li>
                  <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /><span className="text-sm text-ink-muted font-light">No medical claims - never suggest products are for human consumption</span></li>
                  <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /><span className="text-sm text-ink-muted font-light">No spam, unsolicited emails, or mass messaging</span></li>
                  <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /><span className="text-sm text-ink-muted font-light">No bidding on brand keywords in paid search</span></li>
                  <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /><span className="text-sm text-ink-muted font-light">No trademark misuse in domain names</span></li>
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="border border-gray-100 rounded-2xl p-8 lg:p-10 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck className="w-5 h-5 text-ink/40" />
                  <h3 className="text-xl font-medium text-ink tracking-tight">Content Standards</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-ink/30 shrink-0 mt-0.5" /><span className="text-sm text-ink-muted font-light">Position all products as &ldquo;research use only&rdquo;</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-ink/30 shrink-0 mt-0.5" /><span className="text-sm text-ink-muted font-light">Avoid bodybuilding, performance enhancement, or athletic language</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-ink/30 shrink-0 mt-0.5" /><span className="text-sm text-ink-muted font-light">Include appropriate disclaimers in all content</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-ink/30 shrink-0 mt-0.5" /><span className="text-sm text-ink-muted font-light">Comply with FTC affiliate disclosure requirements</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-ink/30 shrink-0 mt-0.5" /><span className="text-sm text-ink-muted font-light">Maintain a scientific and professional tone</span></li>
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="bg-white text-ink py-16 lg:py-20 px-4 md:px-8 lg:px-10 scroll-mt-32">
        <div className="container mx-auto max-w-4xl">
          <FadeUp>
            <div className="mb-12 text-center">
              <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-4">
                Partner Application
              </h2>
              <p className="text-base lg:text-lg text-ink-muted leading-relaxed font-light max-w-2xl mx-auto">
                The application takes less than 2 minutes. No technical setup. No upfront costs. Just straightforward affiliate marketing opportunities with a trusted research peptide provider.
              </p>
            </div>

            <div className="border border-gray-100 rounded-2xl p-8 md:p-12 lg:p-16">
              {userStatus === 'affiliate_approved' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Activity className="w-8 h-8 text-ink/60" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-medium text-ink mb-4 tracking-tight">You are an active partner!</h3>
                  <p className="text-base text-ink-muted max-w-md mx-auto leading-relaxed font-light mb-10">
                    Your affiliate account is active and ready. Access your dashboard to view your links, stats, and payouts.
                  </p>
                  <Link href="/affiliates/dashboard">
                    <Button className="bg-ink text-white hover:bg-ink/90 rounded-xl px-10 py-7 text-base font-medium">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              ) : userStatus === 'affiliate_pending' || userStatus === 'pending_application' || submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-8 h-8 text-green-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-medium text-ink mb-4 tracking-tight">Application Under Review</h3>
                  <p className="text-base text-ink-muted max-w-md mx-auto leading-relaxed font-light mb-10">
                    Your application has been received and is currently under review by our team. We will notify you once it's approved.
                  </p>
                </div>
              ) : userStatus === 'affiliate_rejected' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                    <XCircle className="w-8 h-8 text-red-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-medium text-ink mb-4 tracking-tight">Application Status</h3>
                  <p className="text-base text-ink-muted max-w-md mx-auto leading-relaxed font-light mb-10">
                    Unfortunately, your application to the affiliate program was not approved at this time.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div className="space-y-6">
                    <h3 className="text-xs font-medium text-ink/50 uppercase tracking-[0.15em] pb-3 border-b border-gray-100">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-sm font-medium text-ink">Display Name *</Label>
                        <Input id="displayName" name="displayName" required placeholder="John Doe or Channel Name" className="h-14 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-1 focus:ring-ink/20 focus:border-ink/20 px-4" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="websiteUrl" className="text-sm font-medium text-ink">Website URL</Label>
                        <Input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://example.com" className="h-14 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-1 focus:ring-ink/20 focus:border-ink/20 px-4" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-medium text-ink/50 uppercase tracking-[0.15em] pb-3 border-b border-gray-100">Primary Platform</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="platform" className="text-sm font-medium text-ink">Platform *</Label>
                        <Select defaultValue="youtube" required name="platform">
                          <SelectTrigger id="platform" className="h-14 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-1 focus:ring-ink/20 px-4">
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
                        <Label htmlFor="socialUrl" className="text-sm font-medium text-ink">Profile URL *</Label>
                        <Input id="socialUrl" name="socialUrl" type="url" required placeholder="https://youtube.com/c/..." className="h-14 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-1 focus:ring-ink/20 focus:border-ink/20 px-4" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-medium text-ink/50 uppercase tracking-[0.15em] pb-3 border-b border-gray-100">Audience & Strategy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="reach" className="text-sm font-medium text-ink">Estimated Monthly Reach *</Label>
                        <Select defaultValue="1k-10k" required name="reach">
                          <SelectTrigger id="reach" className="h-14 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-1 focus:ring-ink/20 px-4">
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
                        <Label htmlFor="niche" className="text-sm font-medium text-ink">Your Niche</Label>
                        <Input id="niche" name="niche" placeholder="e.g. Biohacking, Fitness, Longevity" className="h-14 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-1 focus:ring-ink/20 focus:border-ink/20 px-4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="methods" className="text-sm font-medium text-ink">Promotion Methods *</Label>
                      <Textarea
                        id="methods"
                        name="methods"
                        required
                        placeholder="How do you plan to promote our products?"
                        className="min-h-[120px] rounded-xl bg-gray-50/50 border-gray-100 focus:ring-1 focus:ring-ink/20 focus:border-ink/20 p-4 resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex flex-col items-start gap-6">
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <Checkbox id="terms" name="terms" required className="mt-1" />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="terms" className="text-sm font-medium text-ink cursor-pointer">
                          Accept terms and conditions
                        </Label>
                        <p className="text-xs text-ink-muted font-light mt-1 leading-relaxed">
                          I agree to the Affiliate Program Terms of Service and acknowledge that I will only promote products in accordance with legal and platform guidelines.
                        </p>
                      </div>
                    </div>

                    <div className="w-full flex justify-end">
                      <Button type="submit" isLoading={isSubmitting} className="w-full md:w-auto bg-ink text-white hover:bg-ink/90 rounded-xl px-10 py-7 text-base font-medium">
                        Submit Application
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FAQ */}
      <FAQ faqs={AFFILIATE_FAQS} />

      {/* CTA — Premium Aesthetic (matching About page) */}
      <CTASection
        subtitle="PARTNER PROGRAM"
        title="Start earning today."
        description="The application takes less than 2 minutes. No technical setup. No upfront costs. Just straightforward affiliate marketing opportunities."
        primaryButtonText="Become an Affiliate"
        primaryButtonLink="#apply"
        secondaryButtonText="Contact Us"
        secondaryButtonLink="mailto:affiliates@spartalabs.shop"
      />
      <section className="bg-white px-6 lg:px-12 pb-24">
        <div className="pt-8 border-t border-gray-200 max-w-[1400px] mx-auto">
          <p className="text-xs text-gray-400 text-center max-w-4xl mx-auto leading-relaxed">
            <strong className="text-gray-500">Research Use Only:</strong> All Sparta Labs products are manufactured and sold exclusively for laboratory research purposes. Not for human consumption, medical treatment, or athletic performance enhancement. This affiliate program is for marketing research compounds only. Affiliates must comply with all applicable laws and regulations.
          </p>
        </div>
      </section>
    </main>
  )
}
