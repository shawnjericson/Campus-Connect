import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { useBookmarks } from '../contexts/BookmarkContext'
import BookmarkManager from './BookmarkManager'

function BookmarkIndicator() {
  const { count, isHydrated } = useBookmarks()
  const [showManager, setShowManager] = useState(false)

  const displayCount = isHydrated ? count : 0

  if (!isHydrated) {
    return (
      <div className="relative">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center animate-pulse">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowManager(true)}
          className="w-10 h-10 bg-purple-50 hover:bg-purple-100 rounded-xl flex items-center justify-center transition-colors group"
          title="View Bookmarks"
        >
          <Bookmark className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
          {displayCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {displayCount > 99 ? '99+' : displayCount}
            </div>
          )}
        </button>
      </div>

      {showManager && (
        <BookmarkManager onClose={() => setShowManager(false)} />
      )}
    </>
  )
}

export default BookmarkIndicator
