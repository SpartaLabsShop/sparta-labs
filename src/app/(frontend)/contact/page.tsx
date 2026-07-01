'use client'

import React, { useState } from 'react'
import { FadeUp } from '@/components/motion/FadeUp'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { HeroBreadcrumb } from '@/components/shared/HeroBreadcrumb'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { submitContactForm } from './actions'
import { toast } from 'sonner'
import { TurnstileWidget } from '@/components/TurnstileWidget'

const CONTACT_FAQS = [
  { question: 'When will my order ship?', answer: 'Orders placed before 2:00 PM EST Monday through Friday are shipped the same day. Orders placed after the cutoff or on weekends will ship the following business day.' },
  { question: 'Where is my tracking number?', answer: 'Tracking numbers are automatically emailed as soon as your shipping label is created. You can also view your tracking status by logging into your account dashboard.' },
  { question: 'My package was damaged in transit, what do I do?', answer: 'If your vials arrive compromised, please use the contact form above to reach out within 48 hours of delivery. Include your order number and we will request photos of the damaged items to expedite a replacement.' },
  { question: 'How can I get a copy of my batch COA?', answer: 'Certificates of Analysis (COAs) are included with every shipment and are also available digitally. You can download past COAs directly from your Order History in your account dashboard, or request them via the Quality & COAs contact email.' },
  { question: 'Do you offer wholesale pricing for laboratories?', answer: 'Yes, we offer special pricing tiers for bulk acquisition by licensed laboratories and academic institutions. Please select "Wholesale" in the contact form department dropdown or email wholesale@spartalabs.shop directly.' },
  { question: 'Why was my order cancelled?', answer: 'Orders may be cancelled if our fraud detection system flags an issue with the payment method, or if there is any communication indicating the intent to misuse our research-only products for human consumption.' },
  { question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide. However, it is the sole responsibility of the researcher to ensure that the importation of our research compounds complies with all local and national regulations in the destination country.' }
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!turnstileToken) { toast.error('Please complete the verification challenge.'); return }
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('turnstileToken', turnstileToken)
    const result = await submitContactForm(formData)

    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      setSubmitted(true)
    }
  }

  const toggleFAQ = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const faqContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const faqItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
  }



  return (
    <main className="bg-white min-h-screen pt-24 pb-24">
      {/* Hero Banner */}
      <section className="px-4 md:px-8 container mx-auto mb-16 lg:mb-24">
        <div className="relative w-full h-[250px] md:h-[350px] rounded-lg overflow-hidden">
          {/* Using the provided red abstract background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://res.cloudinary.com/denskvdyt/image/upload/v1782704560/glass_abstract_bg_loo5no.webp')" }}
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight">Contacts</h1>
            <HeroBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 container mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20">

          {/* Left Column: Info */}
          <div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4 block">get in touch</span>
            <h2 className="text-4xl md:text-5xl font-medium text-ink mb-6 tracking-tight leading-tight">
              We are always ready to help you and answer your questions
            </h2>
            <p className="text-gray-500 leading-relaxed mb-12 max-w-xl">
              Whether you need to report an issue with an order, request a specific batch COA, or inquire about bulk acquisition, our support team is available to assist.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              <div>
                <h4 className="font-bold text-ink mb-3">Order Support</h4>
                <p className="text-gray-500 text-sm">support@spartalabs.shop</p>
                <p className="text-gray-500 text-sm mt-1">Responses within 12 hours</p>
              </div>

              <div>
                <h4 className="font-bold text-ink mb-3">Our Location</h4>
                <p className="text-gray-500 text-sm">Sparta Labs</p>
                <p className="text-gray-500 text-sm mt-1">123 Innovation Drive, Suite 400<br />Research Triangle Park, NC 27709</p>
              </div>

              <div>
                <h4 className="font-bold text-ink mb-3">Other Inquiries</h4>
                <p className="text-gray-500 text-sm">quality@spartalabs.shop</p>
                <p className="text-gray-500 text-sm mt-1">wholesale@spartalabs.shop</p>
              </div>

            </div>
          </div>

          {/* Right Column: Form */}
          <div className="relative">

            <div className="bg-[#f5f5f5] rounded-3xl p-8 md:p-12 h-full">
              {submitted ? (
                <div className="text-center h-full flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-medium text-ink mb-4 tracking-tight">Message received</h3>
                  <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                    Your inquiry has been successfully routed to the appropriate department. A representative will contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-medium text-ink mb-2">Get In Touch</h3>
                    <p className="text-sm text-gray-500 mb-8">
                      Define your goals and identify areas where we can add value to your research.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <Select defaultValue="general" name="department">
                        <SelectTrigger className="w-full bg-transparent border-0 border-b border-gray-300 rounded-none px-0 py-4 h-auto focus:ring-0 focus:border-ink shadow-none text-gray-600 text-sm">
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Order Support</SelectItem>
                          <SelectItem value="quality">Quality & COAs</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        required
                        placeholder="Full name"
                        className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-4 focus:ring-0 focus:border-ink focus:outline-none transition-colors text-sm text-ink placeholder:text-gray-400"
                      />
                    </div>

                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Email"
                        className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-4 focus:ring-0 focus:border-ink focus:outline-none transition-colors text-sm text-ink placeholder:text-gray-400"
                      />
                    </div>

                    <div className="relative">
                      <input
                        id="subject"
                        name="subject"
                        required
                        placeholder="Subject"
                        className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-4 focus:ring-0 focus:border-ink focus:outline-none transition-colors text-sm text-ink placeholder:text-gray-400"
                      />
                    </div>

                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        required
                        placeholder="Message"
                        rows={1}
                        className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-4 focus:ring-0 focus:border-ink focus:outline-none transition-colors text-sm text-ink placeholder:text-gray-400 resize-none min-h-[40px]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={isSubmitting || !turnstileToken} className="rounded-xl bg-[#2a2a2a] text-white hover:bg-black px-6 py-6 h-auto text-sm font-medium flex items-center gap-3 disabled:opacity-60">
                      Send a message
                      <span className="bg-white/10 rounded-full p-1"><ChevronRight size={16} /></span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

      </section>

      {/* FAQs Section */}
      <motion.section
        className="relative bg-white py-24 text-ink max-[992px]:py-20 max-[768px]:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={faqContainerVariants}
      >
        <div className="relative z-2 mx-auto flex max-w-[800px] flex-col items-center gap-12 px-8 max-[992px]:gap-8 max-[768px]:gap-6 max-[768px]:px-4 max-[480px]:px-3">
          <motion.div className="flex flex-col items-center text-center" variants={faqItemVariants}>
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="text-[0.9rem] font-medium tracking-[0.05em] text-accent uppercase">Support</span>
            </div>
            <h2 className="m-0 text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] font-normal text-[#222222] max-[768px]:text-[2rem] max-[480px]:text-[1.75rem]">
              FREQUENTLY ASKED <br /> QUESTIONS
            </h2>
          </motion.div>

          <div className="flex w-full flex-col gap-4">
            {CONTACT_FAQS.map((faq, index: number) => {
              const isOpen = openFaqIndex === index
              return (
                <motion.div
                  key={index}
                  variants={faqItemVariants}
                  className={`cursor-pointer overflow-hidden rounded-xl border bg-white p-6 px-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d0d0d0] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] max-[768px]:rounded-[10px] max-[768px]:px-5 max-[768px]:py-[1.2rem] ${isOpen ? "border-[#222222]" : "border-[#e5e7eb]"
                    }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="m-0 pr-5 text-[1.2rem] font-medium text-[#111111] max-[768px]:pr-3 max-[768px]:text-base max-[480px]:text-[0.95rem]">
                      {faq.question}
                    </h3>
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 max-[768px]:h-7 max-[768px]:w-7 ${isOpen ? "bg-[#111111] text-white" : "bg-black/[0.03]"
                        }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div
                    className={`transition-all duration-300 ease-in-out ${isOpen ? "mt-4" : "mt-0"}`}
                    style={{
                      maxHeight: isOpen ? "200px" : "0",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p className="m-0 text-base leading-[1.6] text-[#666666] max-[768px]:text-[0.95rem] max-[480px]:text-[0.9rem]">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>
    </main>
  )
}

