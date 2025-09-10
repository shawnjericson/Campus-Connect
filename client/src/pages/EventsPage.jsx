import { useState, useEffect } from 'react'
import { Calendar, Users, MapPin, Search, Filter } from 'lucide-react'
import BookmarkButton from '../components/BookmarkButton'
import { useBookmarks } from '../contexts/BookmarkContext'
import { useEvents } from '../hooks/useEvents'

function EventsPage() {
  const {
    events: allEvents,
    categories,
    faculties,
    loading,
    error,
    filterEvents,
    sortEvents
  } = useEvents()

  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFaculty, setSelectedFaculty] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const { isHydrated } = useBookmarks()

  // Filter and sort events when filters change
  useEffect(() => {
    if (allEvents.length > 0) {
      const filtered = filterEvents({
        category: selectedCategory,
        faculty: selectedFaculty,
        status: selectedStatus,
        search: searchQuery
      })

      const sorted = sortEvents(filtered, sortBy, 'asc')
      setFilteredEvents(sorted)
    }
  }, [allEvents, selectedCategory, selectedFaculty, selectedStatus, searchQuery, sortBy, filterEvents, sortEvents])

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
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
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
        {event.status === 'past' && (
          <div className="absolute top-4 left-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Completed
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-purple-600 text-sm font-medium mb-2">
          <Calendar className="w-4 h-4" />
          {event.date} • {event.time}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {event.participants} people
            </div>
          </div>
          
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
            {event.category}
          </span>
        </div>
      </div>
    </div>
  )



  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header - MIT Tech Style */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium tracking-wider">EVENT DIRECTORY</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Campus Events
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Advanced event discovery system • Join our vibrant tech community
          </p>
        </div>

        {/* Filters - Clean White Style */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Events</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Faculty Filter */}
            <div className="relative">
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Faculties</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={faculty.name}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="category">Sort by Category</option>
                <option value="participants">Sort by Participants</option>
              </select>
            </div>
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
    </div>
  )
}

export default EventsPage
