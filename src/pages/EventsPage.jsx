import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, Search, Quote, Star } from 'lucide-react'
import BookmarkButton from '../components/BookmarkButton'
import { useBookmarks } from '../contexts/BookmarkContext'
import { useEvents } from '../hooks/useEvents'

function EventsPage() {
  const {
    events: allEvents,
    loading,
    error
  } = useEvents()

  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [sortBy, setSortBy] = useState('priority') // Default to priority to show TechWiz first
  const [sortOrder, setSortOrder] = useState('desc')
  const { isHydrated } = useBookmarks()
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  // Reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Computer Science Student",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "The TECHWIZ competition was absolutely incredible! The organization was flawless and I learned so much from other participants. Can't wait for next year!",
      event: "TECHWIZ 6 2025"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "AI Research Assistant",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Nano Banana Hot Trend opened my eyes to the future of nanotechnology. The speakers were world-class and the networking opportunities were amazing!",
      event: "Nano Banana Hot Trend"
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Software Engineering Student",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Best tech event I've ever attended! The hands-on workshops were incredibly valuable and the community here is so supportive and inspiring.",
      event: "Technology & Science Conference"
    },
    {
      id: 4,
      name: "David Park",
      role: "Data Science Graduate",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Aptech events consistently deliver high-quality content and amazing networking opportunities. The innovation showcased here is truly cutting-edge!",
      event: "Innovation Showcase"
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "UX/UI Designer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "The creative workshops and design thinking sessions were phenomenal. I gained new perspectives and made connections that will last a lifetime!",
      event: "Creative Design Workshop"
    }
  ]

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
    }, 5000) // Change review every 5 seconds

    return () => clearInterval(interval)
  }, [reviews.length])

  // Enhanced filtering and sorting logic
  useEffect(() => {
    if (allEvents.length > 0) {
      let filtered = [...allEvents]

      // Filter by search query
      if (searchQuery.trim()) {
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(event => event.category === selectedCategory)
      }



      // Filter by status
      if (selectedStatus !== 'all') {
        filtered = filtered.filter(event => event.status === selectedStatus)
      }

      // Sort events
      filtered.sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
          case 'priority':
            // Featured/priority events first
            const aPriority = a.priority || 999
            const bPriority = b.priority || 999
            comparison = aPriority - bPriority
            break
          case 'date':
            comparison = new Date(a.date) - new Date(b.date)
            break
          case 'name':
            comparison = a.title.localeCompare(b.title)
            break
          case 'category':
            comparison = a.category.localeCompare(b.category)
            break
          default:
            comparison = 0
        }

        return sortOrder === 'desc' ? -comparison : comparison
      })

      setFilteredEvents(filtered)
    }
  }, [allEvents, selectedCategory, selectedStatus, searchQuery, sortBy, sortOrder])

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

  const EventCard = ({ event }) => (
    <Link to={`/events/${event.id}`} className="block">
      <div className={`group bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-500 transform hover:-translate-y-2 ${
        event.featured
          ? 'border-red-500 hover:border-red-600 hover:shadow-2xl hover:shadow-red-500/20'
          : 'border-gray-200 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10'
      }`}>
      <div className="relative">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured Badge */}
        {event.featured && (
          <div className="absolute top-4 left-4 bg-red-900 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
            <Star className="w-3 h-3 fill-current" />
            <span>FEATURED</span>
          </div>
        )}

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

        {/* Status Badge */}
        {event.status === 'past' && (
          <div className="absolute bottom-4 left-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Completed
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Date & Time */}
        <div className="flex items-center gap-2 text-red-900 text-sm font-medium mb-3">
          <Calendar className="w-4 h-4" />
          <span>{new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}</span>
          <span className="text-gray-400">•</span>
          <span>{event.time}</span>
        </div>

        {/* Event Title */}
        <h3 className={`text-xl font-bold mb-3 ${event.featured ? 'text-red-900' : 'text-gray-900'}`}>
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {event.description}
        </p>

        {/* Location & Participants */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-900" />
              <span className="truncate">{event.location}</span>
            </div>
            {event.currentParticipants && event.maxParticipants && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-red-900" />
                <span>{event.currentParticipants}/{event.maxParticipants} registered</span>
              </div>
            )}
          </div>
        </div>

        {/* Category & Organizer */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            event.featured
              ? 'bg-red-100 text-red-900'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {event.category}
          </span>
          <span className="text-xs text-gray-500">
            by {event.organizer}
          </span>
        </div>
      </div>
    </div>
    </Link>
  )



  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
            <Calendar className="w-4 h-4 text-red-900" />
            <span className="text-red-900 text-sm font-medium tracking-wider">EVENT CATALOG</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-red-900">
              Campus Events
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover upcoming and past events • Join our vibrant tech community and expand your horizons
          </p>
        </div>

        {/* Enhanced Filters & Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by name, description, location, or organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white text-gray-900 min-w-[140px]"
                >
                  <option value="all">All Categories</option>
                  <option value="Technical">Technical Events</option>
                  <option value="Cultural">Cultural Events</option>
                  <option value="Sport">Sport Events</option>
                  <option value="Departmental">Departmental Events</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white text-gray-900 min-w-[120px]"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past Events</option>
                </select>
              </div>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white text-gray-900 min-w-[140px]"
                >
                  <option value="priority">Featured First</option>
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="category">Sort by Category</option>
                </select>
              </div>

              {/* Sort Order Toggle */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-white"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-red-900">{filteredEvents.length}</span> events
              {selectedCategory !== 'all' && (
                <span> in <span className="font-semibold">{selectedCategory}</span> category</span>
              )}
              {searchQuery && (
                <span> matching "<span className="font-semibold">{searchQuery}</span>"</span>
              )}
            </p>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Check back later for upcoming events'
              }
            </p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
              <Quote className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium tracking-wider">STUDENT REVIEWS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                What Our Community Says
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Real feedback from students and professionals who attended our events
            </p>
          </div>

          {/* Review Card with Fade Animation */}
          <div className="max-w-4xl mx-auto">
            <div className="relative h-80 flex items-center justify-center">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentReviewIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
                    {/* Stars */}
                    <div className="flex justify-center space-x-1 mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <blockquote className="text-xl md:text-2xl text-white font-light leading-relaxed mb-8 italic">
                      "{review.review}"
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-semibold text-white">{review.name}</h4>
                        <p className="text-cyan-300 text-sm">{review.role}</p>
                        <p className="text-slate-400 text-xs mt-1">Event: {review.event}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Review Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentReviewIndex
                      ? 'bg-cyan-400 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EventsPage
