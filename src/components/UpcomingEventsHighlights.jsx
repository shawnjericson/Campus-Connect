import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import CountdownTimer from './ui/CountdownTimer'

const UpcomingEventsHighlights = () => {
  const { events, loading, error } = useEvents()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Get featured upcoming events
  const featuredEvents = events.filter(event => event.featured && event.status === 'upcoming')
  const upcomingEvents = events.filter(event => event.status === 'upcoming')
  const displayEvents = featuredEvents.length > 0 ? featuredEvents : upcomingEvents.slice(0, 6)

  // Auto-slide functionality
  useEffect(() => {
    if (displayEvents.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displayEvents.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [displayEvents.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayEvents.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayEvents.length) % displayEvents.length)
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading upcoming events...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error || displayEvents.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No upcoming events available.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-4">
            <Calendar className="w-4 h-4 text-red-900" />
            <span className="text-red-900 text-sm font-medium tracking-wider">HIGHLIGHT EVENT</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-red-900">Don't Miss</span> These Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with our most important upcoming events and mark your calendar for these exciting opportunities.
          </p>
        </div>

        {/* Events Carousel */}
        <div className="relative">
          {/* Main Event Display */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="md:flex">
              {/* Event Image */}
              <div className="md:w-1/2 relative">
                <img
                  src={displayEvents[currentSlide]?.thumbnail || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&crop=center'}
                  alt={displayEvents[currentSlide]?.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {displayEvents[currentSlide]?.category}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 text-red-900 text-sm font-medium mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{displayEvents[currentSlide]?.date}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{displayEvents[currentSlide]?.time}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {displayEvents[currentSlide]?.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {displayEvents[currentSlide]?.description}
                </p>

                {/* Countdown Timer */}
                {displayEvents[currentSlide]?.countdown?.enabled && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <CountdownTimer 
                      targetDate={displayEvents[currentSlide]?.countdown?.targetDate}
                    />
                  </div>
                )}

                {/* Learn More Button */}
                <Link
                  to={`/events/${displayEvents[currentSlide]?.id}`}
                  className="inline-flex items-center gap-2 bg-red-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-800 transition-all duration-300 transform hover:scale-105"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {displayEvents.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-red-900 p-3 rounded-full shadow-lg hover:bg-red-50 transition-all duration-300 border border-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-red-900 p-3 rounded-full shadow-lg hover:bg-red-50 transition-all duration-300 border border-gray-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Slide Indicators */}
          {displayEvents.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {displayEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 ${index === currentSlide
                      ? 'w-8 h-2 bg-red-900 rounded-full'
                      : 'w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-600'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default UpcomingEventsHighlights
