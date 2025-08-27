import { ContentBlock, Category } from './types'

// Block validation utilities
export function validateBlock(block: Partial<ContentBlock>): string[] {
  const errors: string[] = []

  if (!block.id || block.id.trim() === '') {
    errors.push('Block ID is required')
  } else if (!/^[a-z0-9-]+$/.test(block.id)) {
    errors.push('Block ID must contain only lowercase letters, numbers, and hyphens')
  }

  if (!block.type || !['benefit', 'cta', 'faq', 'promo', 'info'].includes(block.type)) {
    errors.push('Block type must be one of: benefit, cta, faq, promo, info')
  }

  if (!block.title || block.title.trim() === '') {
    errors.push('Block title is required')
  } else if (block.title.length > 100) {
    errors.push('Block title must be 100 characters or less')
  }

  if (!block.body || block.body.trim() === '') {
    errors.push('Block body is required')
  } else if (block.body.length > 1000) {
    errors.push('Block body must be 1000 characters or less')
  }

  if (typeof block.weight !== 'number' || block.weight < 1 || block.weight > 100) {
    errors.push('Block weight must be a number between 1 and 100')
  }

  if (!block.locale || block.locale.trim() === '') {
    errors.push('Block locale is required')
  }

  if (block.constraints) {
    if (block.constraints.slots && !Array.isArray(block.constraints.slots)) {
      errors.push('Slots must be an array')
    }
    if (block.constraints.categories && !Array.isArray(block.constraints.categories)) {
      errors.push('Categories must be an array')
    }
    if (block.constraints.mutually_exclusive && !Array.isArray(block.constraints.mutually_exclusive)) {
      errors.push('Mutually exclusive must be an array')
    }
  }

  return errors
}

// Constraint validation utilities
export function validateBlockConstraints(block: ContentBlock, allBlocks: ContentBlock[]): string[] {
  const errors: string[] = []

  // Check for mutually exclusive conflicts
  if (block.constraints?.mutually_exclusive) {
    const conflictingBlocks = allBlocks.filter(b => 
      b.id !== block.id && 
      b.constraints?.mutually_exclusive?.includes(block.id)
    )
    
    if (conflictingBlocks.length > 0) {
      errors.push(`Block conflicts with mutually exclusive blocks: ${conflictingBlocks.map(b => b.id).join(', ')}`)
    }
  }

  // Check for duplicate slots in same category
  if (block.constraints?.slots && block.constraints?.categories) {
    const sameCategoryBlocks = allBlocks.filter(b => 
      b.id !== block.id && 
      b.constraints?.categories?.some(cat => block.constraints?.categories?.includes(cat))
    )

    for (const slot of block.constraints.slots) {
      const slotConflicts = sameCategoryBlocks.filter(b => 
        b.constraints?.slots?.includes(slot)
      )
      
      if (slotConflicts.length > 0) {
        errors.push(`Slot "${slot}" already used by blocks: ${slotConflicts.map(b => b.id).join(', ')}`)
      }
    }
  }

  return errors
}

// Block management utilities
export function getBlocksByType(blocks: ContentBlock[], type: string): ContentBlock[] {
  return blocks.filter(block => block.type === type)
}

export function getBlocksByLocale(blocks: ContentBlock[], locale: string): ContentBlock[] {
  return blocks.filter(block => block.locale === locale)
}

export function getBlocksByCategory(blocks: ContentBlock[], categoryId: string): ContentBlock[] {
  return blocks.filter(block => 
    block.constraints?.categories?.includes(categoryId)
  )
}

export function getBlocksBySlot(blocks: ContentBlock[], slot: string): ContentBlock[] {
  return blocks.filter(block => 
    block.constraints?.slots?.includes(slot)
  )
}

export function getReviewedBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.filter(block => block.reviewed)
}

export function getUnreviewedBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.filter(block => !block.reviewed)
}

// Block selection utilities for deterministic rotation
export function selectBlocksForPage(
  blocks: ContentBlock[], 
  category: Category, 
  pageIdentifier: string, 
  slots: string[] = ['benefits', 'cta', 'faq', 'promo', 'info'],
  maxBlocksPerSlot: number = 3
): Record<string, ContentBlock[]> {
  const selectedBlocks: Record<string, ContentBlock[]> = {}
  
  // Filter blocks for this category and locale
  const categoryBlocks = getBlocksByCategory(blocks, category.id)
  const reviewedBlocks = getReviewedBlocks(categoryBlocks)
  
  for (const slot of slots) {
    const slotBlocks = getBlocksBySlot(reviewedBlocks, slot)
    
    if (slotBlocks.length > 0) {
      // Use deterministic selection based on page identifier
      const selected = selectBlocksDeterministically(slotBlocks, pageIdentifier, maxBlocksPerSlot)
      selectedBlocks[slot] = selected
    } else {
      selectedBlocks[slot] = []
    }
  }
  
  return selectedBlocks
}

function selectBlocksDeterministically(
  blocks: ContentBlock[], 
  pageIdentifier: string, 
  maxCount: number
): ContentBlock[] {
  // Create a seed from the page identifier
  const seed = generateSeedFromString(pageIdentifier)
  const shuffled = shuffleWithSeed([...blocks], seed)
  
  // Sort by weight (higher weight = higher priority)
  const sorted = shuffled.sort((a, b) => b.weight - a.weight)
  
  return sorted.slice(0, maxCount)
}

function generateSeedFromString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  const random = seededRandom(seed)
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

// Block statistics utilities
export function getBlockStatistics(blocks: ContentBlock[]): {
  total: number
  byType: Record<string, number>
  byLocale: Record<string, number>
  reviewed: number
  unreviewed: number
  byCategory: Record<string, number>
} {
  const stats = {
    total: blocks.length,
    byType: {} as Record<string, number>,
    byLocale: {} as Record<string, number>,
    reviewed: getReviewedBlocks(blocks).length,
    unreviewed: getUnreviewedBlocks(blocks).length,
    byCategory: {} as Record<string, number>
  }

  // Count by type
  blocks.forEach(block => {
    stats.byType[block.type] = (stats.byType[block.type] || 0) + 1
  })

  // Count by locale
  blocks.forEach(block => {
    stats.byLocale[block.locale] = (stats.byLocale[block.locale] || 0) + 1
  })

  // Count by category
  blocks.forEach(block => {
    block.constraints?.categories?.forEach(category => {
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
    })
  })

  return stats
}

// Block export/import utilities
export function exportBlocks(blocks: ContentBlock[]): string {
  return JSON.stringify(blocks, null, 2)
}

export function importBlocks(jsonString: string): ContentBlock[] {
  try {
    const blocks = JSON.parse(jsonString) as ContentBlock[]
    
    // Validate all blocks
    const errors: string[] = []
    blocks.forEach((block, index) => {
      const blockErrors = validateBlock(block)
      if (blockErrors.length > 0) {
        errors.push(`Block ${index + 1} (${block.id}): ${blockErrors.join(', ')}`)
      }
    })
    
    if (errors.length > 0) {
      throw new Error(`Import validation failed:\n${errors.join('\n')}`)
    }
    
    return blocks
  } catch (error) {
    throw new Error(`Failed to parse blocks: ${error}`)
  }
}
