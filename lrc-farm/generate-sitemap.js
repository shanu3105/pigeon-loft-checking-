import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY

const SITE_URL = 'https://lrcfarm-ca9f9.web.app'

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing Supabase environment variables.')
  process.exit(1)
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
)

async function generateSitemap() {
  console.log('Generating sitemap...')

  const urls = [`${SITE_URL}/`]

  // Get active categories
  const { data: categories, error: categoryError } = await supabase
    .from('categories')
    .select('id, slug')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (categoryError) {
    throw categoryError
  }

  for (const category of categories) {
    urls.push(
      `${SITE_URL}/category/${category.slug}`
    )
  }

  // Get active items
  const { data: items, error: itemError } = await supabase
    .from('items')
    .select('slug, category_id')
    .eq('is_active', true)

  if (itemError) {
    throw itemError
  }

  const categoryMap = new Map(
    categories.map(category => [
      category.id,
      category.slug
    ])
  )

  for (const item of items) {
    const categorySlug = categoryMap.get(item.category_id)

    if (!categorySlug) {
      continue
    }

    urls.push(
      `${SITE_URL}/category/${categorySlug}/item/${item.slug}`
    )
  }

  const today = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
  </url>`).join('\n')}

</urlset>`

  fs.writeFileSync(
    './public/sitemap.xml',
    xml,
    'utf8'
  )

  console.log(`Sitemap generated with ${urls.length} URLs.`)
}

generateSitemap().catch(error => {
  console.error('Sitemap generation failed:')
  console.error(error)
  process.exit(1)
})
