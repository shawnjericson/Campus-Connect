import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const BookmarkContext = createContext()

const BOOKMARKS_STORAGE_KEY = 'campusconnect_bookmarks'

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydration effect - load bookmarks after component mounts
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY)
      if (saved) {
        setBookmarks(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks))
      } catch (error) {
        console.error('Error saving bookmarks:', error)
      }
    }
  }, [bookmarks])

  // Add a bookmark
  const addBookmark = useCallback((item) => {
    const bookmark = {
      id: Date.now().toString(),
      ...item,
      createdAt: new Date().toISOString(),
      type: item.type || 'page'
    }

    setBookmarks(prev => {
      const exists = prev.some(b => 
        b.url === bookmark.url || 
        (b.eventId && b.eventId === bookmark.eventId) ||
        (b.contentId && b.contentId === bookmark.contentId)
      )
      
      if (exists) return prev
      return [bookmark, ...prev]
    })

    return bookmark
  }, [])

  // Remove a bookmark
  const removeBookmark = useCallback((bookmarkId) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
  }, [])

  // Remove bookmark by URL or content ID
  const removeBookmarkByIdentifier = useCallback((identifier) => {
    setBookmarks(prev => prev.filter(b => 
      b.url !== identifier && 
      b.eventId !== identifier && 
      b.contentId !== identifier
    ))
  }, [])

  // Check if item is bookmarked
  const isBookmarked = useCallback((identifier) => {
    return bookmarks.some(b => 
      b.url === identifier || 
      b.eventId === identifier || 
      b.contentId === identifier
    )
  }, [bookmarks])

  // Get bookmark by identifier
  const getBookmark = useCallback((identifier) => {
    return bookmarks.find(b => 
      b.url === identifier || 
      b.eventId === identifier || 
      b.contentId === identifier
    )
  }, [bookmarks])

  // Toggle bookmark
  const toggleBookmark = useCallback((item) => {
    const identifier = item.url || item.eventId || item.contentId
    
    if (isBookmarked(identifier)) {
      removeBookmarkByIdentifier(identifier)
      return false
    } else {
      addBookmark(item)
      return true
    }
  }, [isBookmarked, removeBookmarkByIdentifier, addBookmark])

  // Clear all bookmarks
  const clearBookmarks = useCallback(() => {
    setBookmarks([])
  }, [])

  // Get bookmarks by type
  const getBookmarksByType = useCallback((type) => {
    return bookmarks.filter(b => b.type === type)
  }, [bookmarks])

  // Search bookmarks
  const searchBookmarks = useCallback((query) => {
    const lowercaseQuery = query.toLowerCase()
    return bookmarks.filter(b => 
      b.title?.toLowerCase().includes(lowercaseQuery) ||
      b.description?.toLowerCase().includes(lowercaseQuery) ||
      b.category?.toLowerCase().includes(lowercaseQuery)
    )
  }, [bookmarks])

  // Export bookmarks
  const exportBookmarks = useCallback(() => {
    const dataStr = JSON.stringify(bookmarks, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `campusconnect-bookmarks-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [bookmarks])

  // Import bookmarks
  const importBookmarks = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedBookmarks = JSON.parse(e.target.result)
          if (Array.isArray(importedBookmarks)) {
            setBookmarks(prev => {
              const merged = [...prev]
              importedBookmarks.forEach(imported => {
                const exists = merged.some(existing => 
                  existing.url === imported.url ||
                  (existing.eventId && existing.eventId === imported.eventId) ||
                  (existing.contentId && existing.contentId === imported.contentId)
                )
                if (!exists) {
                  merged.push({
                    ...imported,
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 11)
                  })
                }
              })
              return merged
            })
            resolve(importedBookmarks.length)
          } else {
            reject(new Error('Invalid bookmark file format'))
          }
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }, [])

  const value = {
    bookmarks,
    isHydrated,
    addBookmark,
    removeBookmark,
    removeBookmarkByIdentifier,
    isBookmarked,
    getBookmark,
    toggleBookmark,
    clearBookmarks,
    getBookmarksByType,
    searchBookmarks,
    exportBookmarks,
    importBookmarks,
    count: bookmarks.length
  }

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarkContext)
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider')
  }
  return context
}
