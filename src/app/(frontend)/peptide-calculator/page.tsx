import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PeptideCalculatorPage from './PeptideCalculatorClient'

// Page hidden per request — set to false to bring it back online.
const IS_ENABLED = false

export const metadata: Metadata = {
  title: 'Peptide Reconstitution Calculator — Free Tool | Sparta Labs',
  description: 'Free peptide reconstitution calculator. Enter your vial size, BAC water volume, and target dose to get exact IU syringe units, concentration, and total doses. No signup — instant results.',
  alternates: {
    canonical: 'https://spartalabs.shop/peptide-calculator',
    languages: {
      'en-US': 'https://spartalabs.shop/peptide-calculator',
    },
  },
}

export default function Page() {
  if (!IS_ENABLED) {
    notFound()
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I calculate how many IU to draw for my peptide dose?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use the three-step formula: (1) Divide peptide amount (mcg) by BAC water (ml) to get concentration. (2) Divide target dose (mcg) by concentration to get draw volume (ml). (3) Multiply draw volume by 100 to get IU on a U-100 syringe."
        }
      },
      {
        "@type": "Question",
        "name": "How much bacteriostatic water should I add to a 5mg peptide vial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The most common volumes are 1ml, 2ml, or 3ml. Adding 2ml to a 5mg vial gives a 2,500 mcg/ml concentration. More water lowers concentration (larger draws); less water raises concentration (smaller, more precise draws)."
        }
      },
      {
        "@type": "Question",
        "name": "How long can reconstituted peptides be stored in the refrigerator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most reconstituted research peptides remain stable for 2 to 4 weeks stored upright at 2-8 degrees Celsius. Bacteriostatic water extends stability via 0.9% benzyl alcohol. Never freeze a reconstituted solution."
        }
      },
      {
        "@type": "Question",
        "name": "Should I shake or swirl a peptide vial after adding bacteriostatic water?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Always swirl gently, never shake. Shaking denatures peptide chains. Inject BAC water slowly along the inner glass wall and gently roll or swirl until the powder dissolves."
        }
      },
      {
        "@type": "Question",
        "name": "What does the Required Draw (IU) output mean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Required Draw (IU) is the exact tick-mark number on your U-100 insulin syringe to pull the plunger to. On a U-100 syringe, 100 IU = 1ml, so 10 IU = 0.1ml draw volume."
        }
      }
    ]
  }

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Peptide Reconstitution Calculator",
    "url": "https://spartalabs.shop/peptide-calculator",
    "description": "Free online peptide reconstitution calculator. Enter vial size, BAC water volume, and target dose to get exact IU syringe units, concentration, and total doses.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Sparta Labs"
    }
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Reconstitute a Research Peptide",
    "description": "4-step process to calculate peptide reconstitution volume, concentration, and IU syringe draw.",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Select Syringe Capacity",
        "text": "Choose 0.3ml, 0.5ml, or 1.0ml insulin syringe."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Enter Peptide Amount",
        "text": "Input vial amount in mg or mcg."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Specify BAC Water Volume",
        "text": "Enter bacteriostatic water volume in ml."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Set Target Dose",
        "text": "Enter target dose and read IU, concentration, draw volume, and total doses."
      }
    ]
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://spartalabs.shop"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Peptide Calculator",
        "item": "https://spartalabs.shop/peptide-calculator"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PeptideCalculatorPage />
    </>
  )
}
