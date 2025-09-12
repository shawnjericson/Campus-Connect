import { useState, useEffect } from 'react'

export const useImageSlider = (images = [], autoSlide = true, slideInterval = 3000) => {
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
    e?.preventDefault()
    e?.stopPropagation()
    setCurrentIndex(currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1)
  }

  const goToNext = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCurrentIndex(currentIndex === imageArray.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index, e) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCurrentIndex(index)
  }

  return {
    currentIndex,
    imageArray,
    goToPrevious,
    goToNext,
    goToSlide,
    hasMultipleImages: imageArray.length > 1
  }
}