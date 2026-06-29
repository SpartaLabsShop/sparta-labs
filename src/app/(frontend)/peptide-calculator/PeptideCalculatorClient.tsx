'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { ArrowLeft, ArrowRight, ShieldCheck, Info, Beaker, Thermometer, Syringe, Droplets, FlaskConical, AlertTriangle, BookOpen, Calculator, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { FaqItem } from '@/components/shared/FaqCarousel'
import FAQ from '@/components/FAQ'
import { CTASection } from '@/components/shared/CTASection'

const CALCULATOR_FAQS: FaqItem[] = [
  {
    question: "How do I calculate how many IU to draw for my peptide dose?",
    answer: "Use the three-step formula built into the calculator above: (1) Divide your peptide amount in mcg by the BAC water volume in ml to get the concentration in mcg/ml. (2) Divide your target dose in mcg by that concentration to get the draw volume in ml. (3) Multiply the draw volume by 100 to convert to IU on a U-100 insulin syringe. Example: a 250 mcg dose from a 5mg vial with 2ml BAC water = 10 IU draw."
  },
  {
    question: "How much bacteriostatic water should I add to a 5mg peptide vial?",
    answer: "The most common research choices are 1ml, 2ml, or 3ml. Adding 2ml to a 5mg vial produces a standard 2,500 mcg/ml concentration — giving you 10 IU per 250 mcg dose on a U-100 syringe. More water lowers concentration (larger, easier-to-read draws); less water raises concentration (smaller, more precise draws). Use the calculator above to instantly see how any water volume affects your dose IU."
  },
  {
    question: "How long can reconstituted peptides be stored in the refrigerator?",
    answer: "Most reconstituted research peptides remain stable for 2 to 4 weeks when stored upright in a refrigerator at 2–8°C. Bacteriostatic water (containing 0.9% benzyl alcohol) significantly extends stability by inhibiting microbial growth. Never freeze a reconstituted solution; instead, store unreconstituted lyophilized peptides in a freezer at −20°C until you are ready to reconstitute."
  },
  {
    question: "What is the difference between mcg and mg in peptide dosing?",
    answer: "1 milligram (mg) equals 1,000 micrograms (mcg). Research peptide vials are typically labeled in mg (e.g., 5mg) while individual research doses are often specified in mcg (e.g., 250 mcg). To convert: divide mg by 1,000 to get mcg. The calculator above handles this conversion automatically when you use the mg/mcg toggle — enter whichever unit your label shows."
  },
  {
    question: "Should I shake or swirl a peptide vial after adding bacteriostatic water?",
    answer: "Always swirl gently — never shake. Vigorous shaking forces air into the solution and can denature (structurally unfold) the peptide chains, compromising the compound. Instead, inject BAC water slowly along the inner glass wall, then gently roll or swirl the vial until the lyophilized powder fully dissolves. Stubborn powder may need 1–2 minutes of gentle rotation."
  },
  {
    question: "Can I use sterile water instead of bacteriostatic water?",
    answer: "Sterile water is technically usable for single-use reconstitution in laboratory research, but bacteriostatic water (BAC water) is the research standard for multi-use vials. BAC water contains 0.9% benzyl alcohol, which inhibits bacterial and fungal growth between extractions, significantly extending the stable research window of the reconstituted solution. For multi-draw vials, BAC water is always the preferred diluent."
  },
  {
    question: "What does the Required Draw (IU) output mean?",
    answer: "The Required Draw (IU) is the exact number on the tick-mark scale of your U-100 insulin syringe to pull the plunger back to. On any U-100 syringe, the scale runs from 0 to 100 IU, where 100 IU equals 1 ml of total volume. If the calculator shows 10 IU, draw the plunger to the '10' mark on your syringe. This is your entire dose volume for that administration in a research protocol."
  }
]

type SyringeVolume = 0.3 | 0.5 | 1.0;

