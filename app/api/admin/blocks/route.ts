import { NextRequest, NextResponse } from 'next/server'
import { ContentBlock } from '../../../../lib/types'
import { validateBlock, validateBlockConstraints } from '../../../../lib/blocks'

// In-memory storage for demonstration (replace with database in production)
let blocks: ContentBlock[] = [
  {
    id: 'benefit-fast',
    type: 'benefit',
    title: 'Fast & Reliable',
    body: 'Get instant currency conversion with real-time exchange rates. Our service is fast, reliable, and always up-to-date.',
    weight: 10,
    reviewed: true,
    locale: 'en',
    constraints: {
      slots: ['benefits'],
      categories: ['currency-converter']
    }
  },
  {
    id: 'benefit-secure',
    type: 'benefit',
    title: 'Secure & Private',
    body: 'Your currency conversion queries are completely private and secure. No personal data is stored or shared.',
    weight: 9,
    reviewed: true,
    locale: 'en',
    constraints: {
      slots: ['benefits'],
      categories: ['currency-converter']
    }
  },
  {
    id: 'cta-convert',
    type: 'cta',
    title: 'Start Converting Now',
    body: 'Ready to convert your currency? Use our reliable converter tool to get accurate exchange rates instantly.',
    weight: 8,
    reviewed: true,
    locale: 'en',
    constraints: {
      slots: ['cta'],
      categories: ['currency-converter']
    }
  },
  {
    id: 'faq-how-to',
    type: 'faq',
    title: 'How to use the currency converter?',
    body: 'Simply enter the amount you want to convert, select the source and target currencies, and click convert. The result will be displayed instantly with the current exchange rate.',
    weight: 7,
    reviewed: true,
    locale: 'en',
    constraints: {
      slots: ['faq'],
      categories: ['currency-converter']
    }
  },
  {
    id: 'promo-accurate',
    type: 'promo',
    title: 'Most Accurate Rates',
    body: 'Our currency converter uses real-time exchange rates from reliable financial sources to ensure accuracy.',
    weight: 6,
    reviewed: true,
    locale: 'en',
    constraints: {
      slots: ['promo'],
      categories: ['currency-converter']
    }
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const locale = searchParams.get('locale')
  const category = searchParams.get('category')
  const reviewed = searchParams.get('reviewed')

  let filteredBlocks = [...blocks]

  if (type) {
    filteredBlocks = filteredBlocks.filter(block => block.type === type)
  }

  if (locale) {
    filteredBlocks = filteredBlocks.filter(block => block.locale === locale)
  }

  if (category) {
    filteredBlocks = filteredBlocks.filter(block => 
      block.constraints?.categories?.includes(category)
    )
  }

  if (reviewed !== null) {
    const isReviewed = reviewed === 'true'
    filteredBlocks = filteredBlocks.filter(block => block.reviewed === isReviewed)
  }

  return NextResponse.json({ 
    blocks: filteredBlocks,
    total: filteredBlocks.length,
    types: ['benefit', 'cta', 'faq', 'promo', 'info'],
    slots: ['benefits', 'cta', 'faq', 'promo', 'info']
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newBlock: Partial<ContentBlock> = {
      ...body,
      id: body.id || `block-${Date.now()}`,
      reviewed: body.reviewed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Validate the block
    const validationErrors = validateBlock(newBlock)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // Check for duplicate ID
    if (blocks.find(b => b.id === newBlock.id)) {
      return NextResponse.json(
        { error: 'Block with this ID already exists' },
        { status: 409 }
      )
    }

    // Validate constraints
    const constraintErrors = validateBlockConstraints(newBlock as ContentBlock, blocks)
    if (constraintErrors.length > 0) {
      return NextResponse.json(
        { error: 'Constraint validation failed', details: constraintErrors },
        { status: 400 }
      )
    }

    const block = newBlock as ContentBlock
    blocks.push(block)

    return NextResponse.json({ 
      block,
      message: 'Block created successfully' 
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Block ID is required' },
        { status: 400 }
      )
    }

    const blockIndex = blocks.findIndex(b => b.id === id)
    if (blockIndex === -1) {
      return NextResponse.json(
        { error: 'Block not found' },
        { status: 404 }
      )
    }

    const updatedBlock: ContentBlock = {
      ...blocks[blockIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    // Validate the updated block
    const validationErrors = validateBlock(updatedBlock)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // Validate constraints
    const otherBlocks = blocks.filter(b => b.id !== id)
    const constraintErrors = validateBlockConstraints(updatedBlock, otherBlocks)
    if (constraintErrors.length > 0) {
      return NextResponse.json(
        { error: 'Constraint validation failed', details: constraintErrors },
        { status: 400 }
      )
    }

    blocks[blockIndex] = updatedBlock

    return NextResponse.json({ 
      block: updatedBlock,
      message: 'Block updated successfully' 
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Block ID is required' },
      { status: 400 }
    )
  }

  const blockIndex = blocks.findIndex(b => b.id === id)
  if (blockIndex === -1) {
    return NextResponse.json(
      { error: 'Block not found' },
      { status: 404 }
    )
  }

  const deletedBlock = blocks[blockIndex]
  blocks.splice(blockIndex, 1)

  return NextResponse.json({ 
    message: 'Block deleted successfully',
    deletedBlock
  })
}
