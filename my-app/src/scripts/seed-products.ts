#!/usr/bin/env tsx
/**
 * Seed script to sync mock products to Supabase
 * Usage:
 *   npm run seed:products        # Insert new products, skip existing
 *   npm run seed:products:dry    # Preview changes without applying
 *   npm run seed:products:force  # Overwrite existing products
 */

import { createClient } from '@supabase/supabase-js'
import { mockProducts } from '../data/mock-products'
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { join } from 'path'

// Load environment variables from .env.local
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  dotenv.config()
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// CLI flags
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')

console.log('\n🌱 Seeding products to Supabase...')
console.log(`   Dry run: ${dryRun ? 'YES ✅' : 'NO ❌'}`)
console.log(`   Force mode: ${force ? 'YES ✅' : 'NO ❌'}`)
console.log(`   Products to sync: ${mockProducts.length}\n`)

async function seedProducts() {
  let inserted = 0
  let updated = 0
  let skipped = 0
  let errors = 0

  for (const product of mockProducts) {
    try {
      // Check if product exists
      const { data: existing, error: checkError } = await supabase
        .from('products')
        .select('id, slug')
        .eq('slug', product.slug)
        .maybeSingle()

      if (checkError) {
        throw checkError
      }

      const productData = {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        compare_price: product.comparePrice || null,
        category: product.category,
        badge: product.badge || null,
        images: product.images || [],
        features: product.features || [],
        stock: product.stock,
        bulk_pricing: product.bulkPricing || [],
      }

      if (existing && !force) {
        console.log(`⏭️  Skipping: ${product.name}`)
        skipped++
      } else if (existing && force) {
        // Update existing
        if (!dryRun) {
          const { error: updateError } = await supabase
            .from('products')
            .update(productData)
            .eq('slug', product.slug)

          if (updateError) throw updateError
        }
        console.log(`✏️  Updated: ${product.name}`)
        updated++
      } else {
        // Insert new
        if (!dryRun) {
          const { error: insertError } = await supabase
            .from('products')
            .insert(productData)

          if (insertError) throw insertError
        }
        console.log(`✅ Inserted: ${product.name}`)
        inserted++
      }
    } catch (error: unknown) {
      console.error(`❌ Error with ${product.name}:`, error instanceof Error ? error.message : 'Unknown error')
      errors++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Inserted: ${inserted}`)
  console.log(`   ✏️  Updated: ${updated}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log(`   📦 Total: ${mockProducts.length}\n`)

  if (dryRun) {
    console.log('⚠️  Dry run complete - no changes made')
    console.log('   Run "npm run seed:products" to apply changes\n')
  } else if (errors === 0) {
    console.log('✅ Seeding complete!\n')
  } else {
    console.log(`⚠️  Seeding complete with ${errors} error(s)\n`)
    process.exit(1)
  }
}

seedProducts().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
