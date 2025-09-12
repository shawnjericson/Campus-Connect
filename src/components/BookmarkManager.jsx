import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, Trash2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBookmarks } from '../contexts/BookmarkContext'

function BookmarkManager({ onClose }) {
  const {
    bookmarks,
    clearBookmarks,
    removeBookmark
  } = useBookmarks()

  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const sortedBookmarks = useMemo(() => {
    return bookmarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [bookmarks])



  const handleClearAll = () => {
    clearBookmarks()
    setShowConfirmClear(false)
  }

  const getBookmarkIcon = (type) => {
    switch (type) {
      case 'event': return '📅'
      case 'page': return '📄'
      case 'image': return '🖼️'
      default: return '🔖'
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-hidden">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Bookmarks</h2>
            <p className="text-gray-600">{bookmarks.length} items saved</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-red-300 flex items-center justify-center transition-all duration-300 text-gray-600 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        {bookmarks.length > 0 && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm">
                Manage your saved bookmarks
              </p>
              <button
                onClick={() => setShowConfirmClear(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                title="Clear all bookmarks"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-6">
          {sortedBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No bookmarks yet
              </h3>
              <p className="text-gray-600">
                Start bookmarking content to see it here
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getBookmarkIcon(bookmark.type)}</span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {bookmark.type}
                        </span>
                        {bookmark.category && (
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {bookmark.category}
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-1 truncate">
                        {bookmark.title}
                      </h4>
                      
                      {bookmark.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {bookmark.description}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {bookmark.url && (
                        <Link
                          to={bookmark.url}
                          onClick={onClose}
                          className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                          title="Open bookmark"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </Link>
                      )}
                      
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Clear Dialog */}
        {showConfirmClear && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear All Bookmarks?</h3>
              <p className="text-gray-600 mb-4">
                This action cannot be undone. All {bookmarks.length} bookmarks will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default BookmarkManager
