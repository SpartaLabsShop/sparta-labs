"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const slideImages = [
  {
    src: "/assets/scientist_lab.png",
    alt: "Scientist working in lab",
    title: "Trust, Transparency, Results",
    description:
      "At Sparta, we are dedicated to pushing the boundaries of peptide science. Our lab ensures every compound meets the absolute highest standards.",
  },
  {
    src: "/assets/microscope_lab.png",
    alt: "Modern microscope in lab",
    title: "Cutting-Edge Analysis",
    description:
      "We utilize advanced HPLC and Mass Spectrometry to verify the molecular integrity and purity of every single batch we produce.",
  },
  {
    src: "/assets/vial_lab.png",
    alt: "Scientist holding vial",
    title: "99.1%+ Verified Purity",
    description:
      "We don't rely on manufacturer claims. Independent, third-party testing guarantees you receive only the purest research materials.",
  },
];

const AboutUs = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % slideImages.length);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.section
      className="overflow-hidden bg-white py-20 text-ink md:py-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto flex max-w-[1700px] flex-col gap-12 px-8 md:gap-24 max-[768px]:px-4 max-[480px]:px-3">
        {/* Header Area */}
        <motion.div
          className="flex flex-col items-start gap-6 md:flex-row md:items-start md:justify-between md:gap-0"
          variants={itemVariants}
        >
          <div className="max-w-[900px]">
            <span className="mb-6 block text-[0.85rem] font-semibold tracking-[0.05em] text-accent uppercase">ABOUT US</span>
            <h2 className="m-0 text-[1.75rem] leading-[1.2] font-medium text-[#111111] uppercase min-[480px]:text-[2.25rem] md:text-[42px]">
              <span className="text-[#999999]">Welcome to</span> Sparta — your trusted source <br />
              for premium-quality, <span className="text-[#999999]">lab-tested research compounds.</span>
            </h2>
            <Link href="/about" className="mt-6 inline-flex items-center rounded bg-[#111111] px-6 py-3 text-[0.85rem] font-medium text-white transition-colors duration-200 hover:bg-black">
              Learn More About Us
            </Link>
          </div>
          <div className="hidden flex-shrink-0 pt-4 md:block">
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35 5C22.8 5 13 14.8 13 27C13 33.3 15.6 39 19.8 43.1C23.9 38.6 29.2 35 35 35C40.8 35 46.1 38.6 50.2 43.1C54.4 39 57 33.3 57 27C57 14.8 47.2 5 35 5Z" fill="url(#redGrad1)" />
              <path d="M35 65C47.2 65 57 55.2 57 43C57 36.7 54.4 31 50.2 26.9C46.1 31.4 40.8 35 35 35C29.2 35 23.9 31.4 19.8 26.9C15.6 31 13 36.7 13 43C13 55.2 22.8 65 35 65Z" fill="url(#redGrad2)" />
              <defs>
                <linearGradient id="redGrad1" x1="13" y1="5" x2="57" y2="43.1" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF3B3B" />
                  <stop offset="1" stopColor="#B30B11" />
                </linearGradient>
                <linearGradient id="redGrad2" x1="13" y1="65" x2="57" y2="26.9" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D31118" />
                  <stop offset="1" stopColor="#FF7A7A" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="flex items-end justify-between gap-8 max-[1024px]:flex-col max-[1024px]:items-start">
          <motion.div className="flex gap-4 pb-4 max-[768px]:mt-4 max-[768px]:self-center" variants={itemVariants}>
            <button
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#111111] bg-[#111111] text-white transition-all duration-300 hover:border-[#333333] hover:bg-[#333333]"
              onClick={handlePrev}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#111111] bg-[#111111] text-white transition-all duration-300 hover:border-[#333333] hover:bg-[#333333]"
              onClick={handleNext}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </motion.div>

          <div className="flex gap-6 max-[1024px]:w-full max-[1024px]:overflow-x-auto max-[1024px]:pb-4 max-[1024px]:snap-x max-[1024px]:snap-mandatory max-[768px]:flex-col max-[768px]:gap-8">
            {/* Scientist Image Card */}
            <motion.div
              className="relative h-[380px] w-[800px] overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.05)] max-[1024px]:flex-shrink-0 max-[1024px]:snap-start max-[768px]:h-auto max-[768px]:min-h-[380px] max-[768px]:w-full"
              variants={itemVariants}
            >
              {slideImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img.src}
                  alt={img.alt}
                  className={`absolute top-0 left-0 h-full w-full object-cover opacity-0 transition-opacity duration-[800ms] ease-in-out ${
                    idx === currentImageIndex ? "opacity-100" : ""
                  }`}
                />
              ))}
              <div className="absolute inset-0 flex flex-col justify-end bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_50%,rgba(0,0,0,0.6)_100%)] p-8">
                <div>
                  <h3 className="mb-2 text-[1.2rem] font-medium text-white">{slideImages[currentImageIndex].title}</h3>
                  <p className="mb-6 max-w-[600px] text-[0.95rem] leading-[1.5] text-white/85 max-[768px]:mb-4 max-[768px]:text-[0.85rem]">
                    {slideImages[currentImageIndex].description}
                  </p>
                  <div className="flex gap-2">
                    {slideImages.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-0.5 w-[30px] cursor-pointer rounded-[1px] bg-white/40 ${idx === currentImageIndex ? "bg-white" : ""}`}
                        onClick={() => setCurrentImageIndex(idx)}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* New Arrivals Card */}
            <motion.div
              className="relative h-[380px] w-[340px] overflow-hidden rounded-lg border border-line bg-transparent max-[1024px]:flex-shrink-0 max-[1024px]:snap-start max-[768px]:h-auto max-[768px]:min-h-[380px] max-[768px]:w-full"
              variants={itemVariants}
            >
              <img src="/assets/arrivals_bg.png" alt="Abstract arrivals background" className="absolute top-0 left-0 z-0 h-full w-full object-cover" />
              <div className="absolute inset-0 z-1 bg-[linear-gradient(135deg,rgba(0,0,0,0.6)_0%,rgba(211,17,24,0.3)_100%)]"></div>

              <div className="relative z-2 flex h-full flex-col p-8">
                <div>
                  <h3 className="m-0 text-[1.25rem] font-medium text-white">New arrivals</h3>
                </div>

                <div className="flex flex-grow items-center justify-center">
                  <div className="relative flex h-[100px] items-center justify-center">
                    <div className="relative z-1">
                      <svg width="60" height="68" viewBox="0 0 60 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 1L59 17.5V50.5L30 67L1 50.5V17.5L30 1Z" stroke="#EAEAEA" strokeWidth="1.5" />
                        <path d="M22 25C22 25 28 20 38 25C43 27.5 44 33 42 38C40 43 35 42 35 42C35 42 32 46 32 50C32 54 28 54 28 54" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M28 35C28 35 24 33 22 28C20.5 24 22 25 22 25" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="relative z-2 -ml-[15px] [filter:drop-shadow(-4px_0_10px_rgba(255,255,255,0.5))]">
                      <svg width="60" height="68" viewBox="0 0 60 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 1L59 17.5V50.5L30 67L1 50.5V17.5L30 1Z" stroke="#EAEAEA" strokeWidth="1.5" fill="#ffffff" />
                        <circle cx="30" cy="34" r="4" stroke="#111111" strokeWidth="2" />
                        <ellipse cx="30" cy="34" rx="14" ry="5" transform="rotate(30 30 34)" stroke="#111111" strokeWidth="1.5" />
                        <ellipse cx="30" cy="34" rx="14" ry="5" transform="rotate(-30 30 34)" stroke="#111111" strokeWidth="1.5" />
                        <ellipse cx="30" cy="34" rx="14" ry="5" transform="rotate(90 30 34)" stroke="#111111" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/journal" className="flex w-full items-center justify-between rounded-lg border border-white/30 bg-transparent px-4 py-3 text-[0.85rem] font-medium text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10">
                    <span>Read Research Peptides</span>
                    <span className="text-base font-normal">↗</span>
                  </Link>
                  <Link href="/shop" className="flex w-full items-center justify-between rounded-lg border border-white bg-white px-4 py-3 text-[0.85rem] font-medium text-[#111111] transition-all duration-300 hover:border-[#f0f0f0] hover:bg-[#f0f0f0]">
                    <span>Fat Loss Peptides</span>
                    <span className="text-base font-normal">↗</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutUs;
