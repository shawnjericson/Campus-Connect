import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Calendar, Clock, MapPin, Users, User, Building, 
  ArrowLeft, Share2, Heart, CheckCircle, AlertCircle,
  Star, Trophy, Tag
} from 'lucide-react'
import { useBookmarks } from '../contexts/BookmarkContext'
import BookmarkButton from '../components/BookmarkButton'

function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState(null)
  const { isHydrated } = useBookmarks()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch('/data/events.json')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        
        // Find event in the nested structure
        let foundEvent = null
        if (data.events) {
          // Check direct events array
          foundEvent = data.events.find(event => event.id === parseInt(id))
          
          // If not found, check nested events
          if (!foundEvent) {
            for (const item of data.events) {
              if (item.events && Array.isArray(item.events)) {
                foundEvent = item.events.find(event => event.id === parseInt(id))
                if (foundEvent) break
              }
            }
          }
        }
        
        if (!foundEvent) {
          throw new Error('Event not found')
        }
        
        setEvent(foundEvent)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const handleRegister = () => {
    setShowRegisterModal(true)
  }

  const confirmRegistration = () => {
    // Simulate registration process
    setRegistrationStatus('success')
    setShowRegisterModal(false)
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setRegistrationStatus(null)
    }, 3000)
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Technical': 'bg-blue-100 text-blue-900 border-blue-200',
      'Cultural': 'bg-purple-100 text-purple-900 border-purple-200',
      'Sport': 'bg-green-100 text-green-900 border-green-200',
      'Departmental': 'bg-orange-100 text-orange-900 border-orange-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-900 border-gray-200'
  }

  const getStatusColor = (status) => {
    const colors = {
      'upcoming': 'bg-green-100 text-green-900 border-green-200',
      'ongoing': 'bg-yellow-100 text-yellow-900 border-yellow-200',
      'past': 'bg-gray-100 text-gray-900 border-gray-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-900 border-gray-200'
  }

  const isRegistrationOpen = () => {
    if (!event) return false
    const now = new Date()
    const eventDate = new Date(event.date)
    const deadline = new Date(event.registrationDeadline)
    return now < deadline && eventDate > now && event.status === 'upcoming'
  }

  const getRegistrationText = () => {
    if (!event) return 'Register'
    if (event.status === 'past') return 'Event Ended'
    if (event.status === 'ongoing') return 'Event in Progress'
    if (!isRegistrationOpen()) return 'Registration Closed'
    if (event.currentParticipants >= event.maxParticipants) return 'Event Full'
    return 'Register Now'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-red-900 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center text-gray-600 hover:text-red-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Events
          </button>
        </div>
      </div>

      {/* Event Hero Section */}
      <div className="relative">
        <div className="h-96 bg-gradient-to-r from-red-900 to-red-700">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              {event.featured && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-900 border border-yellow-200 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Featured
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-red-900 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Organizer</p>
                      <p className="text-gray-600">{event.organizer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-red-900 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Faculty</p>
                      <p className="text-gray-600">{event.faculty}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-red-900 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Participants</p>
                      <p className="text-gray-600">
                        {event.currentParticipants} / {event.maxParticipants} registered
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-red-900 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Registration Deadline</p>
                      <p className="text-gray-600">
                        {new Date(event.registrationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-red-900 mb-2">
                  {event.currentParticipants >= event.maxParticipants ? 'FULL' : 'JOIN US'}
                </div>
                <p className="text-gray-600">
                  {event.maxParticipants - event.currentParticipants} spots remaining
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Registration Progress</span>
                  <span>{Math.round((event.currentParticipants / event.maxParticipants) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-900 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Registration Status */}
              {registrationStatus === 'success' && (
                <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 text-sm">Registration successful!</span>
                </div>
              )}

              {/* Register Button */}
              <button
                onClick={handleRegister}
                disabled={!isRegistrationOpen() || event.currentParticipants >= event.maxParticipants}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  isRegistrationOpen() && event.currentParticipants < event.maxParticipants
                    ? 'bg-red-900 text-white hover:bg-red-800 hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {getRegistrationText()}
              </button>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
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
                    className="flex-1 bg-gray-100 hover:bg-gray-200"
                  />
                )}
                
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Registration</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to register for "{event.title}"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRegistration}
                className="flex-1 py-3 px-4 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetailPage
