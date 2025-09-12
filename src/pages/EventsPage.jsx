import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, Search, Star } from 'lucide-react'
import BookmarkButton from '../components/BookmarkButton'
import ImageSlider from '../components/ImageSlider'
import StudentReviews from '../components/StudentReviews'
import { useBookmarks } from '../contexts/BookmarkContext'
import { useEvents } from '../hooks/useEvents'

function EventsPage() {
  const {
    events: allEvents,
    sortEvents,
    loading,
    error
  } = useEvents()

  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [sortBy, setSortBy] = useState('priority') // Default to priority to show TechWiz first
  const [sortOrder, setSortOrder] = useState('asc')
  const { isHydrated } = useBookmarks()


  // Enhanced filtering and sorting logic
  useEffect(() => {
    if (allEvents.length > 0) {
      let filtered = [...allEvents]

      // Filter by search query
      if (searchQuery.trim()) {
        filtered = filtered.filter(event =>
          (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.organizer && event.organizer.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
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

      // Sort events using hook function
      filtered = sortEvents(filtered, sortBy, sortOrder)

      setFilteredEvents(filtered)
    }
  }, [allEvents, selectedCategory, selectedStatus, searchQuery, sortBy, sortOrder, sortEvents])

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
        <ImageSlider
          images={event.gallery && event.gallery.length > 0 ? event.gallery : [event.image]}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          autoSlide={true}
          slideInterval={4000}
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
          <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                  <option value="ongoing">Ongoing</option>
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
      <StudentReviews />
    </div>
  )
}

export default EventsPage
