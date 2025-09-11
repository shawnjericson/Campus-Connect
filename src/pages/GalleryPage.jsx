import { useState, useEffect } from 'react'
import { Search, Filter, Calendar, Camera, Eye, X, Grid, List, Image as ImageIcon } from 'lucide-react'

function GalleryPage() {
  const [galleryData, setGalleryData] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [viewMode, setViewMode] = useState('category') // 'category' or 'year'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)

  // Load gallery data from JSON
  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/gallery-images.json')
        if (!response.ok) throw new Error('Failed to load gallery data')
        const data = await response.json()
        setGalleryData(data.images || [])
        setFilteredImages(data.images || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadGalleryData()
  }, [])

  // Filter and organize images
  useEffect(() => {
    let filtered = [...galleryData]

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(image =>
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(image => image.category === selectedCategory)
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(image => image.year === selectedYear)
    }

    setFilteredImages(filtered)
  }, [galleryData, searchQuery, selectedCategory, selectedYear])

  // Get unique categories and years for filters
  const categories = [...new Set(galleryData.map(img => img.category))]
  const years = [...new Set(galleryData.map(img => img.year))].sort().reverse()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading gallery: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-900 text-white rounded-xl hover:bg-red-800 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Group images by category or year
  const groupedImages = () => {
    const groups = {}

    filteredImages.forEach(image => {
      const key = viewMode === 'category' ? image.category : image.year
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(image)
    })

    return groups
  }

  // Image Modal Component
  const ImageModal = ({ image, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <img
          src={image.url}
          alt={image.title}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 rounded-b-lg">
          <h3 className="text-xl font-bold mb-2">{image.title}</h3>
          <p className="text-sm text-gray-300 mb-1">{image.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Photo by {image.photographer}</span>
            <span>{new Date(image.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
            <Camera className="w-4 h-4 text-red-900" />
            <span className="text-red-900 text-sm font-medium tracking-wider">PHOTO GALLERY</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-red-900">
              Event Gallery
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Visual memories from our campus events • Explore moments organized by year and category
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex justify-center space-x-1 bg-white p-1 rounded-xl shadow-sm w-fit mx-auto border border-gray-200">
            <button
              onClick={() => setViewMode('category')}
              className={`py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                viewMode === 'category'
                  ? 'bg-red-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>By Category</span>
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                viewMode === 'year'
                  ? 'bg-red-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>By Year</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search images by title, event, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white text-gray-900 min-w-[140px]"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category} Events
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white text-gray-900 min-w-[120px]"
                  >
                    <option value="all">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-red-900">{filteredImages.length}</span> images
                {selectedCategory !== 'all' && (
                  <span> in <span className="font-semibold">{selectedCategory}</span> category</span>
                )}
                {selectedYear !== 'all' && (
                  <span> from <span className="font-semibold">{selectedYear}</span></span>
                )}
                {searchQuery && (
                  <span> matching "<span className="font-semibold">{searchQuery}</span>"</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Display */}
        <div className="max-w-7xl mx-auto">
          {filteredImages.length > 0 ? (
            <div className="space-y-12">
              {Object.entries(groupedImages()).map(([groupKey, images]) => (
                <div key={groupKey} className="space-y-6">
                  {/* Group Header */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {viewMode === 'category' ? (
                        <ImageIcon className="w-5 h-5 text-red-900" />
                      ) : (
                        <Calendar className="w-5 h-5 text-red-900" />
                      )}
                      <h2 className="text-2xl font-bold text-gray-900">
                        {viewMode === 'category' ? `${groupKey} Events` : `Academic Year ${groupKey}`}
                      </h2>
                    </div>
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {images.length} {images.length === 1 ? 'image' : 'images'}
                    </span>
                  </div>

                  {/* Images Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map(image => (
                      <div
                        key={image.id}
                        className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={image.thumbnail}
                            alt={image.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 bg-red-900 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {image.category}
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {image.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {image.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{image.event}</span>
                            <span>{new Date(image.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== 'all' || selectedYear !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Check back later for new gallery images'
                }
              </p>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  )
}

export default GalleryPage
