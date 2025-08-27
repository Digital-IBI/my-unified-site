'use client'

import { useState, useEffect } from 'react'
import { Upload, Download, Plus, Trash2, Save, X, Globe, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface Locale {
  code: string
  name: string
  nativeName: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
}

const AVAILABLE_LOCALES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' }
]

export default function LocaleManagement() {
  const [locales, setLocales] = useState<Locale[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedLocale, setSelectedLocale] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)

  useEffect(() => {
    fetchLocales()
  }, [])

  const fetchLocales = async () => {
    try {
      const response = await fetch('/api/admin/locales')
      const data = await response.json()
      if (data.locales) {
        setLocales(data.locales)
      }
    } catch (error) {
      setError('Failed to fetch locales')
    } finally {
      setLoading(false)
    }
  }

  const handleAddLocale = async () => {
    if (!selectedLocale) {
      setError('Please select a locale')
      return
    }

    const localeData = AVAILABLE_LOCALES.find(l => l.code === selectedLocale)
    if (!localeData) {
      setError('Invalid locale selected')
      return
    }

    try {
      const response = await fetch('/api/admin/locales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: localeData.code,
          name: localeData.name,
          nativeName: localeData.nativeName,
          isActive: true,
          isDefault: locales.length === 0 // First locale becomes default
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to add locale')
        return
      }

      setSuccess('Locale added successfully')
      setShowAddForm(false)
      setSelectedLocale('')
      fetchLocales()
    } catch (error) {
      setError('Failed to add locale')
    }
  }

  const handleToggleActive = async (locale: Locale) => {
    try {
      const response = await fetch('/api/admin/locales', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...locale,
          isActive: !locale.isActive
        })
      })

      if (response.ok) {
        setSuccess('Locale updated successfully')
        fetchLocales()
      } else {
        setError('Failed to update locale')
      }
    } catch (error) {
      setError('Failed to update locale')
    }
  }

  const handleSetDefault = async (locale: Locale) => {
    try {
      const response = await fetch('/api/admin/locales/default', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: locale.code })
      })

      if (response.ok) {
        setSuccess('Default locale updated successfully')
        fetchLocales()
      } else {
        setError('Failed to update default locale')
      }
    } catch (error) {
      setError('Failed to update default locale')
    }
  }

  const handleDeleteLocale = async (code: string) => {
    if (!confirm('Are you sure you want to delete this locale? This will affect all categories using this locale.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/locales?code=${code}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSuccess('Locale deleted successfully')
        fetchLocales()
      } else {
        setError('Failed to delete locale')
      }
    } catch (error) {
      setError('Failed to delete locale')
    }
  }

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!csvFile) {
      setError('Please select a CSV file')
      return
    }

    const formData = new FormData()
    formData.append('file', csvFile)

    try {
      const response = await fetch('/api/admin/locales/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to upload CSV')
        return
      }

      setSuccess(`Successfully imported ${data.imported} locales`)
      setCsvFile(null)
      fetchLocales()
    } catch (error) {
      setError('Failed to upload CSV')
    }
  }

  const handleExportCsv = async () => {
    try {
      const response = await fetch('/api/admin/locales/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'locales.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      setError('Failed to export CSV')
    }
  }

  const resetForm = () => {
    setShowAddForm(false)
    setSelectedLocale('')
    setCsvFile(null)
    setError(null)
    setSuccess(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locale Management</h1>
            <p className="text-gray-600 mt-2">Manage site locales and language settings</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Locale
            </button>
            <button
              onClick={handleExportCsv}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* CSV Upload Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Locales from CSV
          </h2>
          <form onSubmit={handleCsvUpload} className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!csvFile}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-2">
            CSV should have columns: code, name, nativeName (optional)
          </p>
        </div>

        {/* Add Locale Form */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Add New Locale
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedLocale}
                onChange={(e) => setSelectedLocale(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a locale</option>
                {AVAILABLE_LOCALES
                  .filter(locale => !locales.find(l => l.code === locale.code))
                  .map(locale => (
                    <option key={locale.code} value={locale.code}>
                      {locale.name} ({locale.nativeName})
                    </option>
                  ))}
              </select>
              <button
                onClick={handleAddLocale}
                disabled={!selectedLocale}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        )}

        {/* Locales Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locales.map((locale) => (
            <div
              key={locale.code}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${
                locale.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{locale.name}</h3>
                  <p className="text-sm text-gray-600">{locale.nativeName}</p>
                  <p className="text-xs text-gray-500 font-mono">{locale.code}</p>
                </div>
                <div className="flex items-center gap-2">
                  {locale.isDefault && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    locale.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {locale.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleToggleActive(locale)}
                  className={`w-full text-sm px-3 py-2 rounded-md transition-colors ${
                    locale.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {locale.isActive ? 'Deactivate' : 'Activate'}
                </button>
                
                {!locale.isDefault && (
                  <button
                    onClick={() => handleSetDefault(locale)}
                    className="w-full text-sm px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    Set as Default
                  </button>
                )}

                <button
                  onClick={() => handleDeleteLocale(locale.code)}
                  className="w-full text-sm px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {locales.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locales configured</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first locale</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add First Locale
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
