import { useState, useEffect } from 'react'
import { X, Calendar, MapPin, Users, Zap, Star, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function HotEventPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)

  // Hot events data
  const hotEvents = [
    {
      id: 'techwiz-2025',
      title: 'TECHWIZ 6 2025',
      subtitle: 'Global Programming Championship',
      description: 'The ultimate coding competition where the best programmers from around the world compete for glory and amazing prizes!',
      date: '2025-03-15',
      time: '09:00 - 18:00',
      location: 'Aptech Arena, Main Campus',
      participants: '500+ Developers',
      prize: '$50,000 Prize Pool',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop&crop=center',
      tags: ['Programming', 'Competition', 'Global', 'Tech'],
      urgency: 'Registration closes in 5 days!',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'nano-banana-2025',
      title: 'Nano Banana Hot Trend',
      subtitle: 'AI & Nanotechnology Summit',
      description: 'Discover the hottest trends in nanotechnology and AI integration. The future is nano, and it\'s happening now!',
      date: '2025-02-28',
      time: '14:00 - 20:00',
      location: 'Innovation Lab, Building C',
      participants: '200+ Researchers',
      prize: 'Innovation Awards',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center',
      tags: ['AI', 'Nanotechnology', 'Innovation', 'Research'],
      urgency: 'Limited seats available!',
      color: 'from-cyan-500 to-blue-600'
    }
  ]

  // Auto-slide through hot events
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % hotEvents.length)
    }, 4000) // Change event every 4 seconds

    return () => clearInterval(interval)
  }, [])

  const currentEvent = hotEvents[currentEventIndex]

  const closePopup = () => {
    setIsVisible(false)
  }

  const openFullPopup = () => {
    setIsVisible(true)
  }

  return (
    <>
      {/* Mini Popup - Always Visible Top Right Corner */}
      <div className="fixed top-24 right-4 z-40">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm w-80 relative overflow-hidden transition-all duration-500">
          {/* Event Indicator */}
          <div className="absolute top-2 left-2 flex space-x-1">
            {hotEvents.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentEventIndex ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Hot Badge */}
          <div className="flex items-center justify-center mb-3 mt-2">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <Zap className="w-3 h-3" />
              <span>HOT EVENT</span>
              <Star className="w-3 h-3 animate-spin" />
            </div>
          </div>

          {/* Event Preview */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              <img
                src={currentEvent.image}
                alt={currentEvent.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                {currentEvent.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                {currentEvent.subtitle}
              </p>
              <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                <Calendar className="w-3 h-3 text-cyan-500" />
                <span>{currentEvent.date}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span className="truncate">{currentEvent.location}</span>
              </div>
            </div>
          </div>

          {/* Urgency */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-4">
            <div className="flex items-center space-x-1 text-red-600 text-xs">
              <Clock className="w-3 h-3 animate-pulse" />
              <span className="font-medium">{currentEvent.urgency}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={openFullPopup}
            className={`w-full bg-gradient-to-r ${currentEvent.color} text-white px-4 py-3 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2`}
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full Popup */}
      {!isVisible ? null : (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closePopup}
      ></div>

      {/* Popup */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 transition-all duration-300 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hot Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wider">HOT EVENT</span>
            <Star className="w-4 h-4 animate-spin" />
          </div>
        </div>

        {/* Event Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={currentEvent.image}
            alt={currentEvent.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${currentEvent.color} opacity-80`}></div>
          
          {/* Event Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              {currentEvent.title}
            </h2>
            <p className="text-xl font-medium opacity-90 drop-shadow-md">
              {currentEvent.subtitle}
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-8">
          {/* Urgency Banner */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 text-red-600">
              <Clock className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">{currentEvent.urgency}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {currentEvent.description}
          </p>

          {/* Event Info Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Calendar className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-semibold text-gray-900">{currentEvent.date}</p>
                <p className="text-sm text-gray-600">{currentEvent.time}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold text-gray-900">{currentEvent.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="font-semibold text-gray-900">{currentEvent.participants}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Prize</p>
                <p className="font-semibold text-gray-900">{currentEvent.prize}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {currentEvent.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/events"
              className={`flex-1 bg-gradient-to-r ${currentEvent.color} text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2`}
              onClick={closePopup}
            >
              <span>Register Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={closePopup}
              className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  )
}

export default HotEventPopup
