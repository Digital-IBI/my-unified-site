// Performance Optimization Guardrails
export const PERFORMANCE_GUARDRAILS = {
  // Core Web Vitals
  LCP_THRESHOLD: 2500, // ms (Largest Contentful Paint)
  FID_THRESHOLD: 100, // ms (First Input Delay)
  CLS_THRESHOLD: 0.1, // Cumulative Layout Shift
  TTFB_THRESHOLD: 600, // ms (Time to First Byte)
  
  // Build Performance
  BUILD_TIME_THRESHOLD: 300, // seconds
  BUNDLE_SIZE_THRESHOLD: 500, // KB
  PAGE_SIZE_THRESHOLD: 200, // KB
  
  // Memory Usage
  MEMORY_USAGE_THRESHOLD: 50, // MB
  
  // Image Optimization
  MAX_IMAGE_SIZE: 500, // KB
  IMAGE_FORMATS: ['webp', 'avif', 'jpg', 'png'],
  
  // Caching
  CACHE_DURATION: 86400, // 24 hours in seconds
} as const

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number
  fid?: number
  cls?: number
  ttfb?: number
  
  // Build Metrics
  buildTime?: number
  bundleSize?: number
  pageSize?: number
  
  // Memory
  memoryUsage?: number
  
  // Custom Metrics
  firstPaint?: number
  firstContentfulPaint?: number
  domContentLoaded?: number
  loadComplete?: number
}

export interface PerformanceReport {
  score: number // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  metrics: PerformanceMetrics
  issues: string[]
  recommendations: string[]
  isOptimized: boolean
}

// Calculate performance score based on metrics
export function calculatePerformanceScore(metrics: PerformanceMetrics): PerformanceReport {
  const issues: string[] = []
  const recommendations: string[] = []
  let score = 100

  // LCP (Largest Contentful Paint)
  if (metrics.lcp) {
    if (metrics.lcp > PERFORMANCE_GUARDRAILS.LCP_THRESHOLD) {
      issues.push(`LCP too slow: ${metrics.lcp}ms (target: ${PERFORMANCE_GUARDRAILS.LCP_THRESHOLD}ms)`)
      score -= 25
      recommendations.push('Optimize images, use next/image, implement lazy loading')
    }
  }

  // FID (First Input Delay)
  if (metrics.fid) {
    if (metrics.fid > PERFORMANCE_GUARDRAILS.FID_THRESHOLD) {
      issues.push(`FID too slow: ${metrics.fid}ms (target: ${PERFORMANCE_GUARDRAILS.FID_THRESHOLD}ms)`)
      score -= 25
      recommendations.push('Reduce JavaScript bundle size, implement code splitting')
    }
  }

  // CLS (Cumulative Layout Shift)
  if (metrics.cls) {
    if (metrics.cls > PERFORMANCE_GUARDRAILS.CLS_THRESHOLD) {
      issues.push(`CLS too high: ${metrics.cls} (target: ${PERFORMANCE_GUARDRAILS.CLS_THRESHOLD})`)
      score -= 20
      recommendations.push('Set explicit dimensions for images and media elements')
    }
  }

  // TTFB (Time to First Byte)
  if (metrics.ttfb) {
    if (metrics.ttfb > PERFORMANCE_GUARDRAILS.TTFB_THRESHOLD) {
      issues.push(`TTFB too slow: ${metrics.ttfb}ms (target: ${PERFORMANCE_GUARDRAILS.TTFB_THRESHOLD}ms)`)
      score -= 15
      recommendations.push('Optimize server response time, use CDN, implement caching')
    }
  }

  // Bundle Size
  if (metrics.bundleSize) {
    if (metrics.bundleSize > PERFORMANCE_GUARDRAILS.BUNDLE_SIZE_THRESHOLD) {
      issues.push(`Bundle size too large: ${metrics.bundleSize}KB (target: ${PERFORMANCE_GUARDRAILS.BUNDLE_SIZE_THRESHOLD}KB)`)
      score -= 10
      recommendations.push('Implement code splitting, remove unused dependencies')
    }
  }

  // Build Time
  if (metrics.buildTime) {
    if (metrics.buildTime > PERFORMANCE_GUARDRAILS.BUILD_TIME_THRESHOLD) {
      issues.push(`Build time too slow: ${metrics.buildTime}s (target: ${PERFORMANCE_GUARDRAILS.BUILD_TIME_THRESHOLD}s)`)
      score -= 5
      recommendations.push('Optimize build process, use incremental builds')
    }
  }

  // Memory Usage
  if (metrics.memoryUsage) {
    if (metrics.memoryUsage > PERFORMANCE_GUARDRAILS.MEMORY_USAGE_THRESHOLD) {
      issues.push(`Memory usage too high: ${metrics.memoryUsage}MB (target: ${PERFORMANCE_GUARDRAILS.MEMORY_USAGE_THRESHOLD}MB)`)
      score -= 5
      recommendations.push('Optimize memory usage, implement garbage collection')
    }
  }

  // Calculate grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F'
  if (score >= 90) grade = 'A'
  else if (score >= 80) grade = 'B'
  else if (score >= 70) grade = 'C'
  else if (score >= 60) grade = 'D'
  else grade = 'F'

  return {
    score: Math.max(0, score),
    grade,
    metrics,
    issues,
    recommendations,
    isOptimized: score >= 80
  }
}

