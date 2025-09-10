import { useState } from 'react'
import { Phone, Mail, MapPin, User } from 'lucide-react'

function ContactPageSimple() {
  const [activeTab, setActiveTab] = useState('university')

  // Static data for testing
  const university = {
    name: 'University of Information Technology and Communications',
    address: '144 Xuan Thuy Street, Cau Giay District, Hanoi, Vietnam',
    phone: '(024) 3869-2222',
    email: 'info@university.edu.vn'
  }

  const contacts = [
    {
      id: 1,
      name: 'Dr. Nguyen Van An',
      title: 'Head of Information Technology Faculty',
      department: 'Information Technology',
      phone: '024-3869-2222',
      email: 'nguyen.van.an@university.edu.vn',
      office: 'Room 301, Building A',
      workingHours: 'Mon-Fri: 8:00-17:00',
      role: 'faculty',
      specialization: 'Artificial Intelligence, Machine Learning'
    },
    {
      id: 2,
      name: 'Ms. Tran Thi Binh',
      title: 'Student Coordinator',
      department: 'Student Affairs',
      phone: '024-3869-2223',
      email: 'tran.thi.binh@university.edu.vn',
      office: 'Room 105, Building B',
      workingHours: 'Mon-Fri: 8:00-17:00',
      role: 'coordinator',
      specialization: 'Student Support, Event Coordination'
    }
  ]

  const facultyContacts = contacts.filter(contact => contact.role === 'faculty')
  const coordinatorContacts = contacts.filter(contact => contact.role === 'coordinator')

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
            <Phone className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium tracking-wider">CONTACT CENTER</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with our faculty and staff • Advanced support system for all your needs
          </p>
        </div>

        {/* Tab Navigation - Tech Style */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex space-x-2 bg-gray-100 p-2 rounded-xl">
            <button
              onClick={() => setActiveTab('university')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'university'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              University Info
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'faculty'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Faculty
            </button>
            <button
              onClick={() => setActiveTab('coordinators')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'coordinators'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Coordinators
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {/* University Info Tab */}
          {activeTab === 'university' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">University Information</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-gray-900 font-medium">{university.name}</p>
                        <p className="text-gray-600">{university.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <p className="text-gray-600">{university.phone}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <p className="text-gray-600">{university.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Hours</h3>
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
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{contact.email}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Office:</strong> {contact.office}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Hours:</strong> {contact.workingHours}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-3">
                        <strong>Specialization:</strong> {contact.specialization}
                      </p>
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
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{contact.email}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Office:</strong> {contact.office}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Hours:</strong> {contact.workingHours}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-3">
                        <strong>Specialization:</strong> {contact.specialization}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Google Maps Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Campus Location
              </h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Visit us at our main campus. We're easily accessible by public transportation.
              </p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPageSimple
