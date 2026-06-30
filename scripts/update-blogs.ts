import { getPayload } from 'payload'
import config from '../src/payload.config'

const updates: Record<string, { image: string; excerpt: string }> = {
  'bpc-157-healing-peptide-tissue-recovery': {
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Exploring the regenerative properties of BPC-157 and its role in accelerating tissue repair across muscles, tendons, and the gastrointestinal tract.',
  },
  'ghk-cu-cellular-rejuvenation': {
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'A deep dive into the naturally occurring tripeptide-copper complex GHK-Cu and its remarkable effects on collagen synthesis, wound healing, and cellular rejuvenation.',
  },
  'tb-500-tissue-repair-inflammation': {
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Understanding how TB-500 promotes cell migration, reduces inflammation, and supports cardiac and neurological tissue repair in preclinical research.',
  },
  'ipamorelin-vs-cjc-1295-growth-hormone': {
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Comparing the mechanisms, pharmacological profiles, and synergistic potential of two leading growth hormone secretagogues in peptide research.',
  },
  'storage-reconstitution-lyophilized-peptides': {
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Essential guidelines for proper storage, reconstitution, and handling of lyophilized peptides to maintain structural integrity and biological activity.',
  },
}

async function run() {
  const payload = await getPayload({ config })

  for (const [slug, data] of Object.entries(updates)) {
    const { docs } = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (docs.length > 0) {
      await payload.update({
        collection: 'blog-posts',
        id: docs[0].id,
        data: {
          featuredImageUrl: data.image,
          excerpt: data.excerpt,
        } as any,
      })
      console.log(`Updated: ${slug}`)
    } else {
      console.log(`Not found: ${slug}`)
    }
  }

  console.log('Done!')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
