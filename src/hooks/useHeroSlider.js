import { useState, useEffect } from 'react'

export const useHeroSlider = (slides = [], autoSlide = true, slideInterval = 5000) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const defaultSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "University Campus"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "Modern Classrooms"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "Student Life"
    }
  ]

  const heroSlides = slides.length > 0 ? slides : defaultSlides

  useEffect(() => {
    if (!autoSlide || heroSlides.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, slideInterval)

    return () => clearInterval(timer)
  }, [autoSlide, heroSlides.length, slideInterval])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return {
    currentSlide,
    heroSlides,
    nextSlide,
    prevSlide,
    goToSlide
  }
}