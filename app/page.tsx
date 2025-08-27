import Link from 'next/link'
import { fetchCategories } from '../lib/cms'

export default async function Home() {
  const categories = await fetchCategories()
  const activeCategories = categories.filter(cat => cat.isActive)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unified Programmatic Site
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Next.js on Netlify — CMS-as-data — Programmatic SEO
          </p>
          <p className="text-lg text-gray-700">
            Generic page generation system with configurable categories
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {category.name}
              </h2>
              <p className="text-gray-600 mb-4">
                Template: {category.templateType}
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  <strong>URL Pattern:</strong> {category.urlPattern}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Locales:</strong> {category.locales.join(', ')}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Priority:</strong> {category.priority}
                </p>
              </div>
              <div className="mt-4">
                              <Link
                href={`/en/${category.slug}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Category
              </Link>
              <Link
                href="/admin"
                className="inline-block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ml-2"
              >
                Admin Panel
              </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Admin panel at{' '}
            <Link href="/admin" className="text-blue-600 hover:underline">
              /admin
            </Link>
            {' '}• Ops panel at{' '}
            <Link href="/ops" className="text-blue-600 hover:underline">
              /ops
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
