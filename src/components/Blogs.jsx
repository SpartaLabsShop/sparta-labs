"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Blogs = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/blog-posts?limit=5&sort=-createdAt&depth=1")
      .then((r) => r.json())
      .then((data) => {
        if (data.docs && data.docs.length > 0) {
          setPosts(
            data.docs.map((doc) => ({
              id: doc.id,
              title: doc.title || "",
              slug: doc.slug || "",
              image: doc.featuredImageUrl || "",
              date: new Date(doc.publishedAt || doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              readTime: "5 min read",
              category: "Research",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const featured = posts[0];
  const latest = posts.slice(1, 5);

  if (posts.length === 0) return null;

  return (
    <motion.section
      className="bg-white py-24 text-[#111111]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-[1700px] px-8 max-[768px]:px-4 max-[480px]:px-3">
        {/* Header */}
        <motion.div className="mb-12 flex items-center justify-between" variants={itemVariants}>
          <h2 className="text-[2rem] font-semibold tracking-tight text-[#111111]">From the Journal</h2>
          <Link href="/journal" className="text-sm font-medium text-ink/60 hover:text-ink transition-colors uppercase tracking-widest">
            View All →
          </Link>
        </motion.div>

        {/* Top Section: Featured & Latest */}
        <div className="mb-12 grid grid-cols-[2fr_1fr] gap-10 max-[992px]:grid-cols-1">
          {/* Featured Post */}
          {featured && (
            <motion.div variants={itemVariants}>
              <Link href={`/journal/${featured.slug}`} className="relative flex min-h-[400px] overflow-hidden rounded-2xl max-[992px]:min-h-[350px]">
                {featured.image ? (
                  <Image src={featured.image} alt={featured.title} fill className="absolute inset-0 z-1 object-cover" />
                ) : (
                  <div className="absolute inset-0 z-1 bg-ink/10" />
                )}
                <div className="relative z-3 mt-auto w-full border-t border-white/10 bg-[rgba(40,30,25,0.45)] p-[30px] text-white shadow-[0_-10px_30px_rgba(0,0,0,0.1)] backdrop-blur-lg">
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-[20px] bg-white px-3 py-1.5 text-[0.75rem] font-medium text-[#111111]">
                    <span className="h-2 w-2 rounded-full bg-[#d35400]"></span> {featured.category}
                  </span>
                  <h3 className="mb-3 text-[1.8rem] leading-[1.3] font-medium text-white max-[640px]:text-[1.4rem]">
                    {featured.title}
                  </h3>
                  <div className="text-[0.75rem] text-white/80">{featured.date} • {featured.readTime}</div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Latest Posts */}
          {latest.length > 0 && (
            <div className="flex flex-col">
              <h3 className="mb-5 text-[1.5rem] font-semibold text-[#111111]">Latest post</h3>
              <div className="flex flex-col gap-5">
                {latest.map((post) => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <Link href={`/journal/${post.slug}`} className="flex items-center gap-4">
                      {post.image ? (
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image src={post.image} alt={post.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-ink/10" />
                      )}
                      <div className="flex flex-col gap-1.5">
                        <h4 className="m-0 text-[0.95rem] leading-[1.4] font-medium text-[#222222]">
                          {post.title}
                        </h4>
                        <div className="text-[0.75rem] text-[#777777]">{post.date} • {post.readTime}</div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default Blogs;
