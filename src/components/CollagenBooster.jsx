"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Microscope, Snowflake, ShieldCheck, Dna } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const handVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 50, damping: 15, duration: 1.2 },
  },
};

const circleVariants = {
  hidden: { scale: 0.8, opacity: 0, x: "-50%" },
  visible: {
    scale: 1,
    opacity: 1,
    x: "-50%",
    transition: { duration: 1, ease: "easeOut" },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const bottomCenterVariants = {
  hidden: { opacity: 0, y: 30, x: "-50%" },
  visible: { opacity: 1, y: 0, x: "-50%", transition: { duration: 0.6, ease: "easeOut" } },
};

const FEATURE_BASE =
  "relative flex w-full flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] px-3 py-5 text-center max-[480px]:px-2 max-[480px]:py-4 min-[993px]:absolute min-[993px]:w-[280px] min-[993px]:flex-row min-[993px]:items-center min-[993px]:gap-[15px] min-[993px]:rounded-none min-[993px]:border-0 min-[993px]:bg-transparent min-[993px]:p-0";

const CollagenBooster = () => {
  const contentRef = useRef(null); // SVG parent — measure everything relative to this
  const circleRef = useRef(null);
  const tlRef = useRef(null);
  const blRef = useRef(null);
  const trRef = useRef(null);
  const brRef = useRef(null);
  const bcRef = useRef(null);

  const [lines, setLines] = useState([]);
  const [dotPositions, setDotPositions] = useState([]);

  const computeLines = useCallback(() => {
    if (window.innerWidth <= 992) {
      setLines([]);
      setDotPositions([]);
      return;
    }

    const content = contentRef.current;
    const circle = circleRef.current;
    if (!content || !circle) return;

    const base = content.getBoundingClientRect();
    const cRect = circle.getBoundingClientRect();

    // Circle center & radius in content-relative coords
    const cx = cRect.left - base.left + cRect.width / 2;
    const cy = cRect.top - base.top + cRect.height / 2;
    const r = cRect.width / 2;

    // Helper: point on circle at angle (deg, 0 = right, CCW)
    const ptOnCircle = (deg) => {
      const rad = (deg * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    // Dot angles: place them to match feature positions
    const dotAngles = {
      tl: -150, // top-left quadrant
      bl: 150, // bottom-left quadrant
      tr: -30, // top-right quadrant
      br: 30, // bottom-right quadrant
      bc: 90, // bottom
      tc: -90, // top
    };

    const dots = {};
    Object.entries(dotAngles).forEach(([k, a]) => {
      dots[k] = ptOnCircle(a);
    });

    // Store all visible dots
    setDotPositions(Object.values(dots));

    // Build L-shaped SVG paths from feature edge → dot on circle
    const featureDefs = [
      { ref: tlRef, dot: dots.tl, side: "left" },
      { ref: blRef, dot: dots.bl, side: "left" },
      { ref: trRef, dot: dots.tr, side: "right" },
      { ref: brRef, dot: dots.br, side: "right" },
      { ref: bcRef, dot: dots.bc, side: "bottom" },
    ];

    const newLines = [];
    featureDefs.forEach(({ ref, dot, side }) => {
      if (!ref.current) return;
      const fr = ref.current.getBoundingClientRect();
      // Convert to content-relative coords
      const left = fr.left - base.left;
      const top = fr.top - base.top;
      const right = fr.right - base.left;
      const midY = top + fr.height / 2;

      let d;
      const cornerR = 8;

      if (side === "left") {
        const sx = right;
        const sy = midY;
        const tx = dot.x;
        const ty = dot.y;
        if (sy < ty) {
          d = `M ${sx} ${sy} H ${tx - cornerR} Q ${tx} ${sy} ${tx} ${sy + cornerR} V ${ty}`;
        } else {
          d = `M ${sx} ${sy} H ${tx - cornerR} Q ${tx} ${sy} ${tx} ${sy - cornerR} V ${ty}`;
        }
      } else if (side === "right") {
        const sx = left;
        const sy = midY;
        const tx = dot.x;
        const ty = dot.y;
        if (sy < ty) {
          d = `M ${sx} ${sy} H ${tx + cornerR} Q ${tx} ${sy} ${tx} ${sy + cornerR} V ${ty}`;
        } else {
          d = `M ${sx} ${sy} H ${tx + cornerR} Q ${tx} ${sy} ${tx} ${sy - cornerR} V ${ty}`;
        }
      } else {
        const sx = left + fr.width / 2;
        const sy = top;
        d = `M ${sx} ${sy} V ${dot.y}`;
      }

      newLines.push(d);
    });

    setLines(newLines);
  }, []);

  useEffect(() => {
    const t = setTimeout(computeLines, 1200);
    window.addEventListener("resize", computeLines);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", computeLines);
    };
  }, [computeLines]);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_center,#f0143a_0%,#d90429_45%,#a6001c_100%)] px-4 pt-12 pb-12 text-center text-white min-[601px]:px-5 min-[601px]:pt-[60px] min-[601px]:pb-[60px] min-[993px]:pt-20 min-[993px]:pb-[120px]">
      <div className="mx-auto max-w-[1700px] px-8 max-[768px]:px-4 max-[480px]:px-3">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-[15px] text-[1.7rem] leading-[1.2] font-semibold tracking-[1px] text-white uppercase min-[601px]:text-[2rem] min-[993px]:text-[2.6rem] min-[993px]:tracking-[2px]">
            THE SPARTA DIFFERENCE
          </h2>
          <div className="mx-auto mb-5 h-0.5 w-[50px] bg-white"></div>
          <p className="mx-auto mb-6 max-w-[560px] text-[0.95rem] leading-[1.7] font-normal text-white/85 min-[993px]:text-base">
            Each batch is tested by an independent, accredited laboratory to confirm purity, identity, and
            composition. Results are documented and available by batch.
          </p>
          <Link href="/certificates" className="group inline-flex items-center gap-2 rounded border-[1.5px] border-white/85 bg-transparent px-7 py-3 text-[0.9rem] font-medium tracking-[0.5px] text-white transition-[background,border-color] duration-200 hover:border-white hover:bg-white/[0.12]">
            <span>View COA</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* content ref is what the SVG is measured against */}
        <motion.div
          className="relative mx-auto mt-5 flex h-auto w-full max-w-[1700px] flex-col items-center gap-[30px] min-[993px]:mt-0 min-[993px]:block min-[993px]:h-[600px]"
          ref={contentRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          onAnimationComplete={computeLines}
        >
          {/* SVG overlay — MUST be direct child of collagen-content */}
          <svg
            className="max-[992px]:hidden"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 6,
              overflow: "visible",
            }}
          >
            {lines.map((d, i) => (
              <path key={i} d={d} stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            ))}
            {dotPositions.map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="12" fill="rgba(255,255,255,0.10)" />
                <circle cx={pt.x} cy={pt.y} r="7" fill="rgba(255,255,255,0.30)" />
                <circle cx={pt.x} cy={pt.y} r="4" fill="white" />
              </g>
            ))}
          </svg>

          {/* Circle ring */}
          <motion.div
            className="hidden min-[993px]:absolute min-[993px]:top-[calc(45%-250px)] min-[993px]:left-1/2 min-[993px]:z-1 min-[993px]:block min-[993px]:h-[500px] min-[993px]:w-[500px] min-[993px]:rounded-full min-[993px]:border-[1.5px] min-[993px]:border-white/80"
            ref={circleRef}
            variants={circleVariants}
          />

          {/* Central Image */}
          <motion.div
            className="relative order-2 mx-auto flex w-full max-w-[600px] justify-center max-[600px]:max-w-[380px] min-[993px]:absolute min-[993px]:bottom-[-120px] min-[993px]:left-[calc(50%-550px)] min-[993px]:z-2 min-[993px]:order-none min-[993px]:mx-0 min-[993px]:block min-[993px]:w-[1100px] min-[993px]:max-w-none min-[993px]:pointer-events-none"
            variants={handVariants}
          >
            <img
              src="/hand-holding-vial.png"
              alt="Hand holding vial"
              className="block h-auto w-full object-contain [filter:drop-shadow(0_15px_25px_rgba(0,0,0,0.15))] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_60%,rgba(0,0,0,0)_100%)] min-[993px]:[mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_75%,rgba(0,0,0,0)_100%)]"
            />
          </motion.div>

          {/* Features */}
          <div className="relative order-1 grid w-full grid-cols-2 gap-3 p-0 min-[601px]:gap-5 min-[993px]:absolute min-[993px]:inset-0 min-[993px]:z-3 min-[993px]:order-none min-[993px]:block min-[993px]:h-full min-[993px]:w-full">
            {/* Top Left */}
            <motion.div
              className={`${FEATURE_BASE} min-[993px]:top-[calc(45%-180px)] min-[993px]:right-[calc(50%+255px)] min-[993px]:!flex-row-reverse min-[993px]:text-right`}
              ref={tlRef}
              variants={featureVariants}
            >
              <div className="relative flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-full bg-white text-[#D90429] shadow-[0_4px_15px_rgba(0,0,0,0.15)] min-[480px]:h-[50px] min-[480px]:w-[50px] min-[601px]:h-[60px] min-[601px]:w-[60px]">
                <Microscope color="#d31118" strokeWidth={1.5} size={28} />
              </div>
              <div>
                <h3 className="mb-[5px] text-[0.75rem] leading-[1.3] font-semibold tracking-[0.5px] text-white uppercase min-[480px]:text-[0.85rem] min-[601px]:text-[0.95rem]">
                  INDEPENDENTLY
                  <br />
                  LAB TESTED
                </h3>
                <p className="m-0 text-[0.7rem] leading-[1.4] text-white/85 min-[480px]:text-[0.78rem] min-[601px]:text-[0.85rem]">
                  Verified purity &<br />
                  composition.
                </p>
              </div>
            </motion.div>

            {/* Bottom Left */}
            <motion.div
              className={`${FEATURE_BASE} min-[993px]:top-[calc(45%+95px)] min-[993px]:right-[calc(50%+255px)] min-[993px]:!flex-row-reverse min-[993px]:text-right`}
              ref={blRef}
              variants={featureVariants}
            >
              <div className="relative flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-full bg-white text-[#D90429] shadow-[0_4px_15px_rgba(0,0,0,0.15)] min-[480px]:h-[50px] min-[480px]:w-[50px] min-[601px]:h-[60px] min-[601px]:w-[60px]">
                <svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 30, height: 20 }}>
                  <rect width="60" height="40" fill="#fff" rx="2" />
                  <path d="M0 6H60M0 14H60M0 22H60M0 30H60" stroke="#d31118" strokeWidth="4" />
                  <rect width="26" height="24" fill="#002868" rx="2" />
                  <path
                    d="M4 4h2v2H4zm6 0h2v2h-2zm6 0h2v2h-2zm6 0h2v2h-2zM4 10h2v2H4zm6 0h2v2h-2zm6 0h2v2h-2zm6 0h2v2h-2zM4 16h2v2H4zm6 0h2v2h-2zm6 0h2v2h-2zm6 0h2v2h-2z"
                    fill="#fff"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-[5px] text-[0.75rem] leading-[1.3] font-semibold tracking-[0.5px] text-white uppercase min-[480px]:text-[0.85rem] min-[601px]:text-[0.95rem]">
                  MADE IN THE
                  <br />
                  United States
                </h3>
                <p className="m-0 text-[0.7rem] leading-[1.4] text-white/85 min-[480px]:text-[0.78rem] min-[601px]:text-[0.85rem]">
                  Manufactured and
                  <br />
                  handled under
                  <br />
                  controlled standards.
                </p>
              </div>
            </motion.div>

            {/* Top Right */}
            <motion.div
              className={`${FEATURE_BASE} min-[993px]:top-[calc(45%-180px)] min-[993px]:left-[calc(50%+255px)] min-[993px]:text-left`}
              ref={trRef}
              variants={featureVariants}
            >
              <div className="relative flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-full bg-white text-[#D90429] shadow-[0_4px_15px_rgba(0,0,0,0.15)] min-[480px]:h-[50px] min-[480px]:w-[50px] min-[601px]:h-[60px] min-[601px]:w-[60px]">
                <Dna color="#d31118" strokeWidth={1.5} size={28} />
              </div>
              <div>
                <h3 className="mb-[5px] text-[0.75rem] leading-[1.3] font-semibold tracking-[0.5px] text-white uppercase min-[480px]:text-[0.85rem] min-[601px]:text-[0.95rem]">
                  ADVANCED PEPTIDE
                  <br />
                  SYNTHESIS
                </h3>
                <p className="m-0 text-[0.7rem] leading-[1.4] text-white/85 min-[480px]:text-[0.78rem] min-[601px]:text-[0.85rem]">
                  Pioneering peptide
                  <br />
                  research.
                </p>
              </div>
            </motion.div>

            {/* Bottom Right */}
            <motion.div
              className={`${FEATURE_BASE} min-[993px]:top-[calc(45%+95px)] min-[993px]:left-[calc(50%+255px)] min-[993px]:text-left`}
              ref={brRef}
              variants={featureVariants}
            >
              <div className="relative flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-full bg-white text-[#D90429] shadow-[0_4px_15px_rgba(0,0,0,0.15)] min-[480px]:h-[50px] min-[480px]:w-[50px] min-[601px]:h-[60px] min-[601px]:w-[60px]">
                <Snowflake color="#d31118" strokeWidth={1.5} size={28} />
              </div>
              <div>
                <h3 className="mb-[5px] text-[0.75rem] leading-[1.3] font-semibold tracking-[0.5px] text-white uppercase min-[480px]:text-[0.85rem] min-[601px]:text-[0.95rem]">
                  COLD CHAIN
                  <br />
                  LOGISTICS
                </h3>
                <p className="m-0 text-[0.7rem] leading-[1.4] text-white/85 min-[480px]:text-[0.78rem] min-[601px]:text-[0.85rem]">
                  Stored and shipped
                  <br />
                  under strict
                  <br />
                  temperature control.
                </p>
              </div>
            </motion.div>

            {/* Bottom Center */}
            <motion.div
              className={`${FEATURE_BASE} max-[992px]:col-span-2 min-[993px]:top-[calc(45%+295px)] min-[993px]:left-1/2 min-[993px]:w-max min-[993px]:flex-col min-[993px]:text-center`}
              ref={bcRef}
              variants={bottomCenterVariants}
            >
              <div className="relative flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-full bg-white text-[#D90429] shadow-[0_4px_15px_rgba(0,0,0,0.15)] min-[480px]:h-[50px] min-[480px]:w-[50px] min-[601px]:h-[60px] min-[601px]:w-[60px]">
                <ShieldCheck color="#d31118" strokeWidth={1.5} size={28} />
              </div>
              <div>
                <h3 className="mb-[5px] text-[0.75rem] leading-[1.3] font-semibold tracking-[0.5px] text-white uppercase min-[480px]:text-[0.85rem] min-[601px]:text-[0.95rem]">FULL TRACEABILITY</h3>
                <p className="m-0 text-[0.7rem] leading-[1.4] text-white/85 min-[480px]:text-[0.78rem] min-[601px]:text-[0.85rem]">
                  Batch-specific sourcing
                  <br />
                  and documentation.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CollagenBooster;
