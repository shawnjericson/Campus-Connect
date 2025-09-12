import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Calendar, Clock, MapPin, Users, User, Building,
  ArrowLeft, Share2, Heart, CheckCircle, AlertCircle,
  Star, Trophy, Tag, Mail, X, Download, QrCode
} from 'lucide-react'
import { useBookmarks } from '../contexts/BookmarkContext'
import { useEvents } from '../hooks/useEvents'
import { LoadingSpinner, ErrorMessage } from '../components/shared'
import { ERROR_MESSAGES } from '../constants'
import BookmarkButton from '../components/BookmarkButton'

function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState(null)
  const [registrationForm, setRegistrationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [qrCodeData, setQrCodeData] = useState('')
  const { isHydrated } = useBookmarks()

  const { getEventById, loading, error, retry } = useEvents()
  const event = getEventById(parseInt(id))

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  const handleRegister = () => {
    setShowRegisterModal(true)
    setFormErrors({})
    setRegistrationForm({
      fullName: '',
      email: '',
      phone: '',
      organization: ''
    })
  }

  const validateForm = () => {
    const errors = {}

    if (!registrationForm.fullName.trim()) {
      errors.fullName = 'Full name is required'
    }

    if (!registrationForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationForm.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!registrationForm.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\+\(\)]+$/.test(registrationForm.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    return errors
  }

  const generateQRCode = (userData) => {
    // Generate QR code data with user and event information
    const qrData = {
      name: userData.fullName,
      email: userData.email,
      event: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      registrationId: `REG-${Date.now()}`,
      timestamp: new Date().toISOString()
    }

    // Convert to JSON string for QR code
    return JSON.stringify(qrData)
  }

  const sendConfirmationEmail = async (userData, qrData) => {
    // Simulate sending email (in real app, this would call your backend API)
    console.log('Sending confirmation email to:', userData.email)
    console.log('Event:', event.title)
    console.log('QR Data:', qrData)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return true
  }

  const confirmRegistration = async () => {
    const errors = validateForm()
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      // Generate QR code data
      const qrData = generateQRCode(registrationForm)
      setQrCodeData(qrData)

      // Send confirmation email
      await sendConfirmationEmail(registrationForm, qrData)

      // Close registration modal and show success modal
      setShowRegisterModal(false)
      setShowSuccessModal(true)
      setRegistrationStatus('success')

      // Reset status after 5 seconds
      setTimeout(() => {
        setRegistrationStatus(null)
        setShowSuccessModal(false)
      }, 10000)

    } catch (error) {
      console.error('Registration failed:', error)
      setFormErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setRegistrationForm(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const downloadQRCode = () => {
    // Create QR code URL (using a QR code service)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeData)}`

    // Create download link
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `${event.title.replace(/\s+/g, '_')}_QR_Code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    return <LoadingSpinner fullScreen message="Loading event details..." />
  }

  if (error) {
    return <ErrorMessage fullScreen message={error} onRetry={retry} />
  }

  if (!event) {
    return <ErrorMessage fullScreen message={ERROR_MESSAGES.EVENT_NOT_FOUND} onRetry={() => navigate('/events')} />
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
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Event Registration</h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Event Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-red-900 mb-2">{event.title}</h4>
              <div className="text-sm text-red-700 space-y-1">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={(e) => { e.preventDefault(); confirmRegistration(); }} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={registrationForm.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    formErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {formErrors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {formErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={registrationForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {formErrors.phone && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization (Optional)
                </label>
                <input
                  type="text"
                  value={registrationForm.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your organization/company"
                />
              </div>

              {/* Submit Error */}
              {formErrors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{formErrors.submit}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registering...
                    </>
                  ) : (
                    'Register Now'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal with QR Code */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-6">
                You have successfully registered for <strong>{event.title}</strong>
              </p>

              {/* Email Confirmation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">Confirmation Email Sent</span>
                </div>
                <p className="text-blue-700 text-sm">
                  A confirmation email with event details has been sent to <strong>{registrationForm.email}</strong>
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-3">
                  <QrCode className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-gray-800 font-medium">Your Event QR Code</span>
                </div>

                {/* QR Code Image */}
                <div className="flex justify-center mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`}
                    alt="Event QR Code"
                    className="border border-gray-300 rounded-lg"
                  />
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  Present this QR code at the event for quick check-in
                </p>

                <button
                  onClick={downloadQRCode}
                  className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </button>
              </div>

              {/* Event Details Reminder */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-red-900 mb-2">Event Details</h4>
                <div className="text-sm text-red-700 space-y-1">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 px-4 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetailPage
