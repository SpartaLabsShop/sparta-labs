'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, useScroll, useSpring } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { BlogPostCard } from '@/components/editorial/BlogPostCard'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

interface Author {
  firstName?: string
  lastName?: string
  email?: string
}

interface BlogPost {
  id: number
  title: string
  slug: string
  featuredImageUrl?: string
  excerpt?: string
  content?: any
  publishedAt?: string
  createdAt: string
  author?: Author
}

function estimateReadTime(content: any): string {
  let wordCount = 0
  const walk = (node: any) => {
    if (!node) return
    if (typeof node.text === 'string') {
      wordCount += node.text.trim().split(/\s+/).filter(Boolean).length
    }
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk(content?.root)
  return `${Math.max(1, Math.round(wordCount / 200))} min read`
}

function authorName(author?: Author): string {
  if (!author) return 'Sparta Labs Team'
  const name = [author.firstName, author.lastName].filter(Boolean).join(' ')
  return name || author.email || 'Sparta Labs Team'
}

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.tag as any
    const isMajor = node.tag === 'h1' || node.tag === 'h2'
    return (
      <Tag
        className={
          isMajor
            ? 'font-sans uppercase text-ink text-xl sm:text-2xl md:text-editorial-md mt-10 md:mt-16 mb-4 md:mb-6'
            : 'font-sans uppercase text-ink text-lg sm:text-xl mt-8 md:mt-12 mb-3 md:mb-4'
        }
      >
        {children}
      </Tag>
    )
  },
  quote: ({ node, nodesToJSX }) => (
    <blockquote className="max-w-[600px] mx-auto my-10 md:my-20 text-center border-t border-gold pt-6 md:pt-8">
      <p className="text-xl sm:text-2xl md:text-display-sm font-display italic text-ink">
        {nodesToJSX({ nodes: node.children })}
      </p>
    </blockquote>
  ),
})

export default function JournalPostPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading')

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    if (!slug) return
    setStatus('loading')
    fetch(`/api/blog-posts?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`)
      .then((r) => r.json())
      .then((data) => {
        const doc = data?.docs?.[0]
        if (!doc) {
          setStatus('not-found')
          return
        }
        setPost(doc)
        setStatus('ready')
      })
      .catch(() => setStatus('not-found'))
  }, [slug])

  useEffect(() => {
    fetch('/api/blog-posts?limit=4&sort=-createdAt&depth=1')
      .then((r) => r.json())
      .then((data) => {
        if (data?.docs) {
          setRelatedPosts(data.docs.filter((d: BlogPost) => d.slug !== slug).slice(0, 3))
        }
      })
      .catch(() => undefined)
  }, [slug])

  if (status === 'loading') {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center py-32">
        <p className="text-body-md text-ink-muted">Loading article…</p>
      </main>
    )
  }

  if (status === 'not-found' || !post) {
    return (
      <main className="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-32 px-6 text-center gap-6">
        <h1 className="text-editorial-lg font-sans uppercase text-ink">Article not found</h1>
        <p className="text-body-md text-ink-muted">This post may have been moved or unpublished.</p>
        <Link href="/journal" className="text-label-md uppercase tracking-wider text-gold underline">
          Back to Journal
        </Link>
      </main>
    )
  }

  const dateLabel = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <main className="bg-gray-50 min-h-screen pb-32">
      {/* Sticky Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Hero Image */}
      <div className="w-full h-[38vh] sm:h-[48vh] md:h-[60vh] relative mb-10 md:mb-24">
        {post.featuredImageUrl ? (
          <Image src={post.featuredImageUrl} alt={post.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-ink/10" />
        )}
        <div className="absolute inset-0 bg-ink/20" />
      </div>

      <article className="px-4 sm:px-6 max-w-[720px] mx-auto">
        <FadeUp>
          {/* Meta Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-label-md uppercase tracking-wider text-gold mb-6 md:mb-8 text-center">
            <span>Research</span>
            <span className="text-ink-muted">·</span>
            <span className="text-ink-muted">{dateLabel}</span>
            <span className="text-ink-muted">·</span>
            <span className="text-ink-muted">{estimateReadTime(post.content)}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-display-lg font-sans uppercase text-ink mb-6 md:mb-8 text-center leading-[1.1] break-words">
            {post.title}
          </h1>

          {/* Author */}
          <div className="text-body-md text-ink-muted text-center mb-10 md:mb-16">
            By <span className="text-ink font-medium">{authorName(post.author)}</span>
          </div>

          {/* Body */}
          <div className="text-body-md md:text-body-lg text-ink leading-relaxed space-y-6 md:space-y-8 break-words [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-gold [&_a]:underline">
            {post.content ? (
              <RichText data={post.content} converters={jsxConverters} disableContainer />
            ) : post.excerpt ? (
              <p>{post.excerpt}</p>
            ) : (
              <p className="text-ink-muted italic">This article doesn&apos;t have any content yet.</p>
            )}
          </div>
        </FadeUp>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="px-4 sm:px-6 max-w-[1280px] mx-auto mt-20 md:mt-32 pt-12 md:pt-16 border-t border-border-subtle">
          <div className="mb-10 md:mb-12">
            <span className="text-label-md uppercase tracking-wider text-gold mb-2 block">Related</span>
            <h3 className="text-editorial-lg font-sans uppercase text-ink">Continue reading</h3>
          </div>

          <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {relatedPosts.map((rp) => (
              <motion.div key={rp.id} variants={staggerItemVariants} className="h-full">
                <BlogPostCard
                  slug={rp.slug}
                  title={rp.title}
                  category="Research"
                  excerpt={rp.excerpt || ''}
                  imageSrc={rp.featuredImageUrl || ''}
                  readTime={estimateReadTime(rp.content)}
                  date={new Date(rp.publishedAt || rp.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                />
              </motion.div>
            ))}
          </StaggerChildren>
        </section>
      )}
    </main>
  )
}
