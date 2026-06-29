'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { BlogPostCard } from '@/components/editorial/BlogPostCard'
import { HeroBreadcrumb } from '@/components/shared/HeroBreadcrumb'
import { Button } from '@/components/ui/button'
import { ArrowDown, Globe } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  slug: string
  image: string
  excerpt: string
  publishedAt: string
  date: string
}

export default function JournalIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  const { scrollYProgress: heroScroll } = useScroll({
    offset: ["start start", "end start"]
  })
  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "50%"])

  useEffect(() => {
    fetch('/api/blog-posts?limit=20&sort=-createdAt&depth=1')
      .then((r) => r.json())
      .then((data) => {
        if (data.docs) {
          setPosts(
            data.docs.map((doc: any) => ({
              id: doc.id,
              title: doc.title || '',
              slug: doc.slug || '',
              image: doc.featuredImageUrl || '',
              excerpt: doc.excerpt || '',
              publishedAt: doc.publishedAt || doc.createdAt,
              date: new Date(doc.publishedAt || doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  const featured = posts[0]
  const sidebar = posts.slice(1, 5)
  const grid = posts.slice(5)

  return (
    <main className="bg-[#f3f4f6] min-h-screen">
      {/* Redesigned Hero Banner */}
      <section className="px-4 md:px-8 container mx-auto mt-24 mb-16 lg:mb-24">
        <div className="relative w-full h-[250px] md:h-[350px] rounded-lg overflow-hidden bg-ink">
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
            <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/20 to-ink/95" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16 z-10">
            <FadeUp>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight">Journal</h1>
            </FadeUp>
            <HeroBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Journal' }]} />
          </div>
        </div>

        {/* Content Relocated from old Hero */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <FadeUp delay={0.2} className="flex flex-col gap-8">
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.05] text-ink font-medium tracking-tight uppercase">
              The Science Journal.
            </h2>
            <div className="flex items-center gap-6 md:gap-10 text-ink">
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">{posts.length || '—'}</span>
                <span className="text-xs md:text-sm font-light mt-2 text-ink/70 uppercase tracking-wider">Articles</span>
              </div>
              <div className="w-px h-16 bg-ink/20" />
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">100%</span>
                <span className="text-xs md:text-sm font-light mt-2 text-ink/70 uppercase tracking-wider">Science Based</span>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.4} className="flex flex-col items-start md:items-end justify-between h-full gap-8">
            <p className="text-ink/80 text-sm md:text-base md:text-right leading-relaxed font-light max-w-md">
              Documented purity, detailed guidelines, and emerging studies in advanced peptide science.
            </p>
            
            <div className="flex flex-col items-start md:items-end w-full md:w-auto relative gap-6">
              <div className="w-full md:w-auto">
                <button onClick={() => window.scrollBy({ top: 600, behavior: 'smooth' })} className="block w-full md:w-auto">
                  <Button className="w-full md:w-auto bg-ink text-white hover:bg-ink/90 rounded-full px-8 py-7 text-base lg:text-lg font-medium flex items-center justify-center gap-4 transition-all duration-300">
                    Read Latest <ArrowDown className="w-5 h-5" />
                  </Button>
                </button>
              </div>
              
              <div className="flex items-center justify-start md:justify-end gap-4 w-full md:w-auto border-t border-ink/20 pt-4">
                <Globe className="w-4 h-4 text-ink/60" />
                <span className="text-ink/60 text-xs sm:text-sm font-light tracking-wide">
                  Established 2024
                </span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Latest Posts */}
      {posts.length > 0 && (
        <section className="px-4 md:px-8 lg:px-10 pt-16 md:pt-24 mb-12 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {featured && (
              <FadeUp delay={0.1}>
                <Link href={`/journal/${featured.slug}`} className="group block h-full">
                  <div className="relative w-full h-full min-h-[350px] md:min-h-[450px] overflow-hidden rounded-2xl bg-ink/10">
                    {featured.image && (
                      <Image src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-[#D4A574]" />
                        <span className="text-xs text-white/90 font-medium">Research</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-snug mb-3">
                        {featured.title}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <span>{featured.date}</span>
                        <span>·</span>
                        <span>5 min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            )}

            {sidebar.length > 0 && (
              <FadeUp delay={0.2}>
                <div className="flex flex-col h-full">
                  <h2 className="text-2xl lg:text-3xl font-semibold text-ink mb-8">Latest post</h2>
                  <div className="flex flex-col divide-y divide-gray-100">
                    {sidebar.map((post) => (
                      <Link key={post.id} href={`/journal/${post.slug}`} className="group flex gap-4 py-5 first:pt-0 last:pb-0">
                        <div className="relative w-16 h-16 lg:w-20 lg:h-20 shrink-0 overflow-hidden rounded-xl bg-ink/10">
                          {post.image && <Image src={post.image} alt={post.title} fill className="object-cover" />}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h3 className="text-sm lg:text-[15px] font-semibold text-ink leading-snug mb-1.5 group-hover:text-ink-muted transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-ink-subtle">
                            <span>{post.date}</span>
                            <span className="text-ink-subtle/50">·</span>
                            <span>5 min read</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeUp>
            )}
          </div>
        </section>
      )}

      {/* Grid */}
      {grid.length > 0 && (
        <section className="px-4 md:px-8 lg:px-10 mb-16 md:mb-24">
          <StaggerChildren staggerDelay={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {grid.map((post) => (
              <motion.div key={post.id} variants={staggerItemVariants} className="h-full">
                <BlogPostCard
                  slug={post.slug}
                  title={post.title}
                  category="Research"
                  excerpt={post.excerpt}
                  imageSrc={post.image}
                  readTime="5 min read"
                />
              </motion.div>
            ))}
          </StaggerChildren>
        </section>
      )}

      {posts.length === 0 && (
        <section className="px-4 md:px-8 lg:px-10 py-24 text-center">
          <p className="text-ink/50 text-lg">No articles published yet. Check back soon.</p>
        </section>
      )}
    </main>
  )
}
