'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { BlogPostCard } from '@/components/editorial/BlogPostCard'
import { Button } from '@/components/ui/button'
import { ArrowDown, Globe } from 'lucide-react'

const CATEGORIES = ['All', 'Emerging', 'Guidelines', 'Studies', 'Guides']

export default function JournalIndexPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  // Hero Parallax
  const { scrollYProgress: heroScroll } = useScroll({
    offset: ["start start", "end start"]
  });
  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "50%"]);

  return (
    <main className="bg-[#f3f4f6] min-h-screen">
      {/* 1. Redesigned Hero Section */}
      <section className="relative h-screen min-h-[800px] w-full overflow-hidden bg-ink flex flex-col justify-between pt-32 pb-16 px-4 md:px-8 lg:px-10">
        
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div className="absolute inset-0 w-full h-[120%]" style={{ y: heroImageY }}>
            <Image
              src="https://res.cloudinary.com/denskvdyt/image/upload/v1781825980/sparta-peptide-lab-image_yp7lht.webp"
              alt="Science Journal"
              fill
              className="object-cover object-center opacity-60"
              priority
            />
          </motion.div>
          {/* Gradient Overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/20 to-ink/95" />
        </div>

        {/* Top Content Row */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start w-full gap-10">
          
          {/* Top Left: Stats */}
          <FadeUp delay={0.2} className="flex items-center gap-6 md:gap-10 text-white">
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">500+</span>
              <span className="text-xs md:text-sm font-light mt-2 text-white/70 uppercase tracking-wider">Articles</span>
            </div>
            <div className="w-px h-16 bg-white/20" />
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">100%</span>
              <span className="text-xs md:text-sm font-light mt-2 text-white/70 uppercase tracking-wider">Science Based</span>
            </div>
          </FadeUp>

          {/* Top Right: Paragraph */}
          <FadeUp delay={0.4} className="md:max-w-xs lg:max-w-sm">
            <p className="text-white/80 text-sm md:text-base md:text-right leading-relaxed font-light">
              Documented purity, detailed guidelines, and emerging studies in advanced peptide science.
            </p>
          </FadeUp>

        </div>

        {/* Bottom Content Row */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end w-full gap-10 mt-auto">
          
          {/* Bottom Left: Large Heading */}
          <FadeUp delay={0.6} className="max-w-3xl lg:max-w-5xl">
            <h1 className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[84px] leading-[1.05] text-white font-medium tracking-tight uppercase">
              The Science Journal.
            </h1>
          </FadeUp>

          {/* Bottom Right: Button & Footer */}
          <FadeUp delay={0.8} className="flex flex-col items-start md:items-end w-full md:w-auto relative">
            <div className="mb-6 lg:mb-8 w-full md:w-auto">
              <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} className="block w-full">
                <Button className="w-full bg-white text-ink hover:bg-white/90 rounded-none px-8 py-7 text-base lg:text-lg font-medium flex items-center justify-center gap-4 transition-all duration-300">
                  Read Latest <ArrowDown className="w-5 h-5" />
                </Button>
              </button>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[300px] lg:min-w-[400px] border-t border-white/20 pt-4">
              <Globe className="w-4 h-4 text-white/60" />
              <span className="text-white/60 text-xs sm:text-sm font-light tracking-wide">
                Established 2024
              </span>
            </div>
          </FadeUp>

        </div>

      </section>

      {/* Latest Post */}
      <section className="px-4 md:px-8 lg:px-10 pt-16 md:pt-24 mb-12 md:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Featured Image — Left */}
          <FadeUp delay={0.1}>
            <Link href="/journal/the-case-for-nad-in-mitochondrial-research" className="group block h-full">
              <div className="relative w-full h-full min-h-[350px] md:min-h-[450px] overflow-hidden rounded-2xl">
                <Image
                  src="https://res.cloudinary.com/denskvdyt/image/upload/v1781829476/blog-img_f3avn1.webp"
                  alt="Featured post"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#D4A574]" />
                    <span className="text-xs text-white/90 font-medium">Category</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-snug mb-3">
                    Enhancing Team Collaboration with SaaS Products: A Game-Changer for Modern Workflows
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <span>Aug 10</span>
                    <span>·</span>
                    <span>10min read</span>
                  </div>
                </div>
              </div>
            </Link>
          </FadeUp>

          {/* Sidebar Posts — Right */}
          <FadeUp delay={0.2}>
            <div className="flex flex-col h-full">
              <h2 className="text-2xl lg:text-3xl font-semibold text-ink mb-8">Latest post</h2>
              <div className="flex flex-col divide-y divide-gray-100">
                {[
                  { slug: 'creating-intuitive-ui', title: 'Creating an Intuitive User Interface (UI) for Your SaaS Product', img: 'https://res.cloudinary.com/denskvdyt/image/upload/v1781829476/blog-img_f3avn1.webp' },
                  { slug: 'designing-navigation-menus', title: 'Tips for designing clear and user-friendly navigation menus.', img: 'https://res.cloudinary.com/denskvdyt/image/upload/v1781829476/blog-img_f3avn1.webp' },
                  { slug: 'visual-hierarchy-guide', title: 'Exploring how to establish a visual hierarchy that guides users.', img: 'https://res.cloudinary.com/denskvdyt/image/upload/v1781829476/blog-img_f3avn1.webp' },
                  { slug: 'color-influence-emotions', title: 'How to use color to influence user emotions and actions.', img: 'https://res.cloudinary.com/denskvdyt/image/upload/v1781829476/blog-img_f3avn1.webp' },
                ].map((post) => (
                  <Link
                    key={post.slug}
                    href={`/journal/${post.slug}`}
                    className="group flex gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <div className="relative w-16 h-16 lg:w-20 lg:h-20 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={post.img}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 className="text-sm lg:text-[15px] font-semibold text-ink leading-snug mb-1.5 group-hover:text-ink-muted transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-ink-subtle">
                        <span>Aug 10</span>
                        <span className="text-ink-subtle/50">·</span>
                        <span>10min read</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="px-4 md:px-8 lg:px-10 mb-12 flex justify-center">
        <FadeUp delay={0.2} className="w-full md:w-auto">
          <div 
            className="flex md:inline-flex bg-white rounded-lg p-2 shadow-sm border border-gray-100 overflow-x-auto gap-2 snap-x w-full md:w-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 snap-start px-5 md:px-6 py-2.5 md:py-3 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-ink text-white shadow-md' 
                    : 'bg-transparent text-gray-500 hover:text-ink hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-8 lg:px-10 mb-16 md:mb-24">
        <StaggerChildren staggerDelay={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div key={i} variants={staggerItemVariants} className="h-full">
              <BlogPostCard 
                slug={`sample-post-${i}`}
                title={`Guideline: Reconstitution and storage guidelines ${i}`}
                category={i % 2 === 0 ? 'Guidelines' : 'Studies'}
                excerpt="Best practices for maintaining peptide stability, minimizing degradation, and ensuring accurate dosing in clinical environments."
                imageSrc="https://res.cloudinary.com/denskvdyt/image/upload/v1781829476/blog-img_f3avn1.webp"
                readTime="5 min read"
              />
            </motion.div>
          ))}
        </StaggerChildren>
      </section>

      {/* Infinite Scroll trigger area */}
      <section className="pb-24 flex justify-center">
        <FadeUp>
          <Button className="px-10 h-14 rounded-lg bg-ink text-white hover:bg-[#1a1a1a] hover:shadow-lg transition-all duration-300 font-bold text-sm tracking-wider uppercase border-none">
            Load More Posts
          </Button>
        </FadeUp>
      </section>
    </main>
  )
}
