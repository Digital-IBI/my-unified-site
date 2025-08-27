'use client'

import { useState, useEffect } from 'react'
import { ContentBlock } from '@/lib/types'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Filter, 
  Download, 
  Upload,
  CheckCircle,
  AlertCircle,
  Settings,
  FileText,
  MessageSquare,
  Star,
  Info
} from 'lucide-react'

interface BlockFormData {
  id: string
  type: 'benefit' | 'cta' | 'faq' | 'promo' | 'info'
  title: string
  body: string
  weight: number
  locale: string
  reviewed: boolean
  constraints: {
    slots: string[]
    categories: string[]
    mutually_exclusive: string[]
  }
  media?: {
    image?: string
    alt?: string
  }
}

const BLOCK_TYPES = [
  { value: 'benefit', label: 'Benefit', icon: Star, color: 'text-green-600' },
  { value: 'cta', label: 'Call to Action', icon: MessageSquare, color: 'text-blue-600' },
  { value: 'faq', label: 'FAQ', icon: FileText, color: 'text-purple-600' },
  { value: 'promo', label: 'Promotion', icon: CheckCircle, color: 'text-orange-600' },
  { value: 'info', label: 'Information', icon: Info, color: 'text-gray-600' }
]

const SLOTS = ['benefits', 'cta', 'faq', 'promo', 'info']
const LOCALES = ['en', 'hi', 'fr', 'es', 'de']

export default function BlocksManagement() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const [formData, setFormData] = useState<BlockFormData>({
    id: '',
    type: 'benefit',
    title: '',
    body: '',
    weight: 10,
    locale: 'en',
    reviewed: false,
    constraints: {
      slots: [],
      categories: [],
      mutually_exclusive: []
    }
  })

  // Filters
  const [filters, setFilters] = useState({
    type: '',
    locale: '',
    category: '',
    reviewed: null as boolean | null,
    search: ''
  })

  useEffect(() => {
    fetchBlocks()
    fetchCategories()
  }, [])

  const fetchBlocks = async () => {
    try {
      const response = await fetch('/api/admin/blocks')
      const data = await response.json()
      setBlocks(data.blocks || [])
    } catch (error) {
      console.error('Failed to fetch blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingBlock ? '/api/admin/blocks' : '/api/admin/blocks'
      const method = editingBlock ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchBlocks()
        resetForm()
        setShowForm(false)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to save block:', error)
      alert('Failed to save block')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return
    
    try {
      const response = await fetch(`/api/admin/blocks?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchBlocks()
      } else {
        alert('Failed to delete block')
      }
    } catch (error) {
      console.error('Failed to delete block:', error)
      alert('Failed to delete block')
    }
  }

  const handleEdit = (block: ContentBlock) => {
    setEditingBlock(block)
    setFormData({
      id: block.id,
      type: block.type,
      title: block.title,
      body: block.body,
      weight: block.weight,
      locale: block.locale,
      reviewed: block.reviewed,
      constraints: {
        slots: block.constraints?.slots || [],
        categories: block.constraints?.categories || [],
        mutually_exclusive: block.constraints?.mutually_exclusive || []
      },
      media: block.media
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      id: '',
      type: 'benefit',
      title: '',
      body: '',
      weight: 10,
      locale: 'en',
      reviewed: false,
      constraints: {
        slots: [],
        categories: [],
        mutually_exclusive: []
      }
    })
    setEditingBlock(null)
  }

  const filteredBlocks = blocks.filter(block => {
    if (filters.type && block.type !== filters.type) return false
    if (filters.locale && block.locale !== filters.locale) return false
    if (filters.category && !block.constraints?.categories?.includes(filters.category)) return false
    if (filters.reviewed !== null && block.reviewed !== filters.reviewed) return false
    if (filters.search && !block.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const getBlockTypeInfo = (type: string) => {
    return BLOCK_TYPES.find(t => t.value === type) || BLOCK_TYPES[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blocks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Blocks</h1>
              <p className="mt-2 text-gray-600">
                Manage content blocks for deterministic page generation
              </p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Block
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Blocks</p>
                <p className="text-2xl font-bold text-gray-900">{blocks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {blocks.filter(b => b.reviewed).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {blocks.filter(b => !b.reviewed).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Types</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(blocks.map(b => b.type)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {BLOCK_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locale</label>
              <select
                value={filters.locale}
                onChange={(e) => setFilters({ ...filters, locale: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locales</option>
                {LOCALES.map(locale => (
                  <option key={locale} value={locale}>{locale.toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.reviewed === null ? '' : filters.reviewed.toString()}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  reviewed: e.target.value === '' ? null : e.target.value === 'true' 
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="true">Reviewed</option>
                <option value="false">Pending Review</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search blocks..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  type: '',
                  locale: '',
                  category: '',
                  reviewed: null,
                  search: ''
                })}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Blocks List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Blocks ({filteredBlocks.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredBlocks.map((block) => {
              const typeInfo = getBlockTypeInfo(block.type)
              const Icon = typeInfo.icon
              
              return (
                <div key={block.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Icon className={`w-5 h-5 mr-2 ${typeInfo.color}`} />
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${typeInfo.color} bg-opacity-10`}>
                          {typeInfo.label}
                        </span>
                        {block.reviewed ? (
                          <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-orange-600 ml-2" />
                        )}
                        <span className="text-sm text-gray-500 ml-2">Weight: {block.weight}</span>
                        <span className="text-sm text-gray-500 ml-2">Locale: {block.locale.toUpperCase()}</span>
                      </div>
                      
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{block.title}</h4>
                      <p className="text-gray-600 mb-3 line-clamp-2">{block.body}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {block.constraints?.slots?.map(slot => (
                          <span key={slot} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {slot}
                          </span>
                        ))}
                        {block.constraints?.categories?.map(catId => {
                          const category = categories.find(c => c.id === catId)
                          return (
                            <span key={catId} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {category?.name || catId}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(block)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit block"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(block.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {filteredBlocks.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks found</h3>
              <p className="text-gray-600 mb-4">
                {filters.search || filters.type || filters.locale || filters.category || filters.reviewed !== null
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first content block'
                }
              </p>
              {!filters.search && !filters.type && !filters.locale && !filters.category && filters.reviewed === null && (
                <button
                  onClick={() => {
                    resetForm()
                    setShowForm(true)
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Block
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Block Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingBlock ? 'Edit Block' : 'Create New Block'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Block ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="unique-block-id"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use lowercase letters, numbers, and hyphens only
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Block Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {BLOCK_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter block title"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter block content"
                  rows={4}
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.body.length}/1000 characters
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (1-100)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="100"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher weight = higher priority
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locale
                  </label>
                  <select
                    value={formData.locale}
                    onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {LOCALES.map(locale => (
                      <option key={locale} value={locale}>{locale.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.reviewed}
                      onChange={(e) => setFormData({ ...formData, reviewed: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Reviewed</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slots
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {SLOTS.map(slot => (
                    <label key={slot} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.constraints.slots.includes(slot)}
                        onChange={(e) => {
                          const newSlots = e.target.checked
                            ? [...formData.constraints.slots, slot]
                            : formData.constraints.slots.filter(s => s !== slot)
                          setFormData({
                            ...formData,
                            constraints: { ...formData.constraints, slots: newSlots }
                          })
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.constraints.categories.includes(category.id)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...formData.constraints.categories, category.id]
                            : formData.constraints.categories.filter(c => c !== category.id)
                          setFormData({
                            ...formData,
                            constraints: { ...formData.constraints, categories: newCategories }
                          })
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingBlock ? 'Update Block' : 'Create Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
