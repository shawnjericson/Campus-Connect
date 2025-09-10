import { Users, Target, Award, Heart, Calendar, Building, Briefcase, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useContacts } from '../hooks/useContacts'
import { useEvents } from '../hooks/useEvents'

function AboutPage() {
  const { university, departments, loading: contactsLoading } = useContacts()
  const { events, categories, loading: eventsLoading } = useEvents()

  if (contactsLoading || eventsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading university information...</p>
        </div>
      </div>
    )
  }

  // Calculate real statistics from data
  const upcomingEvents = events.filter(event => event.status === 'upcoming').length
  const totalEvents = events.length
  const totalDepartments = departments.length

  const stats = [
    { label: 'Active Students', value: '5,000+', icon: Users },
    { label: 'Total Events', value: `${totalEvents}+`, icon: Target },
    { label: 'Upcoming Events', value: `${upcomingEvents}`, icon: Calendar },
    { label: 'Departments', value: `${totalDepartments}`, icon: Building }
  ]

  // Annual important events
  const annualEvents = [
    {
      name: "Technology & Science Conference",
      description: "Annual conference showcasing latest research and innovations in technology and science",
      frequency: "Yearly",
      category: "Academic",
      icon: "🔬",
      organizer: "Information Technology Faculty"
    },
    {
      name: "Student Cultural Festival",
      description: "Celebration of diverse cultures and traditions with music, dance, and culinary experiences",
      frequency: "Yearly",
      category: "Cultural",
      icon: "🎭",
      organizer: "Youth Union"
    },
    {
      name: "Job Fair",
      description: "Career opportunities and networking with leading employers and industry professionals",
      frequency: "Bi-annual",
      category: "Career",
      icon: "💼",
      organizer: "Student Support Center"
    },
    {
      name: "Annual Sports Tournament",
      description: "University-wide sports competition promoting health, teamwork, and school spirit",
      frequency: "Yearly",
      category: "Sports",
      icon: "🏆",
      organizer: "Sports Department"
    },
    {
      name: "Scientific Research Exhibition",
      description: "Showcase of outstanding student and faculty research projects and innovations",
      frequency: "Yearly",
      category: "Academic",
      icon: "📊",
      organizer: "Scientific Research Office"
    },
    {
      name: "Soft Skills Workshop Series",
      description: "Professional development and skill enhancement programs for career readiness",
      frequency: "Quarterly",
      category: "Skills",
      icon: "🎯",
      organizer: "Student Affairs Office"
    }
  ]

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Director of Student Affairs',
      image: '/images/team/sarah.jpg',
      description: 'Leading campus engagement initiatives for over 10 years.'
    },
    {
      name: 'Michael Chen',
      role: 'Events Coordinator',
      image: '/images/team/michael.jpg',
      description: 'Passionate about creating memorable experiences for students.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Community Outreach Manager',
      image: '/images/team/emily.jpg',
      description: 'Building bridges between campus and local community.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - MIT Tech Style */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
            <Building className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium tracking-wider">ABOUT US</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              About CampusConnect
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Advanced Event Management System • Creating meaningful connections and unforgettable experiences
            that enrich student life and foster innovation within our tech community.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To create a vibrant campus community where every student has the opportunity to 
                engage, learn, and grow through meaningful events and connections. We strive to 
                bridge the gap between academic learning and real-world experiences.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To be the leading platform for university event management and student engagement, 
                fostering a culture of collaboration, innovation, and personal development that 
                extends beyond graduation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how we're making a difference in the university community
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">
                Building strong connections and fostering a sense of belonging among all students.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600">
                Striving for the highest quality in every event and interaction we facilitate.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Inclusivity</h3>
              <p className="text-gray-600">
                Creating welcoming spaces where every student feels valued and included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Annual Important Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Annual Important Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Throughout the year, we host signature events that bring together our community and showcase our commitment to excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {annualEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{event.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {event.category}
                        </span>
                        <span className="text-xs text-gray-500">{event.frequency}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        <strong>Organized by:</strong> {event.organizer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizing Units & Departments */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Organizing Units & Departments
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our events are organized by various departments and units across the university, each bringing their unique expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <div key={dept.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {dept.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.name}</h3>
                    <p className="text-gray-600 mb-3">
                      <strong>Department Head:</strong> {dept.head}
                    </p>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        <strong>Location:</strong> {dept.location}
                      </p>
                      <p className="flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        <strong>Phone:</strong> {dept.phone}
                      </p>
                      <p className="flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        <strong>Email:</strong> {dept.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Information */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {university.name || 'University of Information Technology and Communications'}
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Established in {university.established || 1956}, we have been a beacon of excellence in education and research for over {new Date().getFullYear() - (university.established || 1956)} years.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Campus Location</h3>
              <p className="text-blue-100">{university.address || '144 Xuan Thuy, Cau Giay, Hanoi, Vietnam'}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Contact Information</h3>
              <p className="text-blue-100">{university.phone || '(024) 3869-2222'}</p>
              <p className="text-blue-100">{university.email || 'info@university.edu.vn'}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Academic Excellence</h3>
              <p className="text-blue-100">{categories.length} Event Categories</p>
              <p className="text-blue-100">{totalDepartments} Academic Departments</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Involved?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join our tech community and start making meaningful connections today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Join CampusConnect
            </Link>
            <Link
              to="/contact"
              className="bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 shadow-lg border border-slate-600"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
