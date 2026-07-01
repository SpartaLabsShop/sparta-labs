"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowUpRight } from "lucide-react";

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

const Hero = () => {
  return (
    <motion.section
      className="relative flex h-screen w-full overflow-hidden bg-black"
      id="shop"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
        <source
          src="https://res.cloudinary.com/dgrrovta3/video/upload/v1781585458/Firefly_animate_this_make_it_seamless_looped_and_muted_in_4k_62663_phhwmj.webm"
          type="video/webm"
        />
      </video>
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-end px-6 pb-16 text-center bg-gradient-to-t from-black/70 via-black/30 to-transparent backdrop-blur-[2px] md:justify-center md:pb-0 md:bg-[linear-gradient(to_right,rgba(255,255,255,0.1),transparent)] md:backdrop-blur-[12px] md:w-[60%] md:items-stretch md:px-0 md:pl-16 md:pr-8 md:text-left lg:w-[35%] lg:min-w-[550px] lg:pl-[calc(max(2rem,50vw-850px+2rem))]">
        <div className="flex max-w-[500px] flex-col items-center md:block">
          <motion.h1
            className="mb-6 text-[2.5rem] leading-[1.05] font-normal tracking-[-1.5px] text-white min-[480px]:text-[3rem] md:text-[4.5rem]"
            variants={itemVariants}
          >
            RESEARCH PEPTIDES
          </motion.h1>
          <motion.p
            className="mb-8 max-w-[480px] text-[1rem] leading-[1.6] font-light text-white/85 md:mb-12 md:text-[1.1rem]"
            variants={itemVariants}
          >
            Guided by scientific literature, deliberate sourcing,
            <br />
            and controlled operational standards.
          </motion.p>

          <motion.div className="mb-16 flex w-full flex-col items-center gap-4 md:w-auto md:flex-row" variants={itemVariants}>
            <Link href="/shop" className="w-full rounded px-7 py-3.5 text-sm font-medium tracking-[1px] uppercase transition-all duration-300 font-['Neue_Haas_Grotesk_Text',sans-serif] border border-white bg-white text-black shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:border-[#f5f5f5] hover:bg-[#f5f5f5] md:w-auto text-center">
              Shop Now
            </Link>
            <Link href="/journal" className="w-full rounded px-7 py-3.5 text-sm font-medium tracking-[1px] uppercase transition-all duration-300 font-['Neue_Haas_Grotesk_Text',sans-serif] border-2 border-white bg-transparent text-white hover:bg-white/10 md:w-auto text-center">
              Read Research Peptides
            </Link>
          </motion.div>
        </div>
      </div>

      <Link
        href="/military-discount"
        className="group absolute bottom-6 right-6 z-20 hidden w-[260px] flex-col overflow-hidden rounded-xl bg-[#f6f6f6] pt-8 pb-6 px-6 text-left shadow-2xl transition-transform duration-300 hover:-translate-y-1 sm:flex"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://res.cloudinary.com/denskvdyt/image/upload/v1782864394/military-discount-banner_minejn.webp')" }}
        />
        {/* Fade to a solid backdrop toward the bottom so the text stays legible */}
        <div className="absolute inset-0 z-[5] bg-gradient-to-b from-transparent via-[#f6f6f6]/80 to-[#f6f6f6]" />

        {/* Verified Discount notch */}
        <div className="absolute top-0 left-1/2 z-10 flex h-7 w-[170px] -translate-x-1/2 items-center justify-center bg-white [clip-path:polygon(0_0,100%_0,88%_100%,12%_100%)]">
          <span className="-mt-0.5 flex items-center gap-1 whitespace-nowrap text-[0.7rem] font-medium text-[#333333]">
            <Check size={12} strokeWidth={3} /> Verified Discount
          </span>
        </div>

        {/* Badge image */}
        <div className="relative z-10 mx-auto mb-4 mt-2 h-24 w-24 shrink-0">
          <Image
            src="https://res.cloudinary.com/denskvdyt/image/upload/v1782945873/military-badge_mtaehv.webp"
            alt="Military Badge"
            fill
            className="object-contain"
          />
        </div>

        <p className="relative z-10 mb-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-gray-400">
          Military Appreciation
        </p>
        <h3 className="relative z-10 mb-2 text-xl font-semibold text-ink">Military Discount</h3>
        <p className="relative z-10 pr-6 text-sm leading-snug text-gray-500">
          Exclusive savings for those who serve our country.
        </p>

        <div className="absolute bottom-5 right-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-ink transition-colors group-hover:bg-ink group-hover:text-white">
          <ArrowUpRight size={16} />
        </div>
      </Link>

    </motion.section>
  );
};

export default Hero;
