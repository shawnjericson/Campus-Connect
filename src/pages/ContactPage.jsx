import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, User, Building, Users } from 'lucide-react'
import { useContactsInfo } from '../hooks/useContactsInfo'
import { LoadingSpinner, ErrorMessage } from '../components/shared'
import { CONTACT_TABS } from '../constants'

function ContactPage() {
  const [activeTab, setActiveTab] = useState(CONTACT_TABS.FACULTY)
  const {
    university,
    facultyMembers,
    studentCoordinators,
    departments,
    contactInfo,
    officeHours,
    loading,
    error,
    retry
  } = useContactsInfo()

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading contact information..." />
  }

  if (error) {
    return <ErrorMessage fullScreen message={error} onRetry={retry} />
  }

  if (!contactInfo && !facultyMembers.length && !studentCoordinators.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No contact data available</p>
        </div>
      </div>
    )
  }

  // Data is now available from the hook, no need to destructure contactData

  // Contact Card Component
  const ContactCard = ({ contact, type = 'faculty' }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={contact.image}
              alt={contact.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-red-100"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{contact.name}</h3>
            <p className="text-red-900 font-medium mb-2">{contact.designation}</p>
            <p className="text-sm text-gray-600 mb-3">{contact.department}</p>

            {type === 'student' && (
              <p className="text-sm text-gray-500 mb-3">{contact.year}</p>
            )}

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 text-red-900 mr-2" />
                <a href={`tel:${contact.phone}`} className="hover:text-red-900 transition-colors">
                  {contact.phone}
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 text-red-900 mr-2" />
                <a href={`mailto:${contact.email}`} className="hover:text-red-900 transition-colors">
                  {contact.email}
                </a>
              </div>
              {contact.office && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-red-900 mr-2" />
                  <span>{contact.office}</span>
                </div>
              )}
            </div>

            {contact.specialization && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Specialization:</p>
                <p className="text-sm text-gray-700">{contact.specialization}</p>
              </div>
            )}

            {contact.responsibilities && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Responsibilities:</p>
                <div className="flex flex-wrap gap-1">
                  {contact.responsibilities.map((resp, index) => (
                    <span key={index} className="text-xs bg-red-50 text-red-900 px-2 py-1 rounded-full">
                      {resp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
            <Phone className="w-4 h-4 text-red-900" />
            <span className="text-red-900 text-sm font-medium tracking-wider">CONTACT INFORMATION</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-red-900">
              Contact Us
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get in touch with our faculty and student coordinators for campus events and academic support
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex justify-center space-x-1 bg-white p-1 rounded-xl shadow-sm w-fit mx-auto border border-gray-200">
            <button
              onClick={() => setActiveTab('faculty')}
              className={`py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'faculty'
                  ? 'bg-red-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Faculty</span>
            </button>
            <button
              onClick={() => setActiveTab('coordinators')}
              className={`py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'coordinators'
                  ? 'bg-red-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Coordinators</span>
            </button>
            <button
              onClick={() => setActiveTab('university')}
              className={`py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'university'
                  ? 'bg-red-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>University Info</span>
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto">
          {/* Faculty Tab */}
          {activeTab === 'faculty' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Faculty Members</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Meet our experienced faculty members who organize and coordinate campus events
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facultyMembers.map(member => (
                  <ContactCard key={member.id} contact={member} type="faculty" />
                ))}
              </div>
            </div>
          )}

          {/* Student Coordinators Tab */}
          {activeTab === 'coordinators' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Coordinators</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Connect with our dedicated student coordinators for event participation and support
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentCoordinators.map(coordinator => (
                  <ContactCard key={coordinator.id} contact={coordinator} type="student" />
                ))}
              </div>
            </div>
          )}

          {/* University Information Tab */}
          {activeTab === 'university' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">University Information</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Campus location, contact details, and office hours
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Building className="w-6 h-6 text-red-900 mr-3" />
                    Contact Information
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{university.name}</h4>
                      <p className="text-gray-600 text-sm mb-4">{university.description}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-red-900 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Address</p>
                          <p className="text-gray-600">{university.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-red-900" />
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <a href={`tel:${university.phone}`} className="text-gray-600 hover:text-red-900 transition-colors">
                            {university.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-red-900" />
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <a href={`mailto:${university.email}`} className="text-gray-600 hover:text-red-900 transition-colors">
                            {university.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-red-900" />
                        <div>
                          <p className="font-medium text-gray-900">Office Hours</p>
                          <p className="text-gray-600">
                            Weekdays: {officeHours.weekdays}<br />
                            Saturday: {officeHours.saturday}<br />
                            Sunday: {officeHours.sunday}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Maps */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <MapPin className="w-6 h-6 text-red-900 mr-3" />
                      Campus Location
                    </h3>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d872.8715230865433!2d106.71344195376555!3d10.806658030603254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529ed00409f09%3A0x11f7708a5c77d777!2zQXB0ZWNoIENvbXB1dGVyIEVkdWNhdGlvbiAtIEjhu4cgVGjhu5FuZyDEkMOgbyB04bqhbyBM4bqtcCBUcsOsbmggVmnDqm4gUXXhu5FjIHThur8gQXB0ZWNo!5e0!3m2!1svi!2s!4v1757669837485!5m2!1svi!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Aptech Computer Education Center Location"
                      ></iframe>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Getting Here:</strong> Located in District 2, Ho Chi Minh City.
                        Easily accessible by public transport and private vehicles.
                        Parking available on campus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactPage
