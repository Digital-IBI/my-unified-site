'use client'

import { ContentBlock } from '@/lib/types'

interface CtaBlockProps {
  block: ContentBlock
}

export default function CtaBlock({ block }: CtaBlockProps) {
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-lg text-center">
      <h3 className="text-2xl font-bold mb-4">
        {block.title}
      </h3>
      <div 
        className="text-green-100 mb-6 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: block.body }}
      />
      <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        Get Started
      </button>
    </div>
  )
}
