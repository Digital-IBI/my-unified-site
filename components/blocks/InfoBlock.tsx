'use client'

import { ContentBlock } from '@/lib/types'

interface InfoBlockProps {
  block: ContentBlock
}

export default function InfoBlock({ block }: InfoBlockProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {block.title}
      </h3>
      <div 
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: block.body }}
      />
      {block.media?.image && (
        <div className="mt-4">
          <img 
            src={block.media.image} 
            alt={block.media.alt || block.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  )
}
