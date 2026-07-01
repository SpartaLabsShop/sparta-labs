import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const IMAGES_DIR = path.resolve(process.cwd(), 'public/new-products-updated')

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]/g, '')
}

function findImageFile(dirFiles: string[], compoundName: string, dosageLabel: string): string {
  const target = norm(`${compoundName} ${dosageLabel}`)
  const match = dirFiles.find((f) => norm(f) === target)
  if (!match) {
    throw new Error(
      `No image match for "${compoundName} ${dosageLabel}" (normalized target: "${target}"). Check filenames in ${IMAGES_DIR}.`,
    )
  }
  return match
}

async function run() {
  console.log('Initializing Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  if (!fs.existsSync(IMAGES_DIR)) {
    throw new Error(`Images directory not found: ${IMAGES_DIR}`)
  }
  const dirFiles = fs.readdirSync(IMAGES_DIR).filter((f) => f.toLowerCase().endsWith('.webp'))
  console.log(`Found ${dirFiles.length} images in ${IMAGES_DIR}`)

  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 100,
    depth: 0,
  })
  console.log(`Found ${products.length} products in the database.`)

  let updated = 0
  let failed = 0

  for (const product of products as any[]) {
    const name = product.name as string

    try {
      if (product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0) {
        for (const variant of product.variants) {
          const dosageLabel: string | undefined = variant.options?.find((o: any) => o.key === 'Dosage')?.value
          if (!dosageLabel) {
            console.warn(`  ! Skipping variant with no Dosage option on "${name}" (sku: ${variant.sku})`)
            continue
          }
          const file = findImageFile(dirFiles, name, dosageLabel)
          const filePath = path.join(IMAGES_DIR, file)
          const fileBuffer = fs.readFileSync(filePath)
          const mediaId = typeof variant.image === 'object' ? variant.image.id : variant.image
          if (!mediaId) {
            console.warn(`  ! No existing media on variant ${variant.sku} of "${name}", skipping`)
            continue
          }
          await payload.update({
            collection: 'media',
            id: mediaId,
            data: {},
            file: {
              data: fileBuffer,
              mimetype: 'image/webp',
              name: file,
              size: fs.statSync(filePath).size,
            },
          })
          console.log(`  ✓ ${name} [${dosageLabel}] -> media ${mediaId}`)
          updated++
        }
      } else {
        // Single-dosage product: use the top-level images[0]
        const firstImage = Array.isArray(product.images) ? product.images[0] : undefined
        const mediaId = firstImage ? (typeof firstImage.image === 'object' ? firstImage.image.id : firstImage.image) : undefined
        if (!mediaId) {
          console.warn(`  ! No existing image on "${name}", skipping`)
          continue
        }
        // Derive the dosage label from the product's sku (e.g. "PT141-10MG" -> "10mg") isn't reliable,
        // so instead try every dosage-less match: search files whose normalized name starts with the compound name.
        const target = norm(name)
        const candidates = dirFiles.filter((f) => norm(f).startsWith(target))
        const file = candidates.length === 1 ? candidates[0] : undefined
        if (!file) {
          throw new Error(
            `Could not uniquely resolve single-dosage image for "${name}" (candidates: ${candidates.join(', ') || 'none'})`,
          )
        }
        const filePath = path.join(IMAGES_DIR, file)
        const fileBuffer = fs.readFileSync(filePath)
        await payload.update({
          collection: 'media',
          id: mediaId,
          data: {},
          file: {
            data: fileBuffer,
            mimetype: 'image/webp',
            name: file,
            size: fs.statSync(filePath).size,
          },
        })
        console.log(`  ✓ ${name} -> media ${mediaId}`)
        updated++
      }
    } catch (err: any) {
      console.error(`  ✗ Failed "${name}": ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. Updated ${updated} images, failed ${failed}.`)
  process.exit(failed > 0 ? 1 : 0)
}

run().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
