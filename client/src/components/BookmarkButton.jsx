import { Heart, Bookmark, BookmarkCheck } from 'lucide-react'
import { useBookmarks } from '../contexts/BookmarkContext'

function BookmarkButton({ 
  item, 
  variant = 'default', 
  className = '',
  size = 'md' 
}) {
  const { isBookmarked, toggleBookmark, isHydrated } = useBookmarks()
  
  if (!item || !isHydrated) {
    return null
  }

  const identifier = item.url || item.eventId || item.contentId
  const bookmarked = isBookmarked(identifier)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isHydrated) return
    toggleBookmark(item)
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${className}`

  if (variant === 'heart') {
    return (
      <button
        onClick={handleClick}
        className={`${baseClasses} ${
          bookmarked
            ? 'bg-red-500 text-white shadow-lg'
            : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-md'
        }`}
        title={bookmarked ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart 
          className={`${iconSizes[size]} ${bookmarked ? 'fill-current' : ''}`} 
        />
      </button>
    )
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleClick}
        className={`${baseClasses} ${
          bookmarked
            ? 'bg-purple-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-500'
        }`}
        title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {bookmarked ? (
          <BookmarkCheck className={iconSizes[size]} />
        ) : (
          <Bookmark className={iconSizes[size]} />
        )}
      </button>
    )
  }

  // Default variant
  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${
        bookmarked
          ? 'bg-purple-500 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-500 shadow-md'
      }`}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? (
        <BookmarkCheck className={iconSizes[size]} />
      ) : (
        <Bookmark className={iconSizes[size]} />
      )}
    </button>
  )
}

export default BookmarkButton
