'use client'

import React from 'react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [loadTime, setLoadTime] = useState<number | null>(null)

  useEffect(() => {
    const startTime = performance.now()
    
    const handleLoad = () => {
      const endTime = performance.now()
      const loadDuration = endTime - startTime
      setLoadTime(loadDuration)
      setIsLoading(false)
      onLoad?.()
      
      // Log performance metrics
      if (loadDuration > 1000) {
        console.warn(`Image load time exceeded 1s: ${loadDuration.toFixed(2)}ms for ${src}`)
      }
    }

    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
      onError?.()
    }

    // Create a temporary image to measure load time
    const img = new window.Image()
    img.onload = handleLoad
    img.onerror = handleError
    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, onLoad, onError])

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
      
      {/* Performance indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && loadTime && (
        <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
          {loadTime.toFixed(0)}ms
        </div>
      )}
    </div>
  )
}

// Lazy loaded version
export const LazyOptimizedImage = React.lazy(() => import('./OptimizedImage'))
