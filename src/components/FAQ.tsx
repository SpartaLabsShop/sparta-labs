"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const defaultFaqs = [
  {
    question: "Are your products intended for human consumption?",
    answer:
      "No. All products sold by Sparta Peptides are strictly for laboratory research and in-vitro testing purposes only. They are not for human or animal consumption.",
  },
  {
    question: "How do you verify the purity of your peptides?",
    answer:
      "We do not rely solely on manufacturer claims. Every single batch is independently tested by accredited third-party laboratories in the USA via HPLC and MS to guarantee a minimum of 99% purity before it ever reaches our inventory.",
  },
  {
    question: "How should I store the peptides upon arrival?",
    answer:
      "For optimal stability, store lyophilized peptides in a freezer at -20°C. Once reconstituted, they should be stored in a refrigerator at 2°C to 8°C and used within the appropriate timeframe for your research.",
  },
  {
    question: "What is your shipping policy?",
    answer:
      "All orders are packed securely in climate-controlled packaging to maintain optimal conditions during transit. We process and ship orders promptly to ensure your research is not delayed.",
  },
]

interface FaqItem {
  question: string
  answer: string
}

interface FAQProps {
  faqs?: FaqItem[]
}

const FAQ = ({ faqs = defaultFaqs }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <motion.section
      className="relative bg-[#FAFAFB] bg-[url('https://res.cloudinary.com/dgrrovta3/image/upload/v1781565551/section-bg_mn6snk.webp')] bg-fixed bg-cover bg-center bg-no-repeat py-32 text-ink max-[992px]:py-24 max-[768px]:bg-scroll max-[768px]:py-20 max-[480px]:py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="relative z-2 mx-auto flex max-w-[800px] flex-col items-center gap-12 px-8 max-[992px]:gap-8 max-[768px]:gap-6 max-[768px]:px-4 max-[480px]:px-3">
        <motion.div className="flex flex-col items-center text-center" variants={itemVariants}>
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="text-[0.9rem] font-medium tracking-[0.05em] text-accent uppercase">Support</span>
          </div>
          <h2 className="m-0 text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] font-normal text-[#222222] max-[768px]:text-[2rem] max-[480px]:text-[1.75rem]">
            FREQUENTLY ASKED <br /> QUESTIONS
          </h2>
        </motion.div>

        <div className="flex w-full flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`cursor-pointer overflow-hidden rounded-xl border bg-white p-6 px-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d0d0d0] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] max-[768px]:rounded-[10px] max-[768px]:px-5 max-[768px]:py-[1.2rem] ${
                  isOpen ? "border-[#222222]" : "border-line"
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="m-0 pr-5 text-[1.2rem] font-medium text-[#111111] max-[768px]:pr-3 max-[768px]:text-base max-[480px]:text-[0.95rem]">
                    {faq.question}
                  </h3>
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 max-[768px]:h-7 max-[768px]:w-7 ${
                      isOpen ? "bg-[#111111] text-white" : "bg-black/[0.03]"
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
  )
}

export default FAQ
