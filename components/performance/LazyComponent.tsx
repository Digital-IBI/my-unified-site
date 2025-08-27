'use client'

import React, { Suspense, lazy, ComponentType } from 'react'

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
  [key: string]: any
}

export default function LazyComponent({ 
  component, 
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  ...props 
}: LazyComponentProps) {
  const LazyLoadedComponent = lazy(component)

  return (
    <Suspense fallback={fallback}>
      <LazyLoadedComponent {...props} />
    </Suspense>
  )
}

// Predefined lazy components for common use cases
export const LazyImage = lazy(() => import('./OptimizedImage'))
// export const LazyChart = lazy(() => import('./Chart'))
// export const LazyTable = lazy(() => import('./DataTable'))
// export const LazyForm = lazy(() => import('./Form'))

// Lazy loading hooks for performance monitoring
export function useLazyLoad<T>(
  loader: () => Promise<T>,
  deps: React.DependencyList = []
): [T | null, boolean, Error | null] {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await loader()
        
        if (mounted) {
          setData(result)
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, deps)

  return [data, loading, error]
}
