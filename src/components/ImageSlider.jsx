import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ImageSlider = ({ images, alt, className = "", autoSlide = true, slideInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Ensure images is an array and has at least one item
  const imageArray = Array.isArray(images) && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center']

  // Auto slide functionality
  useEffect(() => {
    if (!autoSlide || imageArray.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
      )
    }, slideInterval)

    return () => clearInterval(interval)
  }, [autoSlide, imageArray.length, slideInterval])

  const goToPrevious = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1)
  }

  const goToNext = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(currentIndex === imageArray.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index, e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(index)
  }

  // If only one image, show it without slider controls
  if (imageArray.length <= 1) {
    return (
      <img
        src={imageArray[0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'}
        alt={alt}
        className={className}
      />
    )
  }

  return (
    <div className="relative group">
      {/* Main Image */}
      <img
        src={imageArray[currentIndex] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'}
        alt={alt}
        className={className}
      />

      {/* Navigation Arrows - Only show on hover */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Next image"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots Indicator - Only show if more than 1 image */}
      {imageArray.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {imageArray.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(index, e)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {imageArray.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {currentIndex + 1}/{imageArray.length}
        </div>
      )}
    </div>
  )
}

export default ImageSlider
