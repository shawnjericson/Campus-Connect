import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, ArrowRight, Heart, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { useBookmarks } from '../contexts/BookmarkContext'
import BookmarkButton from '../components/BookmarkButton'
import HotEventPopup from '../components/HotEventPopup'
import { useEvents } from '../hooks/useEvents'

function HomePage() {
  const { isHydrated } = useBookmarks()
  const {
    getUpcomingEvents,
    getPastEvents,
    loading,
    error
  } = useEvents()

  const [currentSlide, setCurrentSlide] = useState(0)

  // Hero slider images and content
  const heroSlides = [
    {
      id: 1,
      title: "Technology & Science Conference 2024",
      subtitle: "Discover the Future of Innovation",
      description: "Join leading experts and researchers in exploring cutting-edge technologies and scientific breakthroughs.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Register Now",
      link: "/events"
    },
    {
      id: 2,
      title: "Student Cultural Festival",
      subtitle: "Celebrate Diversity & Creativity",
      description: "Experience the rich tapestry of cultures through music, dance, art, and culinary delights from around the world.",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Join Festival",
      link: "/events"
    },
    {
      id: 3,
      title: "Career Development Workshop",
      subtitle: "Build Your Professional Future",
      description: "Enhance your skills with hands-on workshops, networking opportunities, and career guidance from industry leaders.",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Learn More",
      link: "/events"
    },
    {
      id: 4,
      title: "Annual Sports Tournament",
      subtitle: "Compete, Connect, Celebrate",
      description: "Show your team spirit and athletic prowess in our exciting inter-faculty sports competition.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Join Tournament",
      link: "/events"
    }
  ]

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading events: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const EventCard = ({ event, isPast = false }) => (
    <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 transform hover:-translate-y-2">
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
          <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium border border-cyan-500/30 backdrop-blur-sm">
            {event.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-3">
          <Calendar className="w-4 h-4" />
          <span>{event.date} • {event.time}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
          {event.title}
        </h3>

        <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
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
            className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors group-hover:text-white"
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-12"></div>
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
    <div className="min-h-screen bg-slate-900">
      {/* Hot Event Popup */}
      <HotEventPopup />
      {/* Hero Banner with Slider - Mobile Responsive */}
      <section className="relative h-screen overflow-hidden -mt-20">
        {/* Welcome Message - MIT Tech Style */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-transparent">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="text-center text-white">
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 md:px-6 py-2 mb-4 md:mb-6 backdrop-blur-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-400 text-xs md:text-sm font-medium tracking-wider">LIVE EVENT SYSTEM</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 drop-shadow-lg">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Welcome to Aptech
                </span>
                <br />
                <span className="text-white">Event Center</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light drop-shadow-md text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
                Advanced Event Management System • Stay Updated, Join Now!
              </p>
              <div className="flex items-center justify-center space-x-3 md:space-x-4 mt-6 md:mt-8">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <div className="w-2 md:w-3 h-2 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs md:text-sm font-medium">System Online</span>
                </div>
                <div className="w-px h-3 md:h-4 bg-slate-600"></div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="text-xs md:text-sm">Real-time Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/20"></div>

              {/* Slide Content - Mobile Responsive */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-16">
                <div className="container mx-auto">
                  <div className="max-w-4xl">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl text-cyan-300 font-light mb-2 md:mb-4 drop-shadow-md tracking-wide">
                      {slide.subtitle}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 md:mb-8 leading-relaxed drop-shadow-md max-w-2xl">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to={slide.link}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center justify-center border border-cyan-400/20"
                      >
                        {slide.cta}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                      <Link
                        to="/about"
                        className="bg-slate-800/30 backdrop-blur-md text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-800/50 transition-all duration-300 transform hover:scale-105 shadow-xl border border-slate-600/30 inline-flex items-center justify-center"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Tech Style */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 bg-slate-800/50 backdrop-blur-md text-cyan-400 p-3 rounded-xl hover:bg-slate-800/70 hover:text-cyan-300 transition-all duration-300 shadow-lg border border-slate-700/50 hover:border-cyan-500/30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 bg-slate-800/50 backdrop-blur-md text-cyan-400 p-3 rounded-xl hover:bg-slate-800/70 hover:text-cyan-300 transition-all duration-300 shadow-lg border border-slate-700/50 hover:border-cyan-500/30"
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
                  ? 'w-8 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50'
                  : 'w-2 h-2 bg-slate-500 rounded-full hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Scroll Down Indicator - Tech Style */}
        <div className="absolute bottom-8 right-8 z-30 animate-bounce">
          <div className="text-cyan-400 text-center">
            <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center bg-slate-800/30 backdrop-blur-sm">
              <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
            </div>
            <p className="text-xs mt-2 font-medium tracking-wider">SCROLL</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events - MIT Tech Style */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium tracking-wider">UPCOMING EVENTS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Next Generation
              </span>
              <br />
              <span className="text-white">Learning Events</span>
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
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg border border-cyan-400/20"
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

      {/* Infinite Carousel CTA - Don't Miss Events */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 overflow-hidden relative">
        {/* Background Tech Pattern */}
        <div className="absolute inset-0 tech-grid opacity-20"></div>

        {/* Header */}
        <div className="container mx-auto px-4 text-center mb-12 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-orange-400 text-sm font-medium tracking-wider">DON'T MISS OUT</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Upcoming Events
            </span>
            <span className="text-white"> You Can't Miss!</span>
          </h2>
        </div>

        {/* Infinite Scrolling Carousel */}
        <div className="relative">
          <div className="flex animate-scroll-left space-x-6">
            {/* First set of events */}
            {upcomingEvents.concat(upcomingEvents).map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className="flex-shrink-0 w-80 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-slate-300 text-sm mb-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300 text-sm mb-3">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <Link
                      to={`/events`}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-orange-400 hover:to-red-400 transition-all duration-300 transform hover:scale-105"
                    >
                      <span>Register Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="container mx-auto px-4 text-center mt-12 relative z-10">
          <Link
            to="/events"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-400 hover:to-red-400 transition-all duration-300 transform hover:scale-105 shadow-lg border border-orange-400/20"
          >
            <span>View All Events</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
