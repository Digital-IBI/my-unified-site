'use client'

import { ContentBlock } from '@/lib/types'
import { useState, useEffect } from 'react'
import BenefitBlock from './BenefitBlock'
import CtaBlock from './CtaBlock'
import FaqBlock from './FaqBlock'
import PromoBlock from './PromoBlock'
import InfoBlock from './InfoBlock'

interface ContentBlockRendererProps {
  blocks: ContentBlock[]
  slots?: string[]
  maxBlocks?: number
}

export default function ContentBlockRenderer({ 
  blocks, 
  slots = ['benefits', 'cta', 'faq', 'promo', 'info'],
  maxBlocks = 10 
}: ContentBlockRendererProps) {
  const [selectedBlocks, setSelectedBlocks] = useState<ContentBlock[]>([])

  useEffect(() => {
    // Deterministic block selection based on current page and build SHA
    const selected = selectBlocksDeterministically(blocks, slots, maxBlocks)
    setSelectedBlocks(selected)
  }, [blocks, slots, maxBlocks])

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'benefit':
        return <BenefitBlock key={block.id} block={block} />
      case 'cta':
        return <CtaBlock key={block.id} block={block} />
      case 'faq':
        return <FaqBlock key={block.id} block={block} />
      case 'promo':
        return <PromoBlock key={block.id} block={block} />
      case 'info':
        return <InfoBlock key={block.id} block={block} />
      default:
        return <InfoBlock key={block.id} block={block} />
    }
  }

  if (selectedBlocks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No content blocks available for this page.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {selectedBlocks.map(renderBlock)}
    </div>
  )
}

// Deterministic block selection algorithm
function selectBlocksDeterministically(
  blocks: ContentBlock[], 
  slots: string[], 
  maxBlocks: number
): ContentBlock[] {
  // Filter blocks by slots and reviewed status
  const eligibleBlocks = blocks.filter(block => 
    block.reviewed && 
    (!block.constraints?.slots || 
     block.constraints.slots.some(slot => slots.includes(slot)))
  )

  if (eligibleBlocks.length === 0) return []

  // Create a simple deterministic seed based on current page
  const seed = generateSeed()
  const shuffled = shuffleWithSeed(eligibleBlocks, seed)

  // Apply constraints and select blocks
  const selected: ContentBlock[] = []
  const usedIds = new Set<string>()

  for (const block of shuffled) {
    if (selected.length >= maxBlocks) break

    // Check mutually exclusive constraints
    if (block.constraints?.mutually_exclusive) {
      const hasConflict = block.constraints.mutually_exclusive.some(id => usedIds.has(id))
      if (hasConflict) continue
    }

    selected.push(block)
    usedIds.add(block.id)
  }

  return selected
}

// Generate a deterministic seed based on current page
function generateSeed(): number {
  // In a real implementation, this would use the page URL and build SHA
  // For now, we'll use a simple hash of the current URL
  const url = typeof window !== 'undefined' ? window.location.href : ''
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Fisher-Yates shuffle with seed
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  let currentSeed = seed

  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280
    const j = Math.floor((currentSeed / 233280) * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}
