import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, ArrowRight, Heart, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { useBookmarks } from '../contexts/BookmarkContext'
import { LoadingSpinner, ErrorMessage } from '../components/shared'
import BookmarkButton from '../components/BookmarkButton'
import UpcomingEventsHighlights from '../components/UpcomingEventsHighlights'
import ImageSlider from '../components/ImageSlider'
import StudentReviews from '../components/StudentReviews'
import { useEvents } from '../hooks/useEvents'
import useBanners from '../hooks/useBanners'

function HomePage() {
  const { isHydrated } = useBookmarks()
  const {
    getEventsByStatus,
    loading,
    error
  } = useEvents()
  const { getActiveWelcomeMessage, getFeaturedSlides, loading: bannersLoading } = useBanners()

  const [currentSlide, setCurrentSlide] = useState(0)

  // Get dynamic banner slides or fallback to static data
  const heroSlides = getFeaturedSlides().length > 0 ? getFeaturedSlides() : [
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

  // Get active welcome message
  const welcomeMessage = getActiveWelcomeMessage() || {
    title: "Welcome to CampusConnect",
    subtitle: "Stay Updated, Stay Involved!",
    description: "Connect with your community and discover amazing events.",
    badge: "LIVE SYSTEM"
  }

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [heroSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const upcomingEvents = getEventsByStatus('upcoming').slice(0, 3)
  const ongoingEvents = getEventsByStatus('ongoing')
  const pastEvents = getEventsByStatus('past').slice(0, 6)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-900 mb-4">Error loading events: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const EventCard = ({ event, isPast = false }) => {
    // Get images for slider - use gallery if available, otherwise use main image
    const images = event.gallery && event.gallery.length > 0
      ? event.gallery
      : [event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center']

    return (
      <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-red-300 hover:shadow-xl hover:shadow-red-900/10 transition-all duration-500 transform hover:-translate-y-2">
        <div className="relative">
          <ImageSlider
            images={images}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            autoSlide={true}
            slideInterval={4000}
          /> 
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

        <div className="absolute top-4 right-4">
          {isHydrated && (
            <BookmarkButton
              item={{
                eventId: event.id,
                title: event.title,
                description: event.description,
                url: `/events/${event.id}`,
                type: 'event',
                category: event.category
              }}
              variant="heart"
              className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 border border-slate-600/50"
            />
          )}
        </div>
        {isPast && (
          <div className="absolute top-4 left-4 bg-green-600 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border ">
            Completed
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-red-900 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            {event.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-red-900 text-sm font-medium mb-3">
          <Calendar className="w-4 h-4" />
          <span>{event.date} • {event.time}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-900 transition-colors duration-300">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{isPast ? event.attendees || event.participants : event.participants}</span>
            </div>
          </div>

          <Link
            to={`/events/${event.id}`}
            className="text-red-900 hover:text-red-700 font-medium flex items-center gap-1 transition-colors text-sm"
          >
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner with Slider - Mobile Responsive */}
      <section className="relative h-screen overflow-hidden -mt-20">
        {/* Welcome Message - Glass Morphism Container */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <div className="bg-white/80 backdrop-blur-lg border border-white/50 rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-4 md:px-6 py-2 mb-6">
                <div className="w-2 h-2 bg-red-900 rounded-full animate-pulse"></div>
                <span className="text-red-900 text-xs md:text-sm font-medium tracking-wider">{welcomeMessage.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                <span className="text-red-900">
                  {welcomeMessage.title}
                </span>
                <br />
                <span className="text-gray-900">{welcomeMessage.subtitle}</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Image Slider - Clean Background Images */}
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
              {/* Light overlay for welcome message readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/20 to-gray-900/30"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Tech Style */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md text-red-900 p-3 rounded-xl hover:bg-red-50 hover:text-red-800 transition-all duration-300 shadow-lg border border-gray-200 hover:border-red-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md text-red-900 p-3 rounded-xl hover:bg-red-50 hover:text-red-800 transition-all duration-300 shadow-lg border border-gray-200 hover:border-red-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators - MIT Style */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 h-2 bg-red-900 rounded-full shadow-lg'
                  : 'w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Scroll Down Indicator - Tech Style */}
        <div className="absolute bottom-8 right-8 z-30 animate-bounce">
          <div className="text-red-900 text-center">
            <div className="w-6 h-10 border-2 border-red-900 rounded-full flex justify-center bg-white/90 backdrop-blur-sm">
              <div className="w-1 h-3 bg-red-900 rounded-full mt-2 animate-pulse"></div>
            </div>
            <p className="text-xs mt-2 font-medium tracking-wider">SCROLL</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Highlights */}
      <UpcomingEventsHighlights />

      {/* Ongoing Events */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-orange-100 border border-orange-200 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-orange-900 text-sm font-medium tracking-wider">HAPPENING NOW</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-orange-600">Ongoing Events</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join these events that are currently taking place
            </p>
          </div>

          {ongoingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ongoingEvents.map(event => (
                <div key={event.id} className="group bg-white rounded-2xl shadow-lg border border-orange-200 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20">
                  <Link to={`/events/${event.id}`} className="block">
                    <div className="relative">
                      <ImageSlider
                        images={event.gallery && event.gallery.length > 0 ? event.gallery : [event.image]}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        autoSlide={true}
                        slideInterval={4000}
                      />

                      {/* Live Badge */}
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>LIVE</span>
                      </div>

                      {/* Bookmark Button */}
                      <div className="absolute top-4 right-4">
                        {isHydrated && (
                          <BookmarkButton
                            item={{
                              eventId: event.id,
                              title: event.title,
                              description: event.description,
                              url: `/events/${event.id}`,
                              type: 'event',
                              category: event.category
                            }}
                            variant="heart"
                            className="bg-white/90 hover:bg-white"
                          />
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Event Date & Time */}
                      <div className="flex items-center text-sm text-orange-600 mb-3 font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                        <span className="text-gray-400 mx-2">•</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{event.time}</span>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {event.description}
                      </p>

                      {/* Location & Participants */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{event.currentParticipants || 0}</span>
                        </div>
                      </div>

                      {/* Category & Organizer */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-orange-100 text-orange-900">
                          {event.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          by {event.organizer}
                        </span>
                      </div>

                      {/* View Details Button */}
                      <div className="flex items-center justify-between pt-4 border-t border-orange-200">
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">HAPPENING NOW</span>
                        </div>
                        <div className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition-colors text-sm">
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-gray-500 text-lg">No ongoing events at the moment</p>
              <Link
                to="/events"
                className="inline-flex items-center mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                View all events <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Past Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Successful and meaningful activities that have taken place
            </p>
          </div>

          {pastEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} isPast={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No past events yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Student Reviews Section */}
      <StudentReviews />

    </div>
  )
}

export default HomePage
