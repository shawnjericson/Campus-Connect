import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, User, Building } from 'lucide-react'
import { useContacts } from '../hooks/useContacts'

function ContactPage() {
  const {
    contacts,
    departments,
    university,
    loading,
    error
  } = useContacts()

  const [activeTab, setActiveTab] = useState('university')

  // Debug logging
  console.log('ContactPage render:', { contacts, departments, university, loading, error })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading contacts: {error}</p>
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

  // Safety check
  if (!contacts || !departments || !university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No contact data available</p>
          <p className="text-sm text-gray-500 mt-2">
            Contacts: {contacts ? contacts.length : 'null'},
            Departments: {departments ? departments.length : 'null'},
            University: {university ? 'loaded' : 'null'}
          </p>
        </div>
      </div>
    )
  }

  // Filter contacts directly here
  const facultyContacts = contacts.filter(contact => contact.role === 'faculty')
  const coordinatorContacts = contacts.filter(contact => contact.role === 'coordinator')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with our team for any questions or support
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('university')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'university'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              University Info
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'faculty'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Faculty
            </button>
            <button
              onClick={() => setActiveTab('coordinators')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'coordinators'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Coordinators
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* University Information Tab */}
          {activeTab === 'university' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">University Information</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Building className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{university.name}</p>
                        <p className="text-gray-600">{university.shortName}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">{university.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">{university.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">{university.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Hours</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Weekdays</p>
                        <p className="text-gray-600">{university.officeHours?.weekdays}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Saturday</p>
                        <p className="text-gray-600">{university.officeHours?.saturday}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Sunday</p>
                        <p className="text-gray-600">{university.officeHours?.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-600">Google Maps integration will be added here</p>
                </div>
              </div>
            </div>
          )}

          {/* Faculty Tab */}
          {activeTab === 'faculty' && (
            <div className="space-y-6">
              {facultyContacts.map(contact => (
                <div key={contact.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
                      <p className="text-blue-600 font-medium">{contact.title}</p>
                      <p className="text-gray-600 mb-3">{contact.department}</p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{contact.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{contact.office}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Specialization:</strong> {contact.specialization}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Hours:</strong> {contact.workingHours}
                          </p>
                        </div>
                      </div>

                      {contact.bio && (
                        <p className="text-gray-600 mt-3 text-sm">{contact.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Coordinators Tab */}
          {activeTab === 'coordinators' && (
            <div className="space-y-6">
              {coordinatorContacts.map(contact => (
                <div key={contact.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
                      <p className="text-green-600 font-medium">{contact.title}</p>
                      <p className="text-gray-600 mb-3">{contact.department}</p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{contact.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{contact.office}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Specialization:</strong> {contact.specialization}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Hours:</strong> {contact.workingHours}
                          </p>
                        </div>
                      </div>

                      {contact.bio && (
                        <p className="text-gray-600 mt-3 text-sm">{contact.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campus Location with Google Maps */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Campus Location
              </h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Visit us at our main campus. We're easily accessible by public transportation and have parking facilities available.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Address</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-gray-900 font-medium">
                          {university.name || 'University of Information Technology and Communications'}
                        </p>
                        <p className="text-gray-600">
                          {university.address || '144 Xuan Thuy Street, Cau Giay District, Hanoi, Vietnam'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <p className="text-gray-600">{university.phone || '(024) 3869-2222'}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <p className="text-gray-600">{university.email || 'info@university.edu.vn'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Office Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday:</span>
                      <span className="text-gray-900 font-medium">8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday:</span>
                      <span className="text-gray-900 font-medium">8:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday:</span>
                      <span className="text-gray-900 font-medium">Closed</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Getting Here</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Bus routes: 03, 23, 34, 49</li>
                      <li>• Metro: Line 2A (Cau Giay Station)</li>
                      <li>• Parking available on campus</li>
                      <li>• Taxi/Grab pickup point at main gate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="h-96 bg-gray-200 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863855283474!2d105.78230831533216!3d21.03813778599482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd0c66f05%3A0x3c1e5d8b8b8b8b8b!2s144%20Xu%C3%A2n%20Th%E1%BB%A7y%2C%20C%E1%BA%A7u%20Gi%E1%BA%A5y%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vietnam!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="University Campus Location"
                className="absolute inset-0"
              />

              {/* Fallback for when maps don't load */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-0 hover:opacity-100 transition-opacity">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive Campus Map</p>
                  <p className="text-sm text-gray-500 mt-2">
                    144 Xuan Thuy Street, Cau Giay District, Hanoi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
