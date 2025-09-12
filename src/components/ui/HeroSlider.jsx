import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHeroSlider } from '../../hooks/useHeroSlider'

function HeroSlider({ slides = [], children, className = "" }) {
  const { currentSlide, heroSlides, nextSlide, prevSlide, goToSlide } = useHeroSlider(slides)

  return (
    <section className={`relative h-screen overflow-hidden ${className}`}>
      {/* Welcome Message Overlay */}
      {children && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          {children}
        </div>
      )}

      {/* Image Slider */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.category || 'Campus Image'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/20 to-gray-900/30"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {heroSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md text-red-600 p-3 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-300 shadow-lg border border-gray-200 hover:border-red-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md text-red-600 p-3 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-300 shadow-lg border border-gray-200 hover:border-red-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {heroSlides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 h-2 bg-red-600 rounded-full shadow-lg'
                  : 'w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 z-30 animate-bounce">
        <div className="text-red-600 text-center">
          <div className="w-6 h-10 border-2 border-red-600 rounded-full flex justify-center bg-white/90 backdrop-blur-sm">
            <div className="w-1 h-3 bg-red-600 rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-xs mt-2 font-medium tracking-wider">SCROLL</p>
        </div>
      </div>
    </section>
  )
}

export default HeroSlider