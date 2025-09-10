import { useState, useEffect, useMemo } from 'react'

export const useGallery = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/gallery.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const galleryData = await response.json()
        setData(galleryData)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching gallery:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  const albums = useMemo(() => data?.albums || [], [data])
  const categories = useMemo(() => data?.categories || [], [data])
  const years = useMemo(() => data?.years || [], [data])
  const photographers = useMemo(() => data?.photographers || [], [data])

  // Get all images from all albums
  const allImages = useMemo(() => {
    return albums.reduce((acc, album) => {
      const albumImages = album.images.map(image => ({
        ...image,
        albumId: album.id,
        albumTitle: album.title,
        eventId: album.eventId,
        category: album.category,
        year: album.year
      }))
      return [...acc, ...albumImages]
    }, [])
  }, [albums])

  // Filter functions
  const getAlbumsByCategory = useMemo(() => {
    return (category) => albums.filter(album => 
      album.category.toLowerCase() === category.toLowerCase()
    )
  }, [albums])

  const getAlbumsByYear = useMemo(() => {
    return (year) => albums.filter(album => album.year === parseInt(year))
  }, [albums])

  const getAlbumByEventId = useMemo(() => {
    return (eventId) => albums.find(album => album.eventId === parseInt(eventId))
  }, [albums])

  const getAlbumById = useMemo(() => {
    return (id) => albums.find(album => album.id === parseInt(id))
  }, [albums])

  const getImagesByCategory = useMemo(() => {
    return (category) => allImages.filter(image => 
      image.category.toLowerCase() === category.toLowerCase()
    )
  }, [allImages])

  const getImagesByYear = useMemo(() => {
    return (year) => allImages.filter(image => image.year === parseInt(year))
  }, [allImages])

  const getImagesByPhotographer = useMemo(() => {
    return (photographer) => allImages.filter(image => 
      image.photographer.toLowerCase() === photographer.toLowerCase()
    )
  }, [allImages])

  const searchImages = useMemo(() => {
    return (query) => {
      if (!query) return allImages
      const lowercaseQuery = query.toLowerCase()
      return allImages.filter(image =>
        image.caption.toLowerCase().includes(lowercaseQuery) ||
        image.photographer.toLowerCase().includes(lowercaseQuery) ||
        image.albumTitle.toLowerCase().includes(lowercaseQuery) ||
        image.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    }
  }, [allImages])

  const searchAlbums = useMemo(() => {
    return (query) => {
      if (!query) return albums
      const lowercaseQuery = query.toLowerCase()
      return albums.filter(album =>
        album.title.toLowerCase().includes(lowercaseQuery) ||
        album.description.toLowerCase().includes(lowercaseQuery) ||
        album.category.toLowerCase().includes(lowercaseQuery)
      )
    }
  }, [albums])

  const filterAlbums = useMemo(() => {
    return ({ category, year, search }) => {
      let filtered = albums

      if (category && category !== 'all') {
        filtered = filtered.filter(album => 
          album.category.toLowerCase() === category.toLowerCase()
        )
      }

      if (year && year !== 'all') {
        filtered = filtered.filter(album => album.year === parseInt(year))
      }

      if (search) {
        const lowercaseSearch = search.toLowerCase()
        filtered = filtered.filter(album =>
          album.title.toLowerCase().includes(lowercaseSearch) ||
          album.description.toLowerCase().includes(lowercaseSearch) ||
          album.category.toLowerCase().includes(lowercaseSearch)
        )
      }

      return filtered
    }
  }, [albums])

  const filterImages = useMemo(() => {
    return ({ category, year, photographer, search, tags }) => {
      let filtered = allImages

      if (category && category !== 'all') {
        filtered = filtered.filter(image => 
          image.category.toLowerCase() === category.toLowerCase()
        )
      }

      if (year && year !== 'all') {
        filtered = filtered.filter(image => image.year === parseInt(year))
      }

      if (photographer && photographer !== 'all') {
        filtered = filtered.filter(image => 
          image.photographer.toLowerCase() === photographer.toLowerCase()
        )
      }

      if (search) {
        const lowercaseSearch = search.toLowerCase()
        filtered = filtered.filter(image =>
          image.caption.toLowerCase().includes(lowercaseSearch) ||
          image.photographer.toLowerCase().includes(lowercaseSearch) ||
          image.albumTitle.toLowerCase().includes(lowercaseSearch) ||
          image.tags?.some(tag => tag.toLowerCase().includes(lowercaseSearch))
        )
      }

      if (tags && tags.length > 0) {
        filtered = filtered.filter(image =>
          image.tags?.some(tag => 
            tags.some(filterTag => 
              tag.toLowerCase().includes(filterTag.toLowerCase())
            )
          )
        )
      }

      return filtered
    }
  }, [allImages])

  const sortAlbums = useMemo(() => {
    return (albumsList, sortBy = 'date', order = 'desc') => {
      return [...albumsList].sort((a, b) => {
        let aValue, bValue

        switch (sortBy) {
          case 'date':
            aValue = new Date(a.date)
            bValue = new Date(b.date)
            break
          case 'title':
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case 'category':
            aValue = a.category.toLowerCase()
            bValue = b.category.toLowerCase()
            break
          case 'year':
            aValue = a.year
            bValue = b.year
            break
          case 'imageCount':
            aValue = a.images.length
            bValue = b.images.length
            break
          default:
            return 0
        }

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
      })
    }
  }, [])

  const getRecentAlbums = useMemo(() => {
    return (limit = 6) => {
      return albums
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit)
    }
  }, [albums])

  const getFeaturedImages = useMemo(() => {
    return (limit = 12) => {
      // Get cover images from recent albums
      return albums
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit)
        .map(album => ({
          id: `cover-${album.id}`,
          url: album.coverImage,
          caption: album.title,
          albumId: album.id,
          albumTitle: album.title,
          category: album.category,
          year: album.year,
          date: album.date
        }))
    }
  }, [albums])

  return {
    albums,
    categories,
    years,
    photographers,
    allImages,
    loading,
    error,
    // Filter functions
    getAlbumsByCategory,
    getAlbumsByYear,
    getAlbumByEventId,
    getAlbumById,
    getImagesByCategory,
    getImagesByYear,
    getImagesByPhotographer,
    searchImages,
    searchAlbums,
    filterAlbums,
    filterImages,
    sortAlbums,
    getRecentAlbums,
    getFeaturedImages
  }
}

export default useGallery