export default function PeptideCalculatorPage() {
  // --- State ---
  const [peptideAmount, setPeptideAmount] = useState('5')
  
  const [waterMl, setWaterMl] = useState('2')
  
  const [desiredDose, setDesiredDose] = useState('250')

  const [syringeVolume, setSyringeVolume] = useState<SyringeVolume>(1.0)

  // --- Math Logic ---
  const vAmt = parseFloat(peptideAmount) || 0
  const wMl = parseFloat(waterMl) || 0
  const dAmt = parseFloat(desiredDose) || 0

  const totalPeptideMcg = vAmt * 1000
  const targetDoseMcg = dAmt

  let isValid = totalPeptideMcg > 0 && wMl > 0 && targetDoseMcg > 0
  let concentrationStr = '—'
  let volumePerDoseStr = '—'
  let tickMarksStr = '0'
  let dosesPerVialStr = '—'
  let errorMsg = ''
  
  let fillPercentage = 0
  const maxUnits = syringeVolume * 100

  if (isValid) {
    const concentration = totalPeptideMcg / wMl
    concentrationStr = `${concentration.toLocaleString(undefined, { maximumFractionDigits: 1 })} mcg/ml`
    
    const volumePerDose = targetDoseMcg / concentration
    volumePerDoseStr = `${volumePerDose.toLocaleString(undefined, { maximumFractionDigits: 3 })} ml`
    
    const tickMarks = volumePerDose * 100
    tickMarksStr = tickMarks.toLocaleString(undefined, { maximumFractionDigits: 1 })
    
    const dosesPerVial = wMl / volumePerDose
    dosesPerVialStr = dosesPerVial.toLocaleString(undefined, { maximumFractionDigits: 1 })

    if (volumePerDose > syringeVolume) {
      errorMsg = `Dose volume (${volumePerDose.toFixed(2)}ml) exceeds syringe capacity (${syringeVolume}ml).`
      tickMarksStr = 'ERR'
      fillPercentage = 100
    } else {
      fillPercentage = (tickMarks / maxUnits) * 100
    }
  }

  const getSyringeTicks = () => {
    const steps = syringeVolume === 1.0 ? 10 : 5;
    const ticks = [];
    for (let i = maxUnits; i >= 0; i -= steps) {
      ticks.push(i);
    }
    return ticks;
  }

  return (
    <main className="bg-white min-h-screen">
      
      {/* ============================================
          SECTION 1: CALCULATOR (REDESIGNED)
          ============================================ */}
      <section 
        className="w-full min-h-screen text-white relative flex flex-col items-center justify-center pt-24 lg:pt-32 pb-16 px-4 md:px-8 lg:px-10 overflow-hidden font-sans bg-cover bg-top lg:bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/denskvdyt/image/upload/v1782105781/peptide-calculator-image_hurk1s.webp')" }}
      >
        
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />

        <div className="w-full relative z-10 flex flex-col gap-10">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 w-full">
            <div className="flex flex-col gap-3 max-w-2xl">
              <span className="text-red-500 text-[11px] font-bold tracking-[0.15em] uppercase">Tools & Resources</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight uppercase">
                Research Dosing <br className="hidden sm:block" /> Calculator
              </h1>
              <p className="text-gray-400 text-sm max-w-lg mt-2 leading-relaxed">
                Precision peptide reconstitution and dosing calculations for laboratory research applications.
              </p>
            </div>

            {/* Disclaimer Box */}
            <div className="flex items-center gap-4 bg-[#111111]/15 backdrop-blur-md border border-white/5 rounded-2xl p-5 max-w-sm mt-0 lg:mt-6 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-[#dca54c] shrink-0 opacity-70" />
              <p className="text-[#a0a0a0] text-[11px] leading-relaxed">
                <strong className="text-gray-300 uppercase font-bold block mb-1 tracking-wider text-[10px]">For research use only</strong>
                Not for human consumption. <br/> For laboratory research applications only.
              </p>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6 w-full">
            
            {/* Left Column: Input Parameters */}
            <div className="flex flex-col bg-[#111111]/20 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-red-600 text-[11px] font-bold tracking-[0.15em] uppercase">Input Parameters</h2>
                  <button 
                    onClick={() => {
                      setPeptideAmount('')
                      setWaterMl('')
                      setDesiredDose('')
                      setSyringeVolume(1.0)
                    }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-[11px] uppercase tracking-wider transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Clear all
                  </button>
                </div>

                <div className="flex flex-col gap-8 flex-1">
                  
                  {/* Peptide Strength */}
                  <div className="flex flex-col gap-3">
                    <label className="text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-1.5 font-bold">Peptide Strength <Info className="w-3 h-3 opacity-50" /></label>
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 transition-colors focus-within:border-red-500/50">
                      <input 
                        type="number"
                        min="0"
                        step="any"
                        value={peptideAmount}
                        onChange={e => setPeptideAmount(e.target.value)}
                        className="bg-transparent text-white text-xl font-bold w-full focus:outline-none placeholder-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                      <span className="text-gray-500 text-sm font-bold uppercase shrink-0 tracking-widest">MG</span>
                    </div>
                  </div>

                  {/* Bacteriostatic Water Volume */}
                  <div className="flex flex-col gap-3">
                    <label className="text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-1.5 font-bold">Bacteriostatic Water Volume <Info className="w-3 h-3 opacity-50" /></label>
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 transition-colors focus-within:border-red-500/50">
                      <input 
                        type="number"
                        min="0"
                        step="any"
                        value={waterMl}
                        onChange={e => setWaterMl(e.target.value)}
                        className="bg-transparent text-white text-xl font-bold w-full focus:outline-none placeholder-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                      <span className="text-gray-500 text-sm font-bold uppercase shrink-0 tracking-widest">ML</span>
                    </div>
                  </div>

                  {/* Target Dose */}
                  <div className="flex flex-col gap-3">
                    <label className="text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-1.5 font-bold">Target Dose Per Administration <Info className="w-3 h-3 opacity-50" /></label>
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 transition-colors focus-within:border-red-500/50">
                      <input 
                        type="number"
                        min="0"
                        step="any"
                        value={desiredDose}
                        onChange={e => setDesiredDose(e.target.value)}
                        className="bg-transparent text-white text-xl font-bold w-full focus:outline-none placeholder-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                      <span className="text-gray-500 text-sm font-bold uppercase shrink-0 tracking-widest">MCG</span>
                    </div>
                  </div>

                  {/* Syringe Capacity */}
                  <div className="flex flex-col gap-4 mt-2">
                    <label className="text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-1.5 font-bold">Syringe Capacity <Info className="w-3 h-3 opacity-50" /></label>
                    <div className="flex items-center justify-between gap-4">
                      {[
                        {label: '30 IU', v: 0.3},
                        {label: '50 IU', v: 0.5},
                        {label: '100 IU', v: 1.0},
                      ].map(opt => (
                        <button type="button" key={opt.v} onClick={() => setSyringeVolume(opt.v as SyringeVolume)} className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${syringeVolume === opt.v ? 'border-red-600 bg-transparent' : 'border-[#444] bg-[#111] group-hover:border-gray-500'}`}>
                            {syringeVolume === opt.v && <div className="w-2 h-2 rounded-full bg-red-600" />}
                          </div>
                          <span className={`text-sm ${syringeVolume === opt.v ? 'text-white font-bold tracking-wider' : 'text-gray-500 font-medium tracking-wider group-hover:text-gray-300'}`}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Right Column: Results */}
            <div className="flex flex-col lg:flex-row gap-8 bg-[#111111]/20 backdrop-blur-xl border border-white/5 rounded-2xl p-8 lg:p-10 relative overflow-hidden shadow-2xl">
              
              {/* Results Text/Graphs Area */}
              <div className="flex-1 flex flex-col justify-between z-10 w-full">
                
                {/* Required Draw */}
                <div className="flex flex-col mb-12">
                  <h3 className="text-gray-400 text-[11px] font-bold tracking-widest uppercase mb-4">Required Draw (IU)</h3>
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className={`font-sans leading-none tracking-tighter ${errorMsg ? 'text-6xl text-red-500' : 'text-8xl lg:text-9xl text-white'}`}>
                      {tickMarksStr}
                    </span>
                    {!errorMsg && <span className="text-3xl lg:text-5xl text-gray-600 italic font-sans">IU</span>}
                  </div>
                  
                  {/* Slider Visualizer (0 to 100 IU) */}
                  <div className="w-full relative h-1.5 bg-[#222] rounded-full mt-2 flex items-center">
                    <div 
                      className="absolute left-0 h-1.5 bg-red-600 rounded-l-full shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-500" 
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }} 
                    />
                    {/* Thumb */}
                    <div 
                      className="absolute w-3.5 h-3.5 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,1)] -ml-[7px] transition-all duration-500"
                      style={{ left: `${Math.min(fillPercentage, 100)}%` }}
                    />
                    {/* Ticks underneath */}
                    <div className="absolute top-6 left-0 w-full flex justify-between text-[#555] text-[10px] font-mono tracking-wider">
                      {[...Array(11)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-px h-1.5 bg-[#333] absolute -top-4" />
                          {i === 0 && '0 IU'}
                          {i === 10 && '100 IU'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dosing Overview */}
                <div className="flex flex-col mb-12 mt-8">
                  <h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-4">Dosing Overview</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#111111]/20 backdrop-blur-lg border border-white/5 rounded-xl p-5 lg:p-6 flex flex-col justify-between gap-5 transition-colors hover:border-red-500/30">
                      <div className="flex items-center gap-3 text-gray-400">
                        <Thermometer className="w-4 h-4 text-red-600" />
                        <span className="text-[9px] font-bold uppercase tracking-widest leading-tight">Solution <br/> Concentration</span>
                      </div>
                      <div>
                        <div className="text-white text-3xl font-sans tracking-tight">{concentrationStr.split(' ')[0]}</div>
                        <div className="text-gray-500 text-[11px] font-mono mt-1 tracking-widest">mcg/ml</div>
                      </div>
                    </div>
                    <div className="bg-[#111111]/20 backdrop-blur-lg border border-white/5 rounded-xl p-5 lg:p-6 flex flex-col justify-between gap-5 transition-colors hover:border-red-500/30">
                      <div className="flex items-center gap-3 text-gray-400">
                        <Droplets className="w-4 h-4 text-red-600" />
                        <span className="text-[9px] font-bold uppercase tracking-widest leading-tight">Draw <br/> Volume</span>
                      </div>
                      <div>
                        <div className="text-white text-3xl font-sans tracking-tight">{volumePerDoseStr.split(' ')[0]}</div>
                        <div className="text-gray-500 text-[11px] font-mono mt-1 tracking-widest">ml</div>
                      </div>
                    </div>
                    <div className="bg-[#111111]/20 backdrop-blur-lg border border-white/5 rounded-xl p-5 lg:p-6 flex flex-col justify-between gap-5 transition-colors hover:border-red-500/30">
                      <div className="flex items-center gap-3 text-gray-400">
                        <FlaskConical className="w-4 h-4 text-red-600" />
                        <span className="text-[9px] font-bold uppercase tracking-widest leading-tight">Total Doses <br/> Per Vial</span>
                      </div>
                      <div>
                        <div className="text-white text-3xl font-sans tracking-tight">{dosesPerVialStr}</div>
                        <div className="text-gray-500 text-[11px] font-mono mt-1 tracking-widest">doses</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dosing Visualization (Desktop) */}
                <div className="hidden lg:flex flex-col mt-auto">
                  <h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-5">Dosing Visualization</h3>
                  <div className="flex justify-between items-end mb-3">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mb-1">Target Dose</span>
                      <span className="text-red-500 font-bold text-base tracking-wider">{targetDoseMcg} mcg</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mb-1">Required Draw</span>
                      <span className="text-red-500 font-bold text-base tracking-wider">{tickMarksStr} IU</span>
                    </div>
                  </div>
                  {/* Visualizer Slider */}
                  <div className="w-full h-1.5 bg-[#222] rounded-full relative flex items-center">
                     <div 
                      className="absolute left-0 h-1.5 bg-red-600 rounded-l-full shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-500" 
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }} 
                    />
                    <div 
                      className="absolute w-2.5 h-2.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)] -ml-[5px] transition-all duration-500"
                      style={{ left: `${Math.min(fillPercentage, 100)}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Separator for desktop */}
              <div className="hidden lg:block w-px bg-[#222] mx-4" />

              {/* Syringe Graphic Area */}
              <div className="w-full lg:w-48 flex flex-col items-center justify-between shrink-0 z-10 pt-4 mt-12 lg:mt-0">
                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-8 lg:mb-16">{syringeVolume * 100} IU SYRINGE</span>
                
                {/* Syringe Graphic Container */}
                <div className="relative h-[260px] lg:h-[320px] w-14 flex justify-center mb-8 mt-8 lg:mt-12">
                   <div className="w-12 h-full relative z-10 flex flex-col items-center">
                    
                    {/* Measurements (Right side of barrel) */}
                    <div className="absolute left-full ml-3 top-0 bottom-0 flex flex-col justify-between py-[4px] pointer-events-none text-left z-10 h-full">
                      {getSyringeTicks().map((tick, i) => {
                        const labelInterval = syringeVolume === 1.0 ? 20 : 10
                        const showLabel = tick % labelInterval === 0
                        return (
                          <div key={i} className="flex items-center gap-1.5 h-[10px]">
                            <div className={`h-px ${showLabel ? 'w-2.5 bg-gray-400' : 'w-1.5 bg-gray-600'}`} />
                            {showLabel && (
                              <span className="text-[9px] font-mono leading-none text-gray-400">
                                {tick}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Plunger */}
                    <motion.div 
                      className="absolute left-1/2 -translate-x-1/2 w-3.5 bg-gradient-to-r from-gray-400 via-white to-gray-400 border-x border-gray-300 z-0 origin-bottom flex justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]"
                      style={{ bottom: "100%" }}
                      animate={{ height: `${fillPercentage}%`, minHeight: '20px' }}
                      transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                    >
                      <div className="absolute -top-3 w-10 h-3 bg-gradient-to-b from-gray-100 via-gray-400 to-gray-600 rounded-sm border border-gray-300 shadow-[0_2px_5px_rgba(0,0,0,0.5),_inset_0_1px_2px_rgba(255,255,255,0.8)] flex justify-center items-center">
                        <div className="w-6 h-px bg-gray-500/50" />
                      </div>
                    </motion.div>

                    {/* Flanges */}
                    <div className="w-16 h-3 bg-gradient-to-b from-gray-100 via-gray-400 to-gray-500 rounded-[3px] absolute top-0 -translate-y-1/2 border border-gray-300 z-20 shadow-[0_4px_10px_rgba(0,0,0,0.8),_inset_0_1px_2px_rgba(255,255,255,0.9)]" />
                    
                    {/* Barrel */}
                    <div className="w-full h-full border-x border-t border-white/20 relative bg-gradient-to-r from-white/10 via-black/50 to-white/10 backdrop-blur-md overflow-hidden flex flex-col justify-end z-10 rounded-t-md shadow-[inset_0_0_10px_rgba(255,255,255,0.1),_inset_3px_0_10px_rgba(0,0,0,0.8)]">
                      
                      {/* Glass specular highlight */}
                      <div className="absolute left-[15%] top-0 bottom-0 w-[4px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-40 blur-[1px]" />
                      <div className="absolute right-[5%] top-0 bottom-0 w-[2px] bg-white/10 pointer-events-none z-40 blur-[0.5px]" />

                      {/* Rubber Tip */}
                      <motion.div 
                        className="absolute left-0 right-0 h-5 z-30 flex flex-col justify-between bg-gradient-to-r from-[#000] via-[#333] to-[#000]"
                        animate={{ bottom: `${fillPercentage}%` }}
                        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                      >
                         <div className="w-full h-1.5 bg-gradient-to-r from-[#111] via-[#555] to-[#111] rounded-t-sm shadow-[0_2px_4px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                         <div className="w-full h-1.5 bg-gradient-to-r from-[#000] via-[#222] to-[#000] rounded-b-sm shadow-[0_-2px_4px_rgba(0,0,0,0.8)]" />
                      </motion.div>
                      
                      {/* Liquid */}
                      <motion.div
                        className={`w-full ${errorMsg ? 'bg-red-900/90' : 'bg-gradient-to-r from-red-700 via-red-600 to-red-700'} relative z-20`}
                        initial={{ height: 0 }}
                        animate={{ height: `${fillPercentage}%` }}
                        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                        style={{ originY: 1 }}
                      >
                        <div className="absolute top-0 w-full h-px bg-red-400/60" />
                      </motion.div>
                      
                      {/* Ticks overlay inside barrel */}
                      <div className="absolute inset-0 flex flex-col justify-between py-[4px] pointer-events-none z-40 h-full">
                        {getSyringeTicks().map((tick, i) => {
                          const isMajor = tick % (syringeVolume === 1.0 ? 20 : 10) === 0;
                          const isMid = tick % (syringeVolume === 1.0 ? 10 : 5) === 0;
                          let width = 'w-1/4';
                          if (isMajor) width = 'w-[60%]';
                          else if (isMid) width = 'w-[40%]';
                          
                          return (
                            <div key={i} className="flex items-center w-full px-1.5 justify-end">
                              <div className={`h-[1px] bg-white/30 ${width}`} />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Shoulder & Needle */}
                    <div className="flex flex-col items-center relative z-0 w-full">
                      <div className="w-full h-6 relative flex justify-center z-20 overflow-hidden bg-gradient-to-r from-[#111] via-[#555] to-[#111] border-t border-white/20 shadow-[inset_0_2px_5px_rgba(255,255,255,0.1)]" style={{ clipPath: 'polygon(0 0, 100% 0, 65% 100%, 35% 100%)' }}>
                        <div className="absolute left-[30%] top-0 bottom-0 w-[2px] bg-white/20 transform -skew-x-12 z-30 blur-[0.5px]" />
                        <motion.div
                         className={`absolute bottom-0 w-full h-full ${errorMsg ? 'bg-red-900/90' : 'bg-gradient-to-r from-red-700 via-red-600 to-red-700'}`}
                         initial={{ opacity: 0 }}
                         animate={{ opacity: fillPercentage > 0 ? 1 : 0 }}
                        />
                      </div>
                      <div className="w-1.5 h-16 bg-gradient-to-r from-gray-400 via-white to-gray-400 relative z-0 shadow-xl rounded-b-full">
                        <div className="absolute top-0 bottom-0 left-[1px] w-[1px] bg-white blur-[0.2px]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Draw Box */}
                <div className="w-full bg-[#111111]/20 backdrop-blur-lg border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-red-500 text-3xl font-sans leading-none tracking-tight">{tickMarksStr}</span>
                    <span className="text-red-500 text-base font-sans italic">IU</span>
                  </div>
                  <span className="text-gray-500 text-[9px] uppercase tracking-widest mt-2 font-bold">Current Draw</span>
                </div>

                {/* Dosing Visualization (Mobile) */}
              <div className="flex lg:hidden flex-col mt-8 w-full z-10 pt-8 border-t border-white/5">
                <h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-5">Dosing Visualization</h3>
                <div className="flex justify-between items-end mb-3">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mb-1">Target Dose</span>
                    <span className="text-red-500 font-bold text-base tracking-wider">{targetDoseMcg} mcg</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mb-1">Required Draw</span>
                    <span className="text-red-500 font-bold text-base tracking-wider">{tickMarksStr} IU</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#222] rounded-full relative flex items-center">
                   <div 
                    className="absolute left-0 h-1.5 bg-red-600 rounded-l-full shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-500" 
                    style={{ width: `${Math.min(fillPercentage, 100)}%` }} 
                  />
                  <div 
                    className="absolute w-2.5 h-2.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)] -ml-[5px] transition-all duration-500"
                    style={{ left: `${Math.min(fillPercentage, 100)}%` }}
                  />
                </div>
              </div>

            </div>

            </div>
          </div>

          {/* Bottom Banner */}
          <div className="w-full bg-[#111111]/20 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-2xl">
            <ShieldCheck className="w-6 h-6 text-[#dca54c] shrink-0" />
            <p className="text-gray-500 text-[10px] tracking-widest uppercase text-center sm:text-left leading-relaxed">
              The information provided by this calculator is for research purposes only. <br className="hidden sm:block lg:hidden" /> Sparta Labs is not responsible for misuse of this information.
            </p>
          </div>

        </div>
      </section>


      {/* ============================================
          SECTION 2: HOW TO USE — STEP-BY-STEP GUIDE
          ============================================ */}
      <section className="bg-white text-ink py-20 lg:py-32 px-4 md:px-8 lg:px-10">
        <div className="max-w-[1400px] mx-auto w-full">
          <FadeUp>
            <div className="flex flex-col mb-16 lg:mb-24">
              <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-6">
                Step-by-Step Guide
              </h2>
              <p className="text-base lg:text-lg text-ink-muted leading-relaxed font-light max-w-2xl">
                Follow this four-step workflow to calculate the exact IU syringe mark, solution concentration, draw volume, and total doses for any research peptide reconstitution. Each step takes less than 30 seconds. The calculator handles all the math — no spreadsheet or manual formula required.
              </p>
            </div>
          </FadeUp>

          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Step 1 */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-8 items-start border-t border-ink/10 pt-12">
                <span className="text-4xl lg:text-5xl font-sans text-red-400 tracking-tighter leading-none mt-1">01</span>
                <div className="flex flex-col">
                  <h3 className="text-2xl lg:text-3xl font-normal text-ink uppercase tracking-tight mb-6">Select Your Insulin Syringe (0.3ml, 0.5ml, or 1.0ml)</h3>
                  <p className="text-base lg:text-lg text-ink/70 leading-relaxed font-light mb-8 max-w-3xl">
                    Begin by selecting the insulin syringe capacity you are using for this reconstitution. All three options use standard U-100 insulin syringes, where 1ml equals 100 IU. Your syringe size determines the maximum draw volume and the precision of your tick-mark readings.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-ink/20">
                          <th className="py-4 pr-8 text-sm uppercase tracking-widest text-ink font-medium">Syringe Size</th>
                          <th className="py-4 pr-8 text-sm uppercase tracking-widest text-ink font-medium">IU Capacity</th>
                          <th className="py-4 text-sm uppercase tracking-widest text-ink font-medium">Best Used For</th>
                        </tr>
                      </thead>
                      <tbody className="font-light text-ink/70">
                        <tr className="border-b border-ink/5">
                          <td className="py-4 pr-8 text-base text-ink font-medium">0.3 ML</td>
                          <td className="py-4 pr-8 text-base text-ink">30 IU (max)</td>
                          <td className="py-4 text-base">Micro-dose protocols requiring very precise low-volume draws</td>
                        </tr>
                        <tr className="border-b border-ink/5">
                          <td className="py-4 pr-8 text-base text-ink font-medium">0.5 ML</td>
                          <td className="py-4 pr-8 text-base text-ink">50 IU (max)</td>
                          <td className="py-4 text-base">General-purpose research — the most common choice for peptide reconstitution</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-8 text-base text-ink font-medium">1.0 ML</td>
                          <td className="py-4 pr-8 text-base text-ink">100 IU (max)</td>
                          <td className="py-4 text-base">Higher-volume draws or high-concentration solutions requiring larger measurements</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Step 2 */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-8 items-start border-t border-ink/10 pt-12">
                <span className="text-4xl lg:text-5xl font-sans text-red-400 tracking-tighter leading-none mt-1">02</span>
                <div className="flex flex-col">
                  <h3 className="text-2xl lg:text-3xl font-normal text-ink uppercase tracking-tight mb-6">Enter Your Peptide Vial Amount (mg or mcg)</h3>
                  <p className="text-base lg:text-lg text-ink/70 leading-relaxed font-light mb-4 max-w-3xl">
                    Input the total peptide amount stated on your vial label. Use the mg/mcg toggle to match whatever unit your label uses. Most research peptide vials are labeled in milligrams (mg) — common sizes are 5mg and 10mg. If your label reads "5,000 mcg", that is identical to 5mg. The calculator converts between units automatically.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Step 3 */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-8 items-start border-t border-ink/10 pt-12">
                <span className="text-4xl lg:text-5xl font-sans text-red-400 tracking-tighter leading-none mt-1">03</span>
                <div className="flex flex-col">
                  <h3 className="text-2xl lg:text-3xl font-normal text-ink uppercase tracking-tight mb-6">Specify Your Bacteriostatic Water Volume (ml)</h3>
                  <p className="text-base lg:text-lg text-ink/70 leading-relaxed font-light mb-8 max-w-3xl">
                    Enter the volume of bacteriostatic water (BAC water) you will add to the vial during reconstitution. The most common research volumes are 1ml, 2ml, and 3ml. The amount of water you add directly determines the solution concentration: more water lowers concentration (larger draws per dose), less water raises concentration (smaller, more precise draws).
                  </p>
                  <div className="bg-[#f4f7fb] border border-[#eef3fb] rounded-2xl p-6 lg:p-8">
                    <p className="text-sm uppercase tracking-widest mb-4 font-medium text-ink/60">Concentration Formula</p>
                    <p className="text-xl lg:text-2xl font-normal text-ink tracking-tight">
                      Concentration (mcg/ml) = <span className="italic text-[#5984c4]">Peptide Amount (mcg)</span> ÷ <span className="italic text-[#5984c4]">Bacteriostatic Water (ml)</span>
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Step 4 */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-8 items-start border-t border-ink/10 pt-12">
                <span className="text-4xl lg:text-5xl font-sans text-red-400 tracking-tighter leading-none mt-1">04</span>
                <div className="flex flex-col">
                  <h3 className="text-2xl lg:text-3xl font-normal text-ink uppercase tracking-tight mb-6">Set Your Target Dose and Read Results</h3>
                  <p className="text-base lg:text-lg text-ink/70 leading-relaxed font-light mb-8 max-w-3xl">
                    Enter your target research dose in either mg or mcg using the toggle. The calculator instantly outputs all four results. The Required Draw (IU) is the most important output — it is the exact tick mark on your syringe to draw to. All results update in real time.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-ink/20">
                          <th className="py-4 pr-8 text-sm uppercase tracking-widest text-ink font-medium">Output Field</th>
                          <th className="py-4 text-sm uppercase tracking-widest text-ink font-medium">What It Tells You</th>
                        </tr>
                      </thead>
                      <tbody className="font-light text-ink/70">
                        <tr className="border-b border-ink/5">
                          <td className="py-4 pr-8 text-base text-ink font-medium">Required Draw (IU)</td>
                          <td className="py-4 text-base">The exact IU tick mark on your U-100 insulin syringe to draw to — this is your primary result</td>
                        </tr>
                        <tr className="border-b border-ink/5">
                          <td className="py-4 pr-8 text-base text-ink font-medium">Solution Concentration</td>
                          <td className="py-4 text-base">How many micrograms of peptide are dissolved per milliliter of solution</td>
                        </tr>
                        <tr className="border-b border-ink/5">
                          <td className="py-4 pr-8 text-base text-ink font-medium">Draw Volume (ml)</td>
                          <td className="py-4 text-base">The precise volume of solution in milliliters to extract from the vial per dose</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-8 text-base text-ink font-medium">Total Doses Per Vial</td>
                          <td className="py-4 text-base">How many complete doses remain in the vial at your current dose and water volume settings</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: UNDERSTANDING THE MATH
          ============================================ */}
      <section className="bg-ink py-20 lg:py-32 px-4 md:px-8 lg:px-10">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
          
          {/* Left: Sticky Title */}
          <div className="lg:sticky lg:top-32">
            <FadeUp>
              <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-white min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-6">
                The Science
              </h2>
              <p className="text-base lg:text-lg text-white/60 leading-relaxed font-light mb-8 max-w-md">
                Every calculation this tool produces is the output of a simple three-step formula chain. Understanding the arithmetic lets you verify any result independently — and makes you a more precise researcher.
              </p>
            </FadeUp>
          </div>

          {/* Right: List */}
          <div className="flex flex-col gap-12 lg:gap-16">
            <FadeUp>
              <div className="flex flex-col gap-4">
                <div className="text-red-400 mb-2">
                  <FlaskConical className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                </div>
                <h4 className="text-2xl lg:text-3xl font-normal uppercase tracking-tight text-white mb-2">Concentration Formula</h4>
                <p className="text-base lg:text-lg text-white/60 leading-relaxed font-light">
                  <strong className="text-white font-medium block mb-2">Peptide (mcg) ÷ Bacteriostatic Water (ml)</strong>
                  Divide the total peptide amount by the volume of bacteriostatic water added. Example: A 5mg vial (5,000 mcg) reconstituted with 2ml of BAC water produces a concentration of 2,500 mcg/ml. Every milliliter contains exactly 2,500 micrograms of peptide.
                </p>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="flex flex-col gap-4 border-t border-white/10 pt-12">
                <div className="text-red-400 mb-2">
                  <Droplets className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                </div>
                <h4 className="text-2xl lg:text-3xl font-normal uppercase tracking-tight text-white mb-2">Draw Volume</h4>
                <p className="text-base lg:text-lg text-white/60 leading-relaxed font-light">
                  <strong className="text-white font-medium block mb-2">Target Dose (mcg) ÷ Concentration (mcg/ml)</strong>
                  Divide your target research dose by the solution concentration to get the exact volume to draw in milliliters. Example: A target dose of 250 mcg at a 2,500 mcg/ml concentration requires a draw volume of exactly 0.1 ml.
                </p>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="flex flex-col gap-4 border-t border-white/10 pt-12">
                <div className="text-red-400 mb-2">
                  <Syringe className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                </div>
                <h4 className="text-2xl lg:text-3xl font-normal uppercase tracking-tight text-white mb-2">Syringe IU Conversion</h4>
                <p className="text-base lg:text-lg text-white/60 leading-relaxed font-light">
                  <strong className="text-white font-medium block mb-2">Draw Volume (ml) × 100</strong>
                  Multiply your draw volume in ml by 100 to convert to International Units (IU) as marked on a standard U-100 insulin syringe. Example: 0.1 ml × 100 = 10 IU. You draw the syringe plunger back to the '10' tick mark.
                </p>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="flex flex-col gap-4 border-t border-white/10 pt-12">
                <div className="text-red-400 mb-2">
                  <BookOpen className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                </div>
                <h4 className="text-2xl lg:text-3xl font-normal uppercase tracking-tight text-white mb-2">Total Doses Per Vial</h4>
                <p className="text-base lg:text-lg text-white/60 leading-relaxed font-light">
                  <strong className="text-white font-medium block mb-2">Water Added (ml) ÷ Draw Volume (ml)</strong>
                  Divide the total reconstituted volume by the draw volume per dose to get the total number of doses available. Example: 2 ml ÷ 0.1 ml = 20 complete doses.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: COMMON RECONSTITUTION SCENARIOS
          ============================================ */}
      <section className="bg-[#f4f7fb] text-ink py-20 lg:py-32 px-4 md:px-8 lg:px-10">
        <div className="max-w-[1400px] mx-auto w-full">
          <FadeUp>
            <div className="flex flex-col mb-12">
              <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-6">
                Common Scenarios
              </h2>
              <p className="text-base lg:text-lg text-ink-muted leading-relaxed font-light max-w-2xl">
                Pre-calculated reference table for the most frequently used peptide vial sizes, water volumes, and dose amounts. All values assume a standard U-100 syringe.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="overflow-x-auto bg-white rounded-3xl border border-[#eef3fb] p-6 lg:p-8 shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-ink/10">
                    <th className="py-5 pr-6 text-sm uppercase tracking-widest text-ink font-medium">Vial Size</th>
                    <th className="py-5 pr-6 text-sm uppercase tracking-widest text-ink font-medium">Bac Water</th>
                    <th className="py-5 pr-6 text-sm uppercase tracking-widest text-ink font-medium">Concentration</th>
                    <th className="py-5 pr-6 text-sm uppercase tracking-widest text-ink font-medium">Dose (mcg)</th>
                    <th className="py-5 pr-6 text-sm uppercase tracking-widest text-ink font-medium">Draw (IU)</th>
                    <th className="py-5 text-sm uppercase tracking-widest text-ink font-medium">Total Doses</th>
                  </tr>
                </thead>
                <tbody className="font-light">
                  {[
                    ['5 mg', '1 ml', '5,000 mcg/ml', '100', '2 IU', '50'],
                    ['5 mg', '1 ml', '5,000 mcg/ml', '250', '5 IU', '20'],
                    ['5 mg', '2 ml', '2,500 mcg/ml', '250', '10 IU', '20'],
                    ['5 mg', '2 ml', '2,500 mcg/ml', '500', '20 IU', '10'],
                    ['10 mg', '2 ml', '5,000 mcg/ml', '250', '5 IU', '40'],
                    ['10 mg', '2 ml', '5,000 mcg/ml', '500', '10 IU', '20'],
                    ['10 mg', '3 ml', '3,333 mcg/ml', '300', '9 IU', '30'],
                    ['15 mg', '3 ml', '5,000 mcg/ml', '500', '10 IU', '30'],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-ink/5 hover:bg-[#f4f7fb]/50 transition-colors">
                      {row.map((cell, j) => (
                         <td key={j} className={`py-5 pr-6 ${j === 4 ? 'font-medium text-ink' : 'text-ink/70'}`}>
                           {cell}
                         </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============================================
          SECTION 5: STORAGE & HANDLING GUIDE
          ============================================ */}
      <section className="bg-white text-ink py-20 lg:py-32 px-4 md:px-8 lg:px-10 border-t border-[#eef3fb]">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
          
          {/* Left: Sticky Title */}
          <div className="lg:sticky lg:top-32">
            <FadeUp>
              <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-6">
                Best Practices
              </h2>
              <p className="text-base lg:text-lg text-ink-muted leading-relaxed font-light max-w-md">
                Correct storage and sterile technique are as important as accurate dosing calculations. Improper storage degrades peptide potency; improper handling introduces contamination.
              </p>
            </FadeUp>
          </div>

          {/* Right: List */}
          <div className="flex flex-col gap-12">
             <FadeUp delay={0.1}>
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 border-t border-ink/10 pt-10">
                <div className="text-red-400 shrink-0">
                  <Thermometer className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-2xl lg:text-3xl font-normal uppercase tracking-tight text-ink">Before Reconstitution</h4>
                  <p className="text-base lg:text-lg text-ink/70 leading-relaxed font-light">
                    Store unreconstituted (lyophilized) peptide powder in a freezer at −20°C or below for long-term stability. Avoid repeated freeze-thaw cycles, which degrade peptide structure over time.
                  </p>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 border-t border-ink/10 pt-10">
                <div className="text-red-400 shrink-0">
                  <Droplets className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-2xl lg:text-3xl font-normal uppercase tracking-tight text-ink">After Reconstitution</h4>
                  <p className="text-base lg:text-lg text-ink/70 leading-relaxed font-light">
                    Store the reconstituted vial upright in a standard refrigerator at 2–8°C. Most reconstituted research peptides remain stable for 2 to 4 weeks. Never freeze a reconstituted peptide solution.
                  </p>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 border-t border-ink/10 pt-10">
                <div className="text-red-400 shrink-0">
                  <Syringe className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-2xl lg:text-3xl font-normal uppercase tracking-tight text-ink">Reconstitution Technique</h4>
                  <p className="text-base lg:text-lg text-ink/70 leading-relaxed font-light">
                    Always inject bacteriostatic water slowly against the inner glass wall of the vial. Gently roll or swirl the vial for 1–2 minutes. Do not shake or agitate forcefully — this denatures the peptide chains.
                  </p>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.4}>
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 border-t border-ink/10 pt-10">
                <div className="text-red-400 shrink-0">
                  <AlertTriangle className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-2xl lg:text-3xl font-normal uppercase tracking-tight text-ink">Contamination Prevention</h4>
                  <p className="text-base lg:text-lg text-ink/70 leading-relaxed font-light">
                    Swab the vial's rubber stopper with a sterile alcohol prep pad before every extraction. Use a fresh, sterile syringe and needle for each draw. Work in a clean, dust-free environment.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: UNIT CONVERSION REFERENCE
          ============================================ */}
      <section className="bg-ink text-white py-20 lg:py-32 px-4 md:px-8 lg:px-10">
        <div className="max-w-[1400px] mx-auto w-full">
          <FadeUp>
            <div className="flex flex-col mb-16">
              <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-white min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-6">
                Unit Conversions
              </h2>
              <p className="text-base lg:text-lg text-white/60 leading-relaxed font-light max-w-2xl">
                Quick-reference conversion tables for the most commonly used units in research peptide calculation. Bookmark this page for fast lookups during reconstitution.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mass Conversions */}
            <FadeUp delay={0.1}>
              <div>
                <h4 className="text-2xl font-normal uppercase tracking-tight mb-8 text-white">mg to mcg</h4>
                <table className="w-full text-left border-collapse">
                  <tbody className="font-light text-white/70">
                    <tr className="border-b border-white/10">
                      <td className="py-4 pr-4 text-lg text-white">1 mg</td>
                      <td className="py-4 text-base">=  1,000 mcg</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 pr-4 text-lg text-white">0.1 mg</td>
                      <td className="py-4 text-base">=  100 mcg</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 pr-4 text-lg text-white">0.01 mg</td>
                      <td className="py-4 text-base">=  10 mcg</td>
                    </tr>
                    <tr>
                      <td className="py-4 pr-4 text-lg text-white">0.001 mg</td>
                      <td className="py-4 text-base">=  1 mcg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FadeUp>

            {/* Volume Conversions */}
            <FadeUp delay={0.2}>
              <div>
                <h4 className="text-2xl font-normal uppercase tracking-tight mb-8 text-white">ml to IU (U-100)</h4>
                <table className="w-full text-left border-collapse">
                  <tbody className="font-light text-white/70">
                    <tr className="border-b border-white/10">
                      <td className="py-4 pr-4 text-lg text-white">1 ml</td>
                      <td className="py-4 text-base">=  100 IU</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 pr-4 text-lg text-white">0.5 ml</td>
                      <td className="py-4 text-base">=  50 IU</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 pr-4 text-lg text-white">0.1 ml</td>
                      <td className="py-4 text-base">=  10 IU</td>
                    </tr>
                    <tr>
                      <td className="py-4 pr-4 text-lg text-white">0.01 ml</td>
                      <td className="py-4 text-base">=  1 IU</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: FAQ
          ============================================ */}
      <FAQ faqs={CALCULATOR_FAQS} />

      {/* ============================================
          SECTION 8: SHOP CTA STRIP
          ============================================ */}
      <CTASection
        subtitle="PREMIUM PEPTIDES"
        title="Shop Research Peptides"
        description="Every compound in our catalog is US-synthesized, independently verified at ≥99% HPLC purity, and ships with a lot-specific Certificate of Analysis."
        primaryButtonText="Browse Catalog"
        primaryButtonLink="/shop"
        secondaryButtonText=""
        secondaryButtonLink=""
      />

      {/* ============================================
          SECTION 9: LEGAL DISCLAIMER
          ============================================ */}
      <section className="bg-white py-16 lg:py-24 px-4 md:px-8 lg:px-10 border-t border-[#eef3fb]">
        <div className="max-w-[1400px] mx-auto w-full">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16">
              <div className="shrink-0 flex items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-red-400" strokeWidth={1.5} />
                <span className="text-sm uppercase tracking-widest text-ink font-medium">Legal Disclaimer</span>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <p className="text-sm md:text-base text-ink/60 leading-relaxed font-light">
                  All products referenced on this page and throughout Sparta Labs are intended exclusively for <strong className="text-ink font-medium">in-vitro laboratory research purposes only</strong>. They are not intended for human consumption, diagnostic, therapeutic, or any other clinical use.
                </p>
                <p className="text-sm md:text-base text-ink/60 leading-relaxed font-light">
                  This calculator is provided strictly as a <strong className="text-ink font-medium">theoretical research tool</strong> to assist researchers in calculating reconstitution volumes and concentrations for their laboratory guidelines. It does not constitute medical advice, and no information provided should be interpreted as guidance for human administration.
                </p>
                <p className="text-sm md:text-base text-ink/60 leading-relaxed font-light">
                  By using this tool, you confirm that you are a qualified researcher and that all products will be used in strict compliance with applicable federal, state, and local regulations. Sparta Labs assumes no liability for misuse of this tool or any products listed on our platform.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </main>
  )
}
