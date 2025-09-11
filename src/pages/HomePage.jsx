import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, ArrowRight, Heart, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { useBookmarks } from '../contexts/BookmarkContext'
import BookmarkButton from '../components/BookmarkButton'
import UpcomingEventsHighlights from '../components/UpcomingEventsHighlights'
import { useEvents } from '../hooks/useEvents'
import useBanners from '../hooks/useBanners'

function HomePage() {
  const { isHydrated } = useBookmarks()
  const {
    getUpcomingEvents,
    getPastEvents,
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
      category: "College Branding"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "Event Snapshots"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "Seasonal Celebrations"
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

  const upcomingEvents = getUpcomingEvents(3)
  const pastEvents = getPastEvents(3)

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

  const EventCard = ({ event, isPast = false }) => (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-red-300 hover:shadow-xl hover:shadow-red-900/10 transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative">
        <img 
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
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
          <div className="absolute top-4 left-4 bg-slate-600/80 backdrop-blur-sm text-slate-300 px-3 py-1 rounded-full text-sm font-medium border border-slate-500/50">
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
            className="text-red-900 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )

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
        <div className="absolute top-24 left-8 right-8 z-20 flex justify-center">
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

      {/* Upcoming Events - MIT Tech Style */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
              <Calendar className="w-4 h-4 text-red-900" />
              <span className="text-red-900 text-sm font-medium tracking-wider">UPCOMING EVENTS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-red-900">
                Next Generation
              </span>
              <br />
              <span className="text-gray-900">Learning Events</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Advanced educational experiences designed for the future of technology and innovation
            </p>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-600/50">
                <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-400 text-xl">No upcoming events at the moment</p>
              <p className="text-slate-500 text-sm mt-2">Check back soon for new events</p>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center gap-3 bg-red-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
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


    </div>
  )
}

export default HomePage
