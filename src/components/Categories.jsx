"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dna, Activity, Brain, FlaskConical, TrendingUp, Scale, Target, BatteryCharging } from "lucide-react";

const categories = [
  { id: 1, title: "Bioregulators", description: "Short-chain peptide bioregulators. Research-grade purity, lot-specific COA.", image: "/categories/light_bioregulators.png", icon: <Dna size={20} /> },
  { id: 2, title: "Cellular Health", description: "Compounds studied for cellular repair and longevity applications.", image: "/categories/light_cellular_health.png", icon: <Activity size={20} /> },
  { id: 3, title: "Cognitive Function", description: "Peptides associated with neurological and cognitive function research.", image: "/categories/light_cognitive.png", icon: <Brain size={20} /> },
  { id: 4, title: "Essentials", description: "Core research compounds — the foundational stack for any peptide lab.", image: "/categories/light_essentials.png", icon: <FlaskConical size={20} /> },
  { id: 5, title: "Growth Factor", description: "Growth factor peptides for tissue and recovery research. LC-MS verified.", image: "/categories/light_growth.png", icon: <TrendingUp size={20} /> },
  { id: 6, title: "Metabolic", description: "GLP-1 and metabolic peptides for body composition and metabolic research.", image: "/categories/light_metabolic.png", icon: <Scale size={20} /> },
  { id: 7, title: "Receptor Agonist", description: "Receptor-targeting peptides for advanced research protocols.", image: "/categories/light_receptor.png", icon: <Target size={20} /> },
  { id: 8, title: "Recovery", description: "Advanced peptides formulated to support physical recovery and tissue repair.", image: "/categories/light_recovery.png", icon: <BatteryCharging size={20} /> },
];

const Categories = () => {
  const [activeId, setActiveId] = useState(1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      className="overflow-hidden bg-white py-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto flex max-w-[1700px] flex-col items-center px-8">
        <motion.div className="mb-16 max-w-[600px] text-center" variants={itemVariants}>
          <h2 className="mb-4 text-[2.5rem] font-semibold tracking-[-0.02em] text-[#111111] uppercase font-[var(--font-inter)]">
            <span className="font-normal text-[#888888] line-through">Discover</span> a few more categories.
          </h2>
          <p className="text-base leading-[1.6] text-[#666666]">
            There&apos;s even more to explore. We bring you a collection of advanced compounds designed to refine and
            elevate your research.
          </p>
        </motion.div>

        <motion.div
          className="flex h-[500px] w-full justify-center gap-3 max-[1024px]:h-[400px] max-[1024px]:gap-2 max-[768px]:h-[650px] max-[768px]:w-full max-[768px]:flex-col"
          variants={itemVariants}
        >
          {categories.map((category) => {
            const isActive = activeId === category.id;

            return (
              <motion.div
                key={category.id}
                className="relative h-full cursor-pointer overflow-hidden rounded-[20px] bg-[#f5f5f5] shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-[768px]:w-full"
                onClick={() => setActiveId(category.id)}
                animate={{
                  flex: isActive ? 5 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8,
                }}
              >
                <div className="absolute inset-0 z-1 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${category.image})` }}>
                  <div
                    className={`absolute inset-0 transition-[background] duration-[400ms] ${
                      isActive
                        ? "bg-[linear-gradient(to_top,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.6)_40%,transparent_100%)]"
                        : "bg-white/50 [backdrop-filter:grayscale(100%)_opacity(0.2)]"
                    }`}
                  ></div>
                </div>

                <div className="relative z-2 h-full w-full pointer-events-none">
                  {/* Vertical Title (visible when inactive) */}
                  <motion.div
                    className="absolute top-8 left-1/2 origin-top-left rotate-90 -translate-y-1/2 whitespace-nowrap text-[1.5rem] font-medium tracking-[0.05em] text-[#111111] font-['Neue_Haas_Grotesk_Display',sans-serif] max-[768px]:top-1/2 max-[768px]:left-6 max-[768px]:origin-left max-[768px]:rotate-0"
                    animate={{ opacity: isActive ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {category.title}
                  </motion.div>

                  {/* Active Content (visible when active) */}
                  <motion.div
                    className="pointer-events-auto absolute bottom-0 left-0 flex w-full flex-col justify-end p-8"
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: isActive ? 0.2 : 0 }}
                  >
                    <h3 className="mb-2 text-[1.5rem] font-semibold text-[#111111] font-['Neue_Haas_Grotesk_Display',sans-serif]">{category.title}</h3>
                    <p className="mb-6 max-w-[90%] text-[0.95rem] leading-[1.5] text-[#444444]">{category.description}</p>
                    <button className="inline-flex w-fit items-center gap-3 rounded bg-[#111111] px-6 py-3 text-[0.85rem] font-medium text-white transition-colors duration-200 hover:bg-black">
                      <span className="flex items-center justify-center">{category.icon}</span> Explore category
                    </button>
                  </motion.div>

                  {/* Bottom Icon (always visible, but positioned differently depending on state) */}
                  <div
                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-[#111111] transition-opacity duration-300 max-[768px]:bottom-1/2 max-[768px]:left-auto max-[768px]:right-6 max-[768px]:translate-x-0 max-[768px]:translate-y-1/2 ${
                      isActive ? "opacity-0" : ""
                    }`}
                  >
                    {category.icon}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Categories;