// Performance optimization utilities
export function optimizeImages(): string[] {
  return [
    'Use next/image component for automatic optimization',
    'Implement responsive images with srcset',
    'Convert images to WebP/AVIF format',
    'Implement lazy loading for images below the fold',
    'Use appropriate image sizes for different viewports'
  ]
}

export function optimizeJavaScript(): string[] {
  return [
    'Implement code splitting with dynamic imports',
    'Use React.lazy() for component-level splitting',
    'Remove unused dependencies',
    'Minify and compress JavaScript bundles',
    'Implement tree shaking for unused code elimination'
  ]
}

export function optimizeCSS(): string[] {
  return [
    'Use CSS-in-JS with proper optimization',
    'Implement critical CSS inlining',
    'Remove unused CSS with PurgeCSS',
    'Minify and compress CSS files',
    'Use CSS custom properties for better performance'
  ]
}

export function optimizeBuild(): string[] {
  return [
    'Enable Next.js build optimizations',
    'Use incremental builds where possible',
    'Implement proper caching strategies',
    'Optimize webpack configuration',
    'Use build-time code analysis tools'
  ]
}

export function optimizeCaching(): string[] {
  return [
    'Implement proper HTTP caching headers',
    'Use Next.js built-in caching mechanisms',
    'Implement service worker for offline caching',
    'Use CDN for static assets',
    'Implement browser caching strategies'
  ]
}

// Performance monitoring utilities
export function getPerformanceMetrics(): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({})
      return
    }

    const metrics: PerformanceMetrics = {}

    // Get Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        metrics.lcp = lastEntry.startTime
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const entry = entries[0] as any
        metrics.fid = entry.processingStart - entry.startTime
      }).observe({ entryTypes: ['first-input'] })

      // CLS
      let clsValue = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value
          }
        }
        metrics.cls = clsValue
      }).observe({ entryTypes: ['layout-shift'] })
    }

    // Get navigation timing
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.requestStart
        metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
        metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart
      }
    }

    // Get paint timing
    if ('performance' in window) {
      const paint = performance.getEntriesByType('paint')
      paint.forEach((entry) => {
        if (entry.name === 'first-paint') {
          metrics.firstPaint = entry.startTime
        }
        if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime
        }
      })
    }

    // Get memory usage (if available)
    if ('memory' in performance) {
      metrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
    }

    resolve(metrics)
  })
}

// Bundle analyzer utilities
export function analyzeBundleSize(bundleStats: any): {
  totalSize: number
  largestChunks: Array<{ name: string; size: number }>
  recommendations: string[]
} {
  const chunks = bundleStats.chunks || []
  const largestChunks = chunks
    .map((chunk: any) => ({
      name: chunk.name,
      size: chunk.size
    }))
    .sort((a: any, b: any) => b.size - a.size)
    .slice(0, 5)

  const totalSize = chunks.reduce((sum: number, chunk: any) => sum + chunk.size, 0)
  const recommendations: string[] = []

  if (totalSize > PERFORMANCE_GUARDRAILS.BUNDLE_SIZE_THRESHOLD * 1024) {
    recommendations.push('Bundle size exceeds threshold, consider code splitting')
  }

  largestChunks.forEach((chunk: any) => {
    if (chunk.size > 100 * 1024) { // 100KB
      recommendations.push(`Large chunk detected: ${chunk.name} (${Math.round(chunk.size / 1024)}KB)`)
    }
  })

  return {
    totalSize,
    largestChunks,
    recommendations
  }
}
