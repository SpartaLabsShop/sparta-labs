import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface CTASectionProps {
  subtitle?: string
  title?: string
  description?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

export function CTASection({
  subtitle = "READY TO START?",
  title = "Start earning today.",
  description = "Join hundreds of partners already earning passive income promoting premium research peptides.",
  primaryButtonText = "Join the Affiliate Program",
  primaryButtonLink = "/affiliates",
  secondaryButtonText = "Contact Us",
  secondaryButtonLink = "/contact"
}: CTASectionProps) {
  return (
    <section className="px-4 md:px-8 container mx-auto mb-16 lg:mb-24 mt-16 md:mt-24">
      <div className="relative w-full min-h-[350px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="https://res.cloudinary.com/denskvdyt/image/upload/v1782709592/cta_image_od5y14.webp"
            alt="CTA Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-16 md:p-12 lg:p-16 z-10 relative">
          
          <div className="max-w-xl text-left md:w-3/5 lg:w-1/2">
            {subtitle && (
              <p className="text-[#D31118] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4">
                {subtitle}
              </p>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6">
              {title}
            </h2>
            <p className="text-gray-300 text-sm md:text-base mb-8 max-w-md">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {primaryButtonText && (
                <Link
                  href={primaryButtonLink}
                  className="bg-[#D31118] hover:bg-[#a30d12] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center group shadow-lg"
                >
                  {primaryButtonText}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {secondaryButtonText && (
                <Link
                  href={secondaryButtonLink}
                  className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center shadow-lg"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          </div>

          {/* 3D Vial Effect */}
          <div className="hidden md:block absolute right-[2%] -bottom-[20%] w-[45%] h-[140%] pointer-events-none z-20">
            <div className="relative w-full h-full rotate-[12deg] origin-center">
              <Image
                src="https://res.cloudinary.com/denskvdyt/image/upload/v1782710041/retatrutide-30mg-Photoroom_f9agp4.png"
                alt="Retatrutide Vial"
                fill
                className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
