import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function BlogPostCard({
  slug,
  title,
  category,
  excerpt,
  imageSrc,
  readTime,
  date,
}: {
  slug: string
  title: string
  category: string
  excerpt: string
  imageSrc: string
  readTime: string
  date?: string
}) {
  return (
    <Link href={`/journal/${slug}`} className="group flex flex-col h-full">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl mb-5">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#8B6E4E]" />
          <span className="text-xs text-[#8B6E4E] font-medium">{category}</span>
        </div>

        <h3 className="text-lg font-semibold text-ink leading-snug mb-2 group-hover:text-ink-muted transition-colors duration-300">
          {title}
        </h3>

        <p className="text-sm text-ink-subtle line-clamp-3 leading-relaxed mb-4">
          {excerpt}
        </p>

        <div className="flex items-center gap-2 mt-auto text-xs text-ink-subtle">
          <span>{date ?? 'Aug 10'}</span>
          <span className="text-ink-subtle/50">·</span>
          <span>{readTime}</span>
        </div>
      </div>
    </Link>
  )
}
