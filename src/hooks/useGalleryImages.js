import { useState, useEffect, useMemo } from 'react'
import { API_ENDPOINTS, ERROR_MESSAGES, GALLERY_CATEGORIES } from '../constants'

export const useGalleryImages = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(API_ENDPOINTS.EVENTS)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const eventsData = await response.json()

        // Extract gallery details from all events
        const allGalleryImages = []
        eventsData.events.forEach(event => {
          if (event.galleryDetails && event.galleryDetails.length > 0) {
            event.galleryDetails.forEach(image => {
              allGalleryImages.push({
                ...image,
                category: event.category,
                event: event.title,
                date: event.date,
                year: new Date(event.date).getFullYear().toString()
              })
            })
          }
        })

        setData({ images: allGalleryImages })
      } catch (err) {
        console.error('Error fetching gallery images:', err)
        setError(err.message || ERROR_MESSAGES.DATA_LOAD_ERROR)
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  // Memoized data extractions
  const images = useMemo(() => data?.images || [], [data])
  
  // Get unique categories and years for filters
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(images.map(img => img.category))]
    return [GALLERY_CATEGORIES.ALL, ...uniqueCategories]
  }, [images])

  const years = useMemo(() => {
    const uniqueYears = [...new Set(images.map(img => img.year))]
    return uniqueYears.sort().reverse()
  }, [images])

  const events = useMemo(() => {
    const uniqueEvents = [...new Set(images.map(img => img.event))]
    return uniqueEvents.filter(Boolean)
  }, [images])

  // Filter functions
  const getImagesByCategory = useMemo(() => {
    return (category) => {
      if (category === GALLERY_CATEGORIES.ALL) return images
      return images.filter(img => img.category === category)
    }
  }, [images])

  const getImagesByYear = useMemo(() => {
    return (year) => images.filter(img => img.year === year)
  }, [images])

  const getImagesByEvent = useMemo(() => {
    return (event) => images.filter(img => img.event === event)
  }, [images])

  const searchImages = useMemo(() => {
    return (query) => {
      if (!query) return images
      
      const searchTerm = query.toLowerCase()
      return images.filter(img =>
        img.title?.toLowerCase().includes(searchTerm) ||
        img.description?.toLowerCase().includes(searchTerm) ||
        img.event?.toLowerCase().includes(searchTerm) ||
        img.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }
  }, [images])

  // Combined filter function
  const filterImages = useMemo(() => {
    return ({ category, year, event, search }) => {
      let filtered = images

      if (category && category !== GALLERY_CATEGORIES.ALL) {
        filtered = filtered.filter(img => img.category === category)
      }

      if (year) {
        filtered = filtered.filter(img => img.year === year)
      }

      if (event) {
        filtered = filtered.filter(img => img.event === event)
      }

      if (search) {
        const searchTerm = search.toLowerCase()
        filtered = filtered.filter(img =>
          img.title?.toLowerCase().includes(searchTerm) ||
          img.description?.toLowerCase().includes(searchTerm) ||
          img.event?.toLowerCase().includes(searchTerm) ||
          img.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }

      return filtered
    }
  }, [images])

  // Utility functions
  const getImageById = useMemo(() => {
    return (id) => images.find(img => img.id === parseInt(id))
  }, [images])

  const getRandomImages = useMemo(() => {
    return (count = 6) => {
      const shuffled = [...images].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    }
  }, [images])

  const getRecentImages = useMemo(() => {
    return (count = 10) => {
      return images
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, count)
    }
  }, [images])

  const retry = () => {
    setError(null)
    setLoading(true)
    // Re-trigger the useEffect
    window.location.reload()
  }

  return {
    // Raw data
    data,
    loading,
    error,
    
    // Processed data
    images,
    categories,
    years,
    events,
    
    // Filter functions
    getImagesByCategory,
    getImagesByYear,
    getImagesByEvent,
    searchImages,
    filterImages,
    
    // Utility functions
    getImageById,
    getRandomImages,
    getRecentImages,
    retry
  }
}

export default useGalleryImages
