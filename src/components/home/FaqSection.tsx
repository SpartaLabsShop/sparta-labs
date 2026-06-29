import React from 'react'
import { FaqCarousel, FaqItem } from '@/components/shared/FaqCarousel'

const FAQS: FaqItem[] = [
  {
    question: "What is the purity standard for your research peptides?",
    answer: "Every research peptide sold by Sparta Labs must meet or exceed a strictly enforced ≥99% purity threshold. We verify this standard through independent, third-party High-Performance Liquid Chromatography (HPLC) and Liquid Chromatography–Mass Spectrometry (LC-MS) testing for every production batch — not random samples. Any batch that tests below this threshold is immediately discarded."
  },
  {
    question: "How can I access the Certificate of Analysis (COA) for my order?",
    answer: "Lot-specific Certificates of Analysis for every active batch are publicly available in our COA Library at /certificates. Every order also includes a batch number that corresponds directly to that batch's test documentation. You can verify purity, molecular identity, and endotoxin status for every compound you receive."
  },
  {
    question: "Are these products intended for human consumption?",
    answer: "No. All products sold by Sparta Labs are strictly for laboratory and research use only. They are not intended to diagnose, treat, cure, or prevent any disease, and are not for human or animal consumption. These statements have not been evaluated by the FDA."
  },
  {
    question: "What are your shipping and fulfillment times?",
    answer: "All orders are fulfilled from our US-based facilities. We offer standard shipping (3–5 business days) and expedited 2-day shipping on orders over $300. Orders placed before 2 PM EST typically ship same day. All peptides are dispatched using validated cold-chain packaging to maintain molecular integrity in transit."
  },
  {
    question: "What are research peptides — and how are they used?",
    answer: "Research peptides are synthetic compounds used in laboratory settings to study biological processes such as tissue recovery, skin collagen synthesis, body composition, and hair density. They are manufactured under strict quality controls and verified through third-party HPLC and LC-MS testing. Our compounds are for research use only and are not offered as cosmetic or medical products."
  },
  {
    question: "How are your research peptides synthesized?",
    answer: "We utilize advanced solid-phase peptide synthesis (SPPS) in US-based, ISO-certified laboratories. This method assembles amino acid chains sequentially on a resin support, allowing precise control over sequence fidelity and molecular structure. Post-synthesis purification removes truncated sequences and impurities to meet our ≥99% purity floor. Every batch is independently verified before fulfillment."
  },
  {
    question: "Do you offer bulk or wholesale pricing for research institutions?",
    answer: "Yes. We offer tiered wholesale pricing for qualified research institutions, university labs, clinical facilities, and approved wholesale accounts. Contact our support team to apply for an institutional account. Pricing scales with volume, and bulk orders still receive lot-specific COA documentation."
  },
  {
    question: "How do I verify that a peptide vendor is legitimate and properly tested?",
    answer: "The three non-negotiable markers of a legitimate research peptide supplier are: (1) independent third-party HPLC and LC-MS testing — not in-house testing — for every batch; (2) a publicly accessible COA library with lot-traceable documentation; and (3) US-based synthesis, not merely US-based fulfillment of overseas-sourced raw powders. Sparta Labs meets all three criteria on every order."
  }
]

export function FaqSection() {
  return (
    <FaqCarousel 
      faqs={FAQS} 
      sectionLabel="KNOWLEDGE BASE"
      title="Frequently Asked Questions"
      accentTitle="About Research Peptides"
      description="Everything you need to know about our purity standards, testing methodology, ordering process, and shipping. For institutional or bulk inquiries, contact our support team directly."
      theme="light"
    />
  )
}
