import { useState, useEffect } from 'react'
import {
  Users, Award, Calendar, MapPin, Globe, Heart, Star, Trophy, Code, Music, Gamepad2,
  Building, GraduationCap, Target, BookOpen, Lightbulb, UserCheck, Shield, Brain,
  Palette, ChevronRight, ExternalLink, CheckCircle, Eye, Briefcase, Phone, Mail, Clock
} from 'lucide-react'

function AboutPage() {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [activeDepartment, setActiveDepartment] = useState(null)

  // Load about data from JSON
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/about-info.json')
        if (!response.ok) throw new Error('Failed to load about data')
        const data = await response.json()
        setAboutData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadAboutData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading about data: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!aboutData) return null

  const { institute, departments, annualEvents } = aboutData

  // Icon mapping for departments
  const departmentIcons = {
    code: Code,
    shield: Shield,
    brain: Brain,
    palette: Palette
  }

  // Navigation menu
  const navigationSections = [
    { id: 'overview', label: 'Institute Overview', icon: Building },
    { id: 'departments', label: 'Departments', icon: GraduationCap },
    { id: 'events', label: 'Annual Events', icon: Calendar }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${institute.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Building className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wider">ABOUT US</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {institute.name}
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {institute.overview.description}
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Established {institute.established}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{institute.location.split(',')[0]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Global Presence</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-1 py-4">
            {navigationSections.map((section) => {
              const IconComponent = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-red-900 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">

        {/* Institute Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-16">
            {/* Mission, Vision, Values with Images */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Images */}
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src="/images/Aptech1.png"
                    alt="Aptech Campus"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-bold text-lg">Modern Learning Environment</h4>
                    <p className="text-sm opacity-90">State-of-the-art facilities for IT education</p>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="/images/Aptech2.png"
                    alt="Aptech Students"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-bold text-lg">Future Tech Leaders</h4>
                    <p className="text-sm opacity-90">Empowering students for successful careers</p>
                  </div>
                </div>
              </div>

              {/* Right side - Mission, Vision, Values */}
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-2xl font-bold text-red-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">{institute.overview.mission}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-2xl font-bold text-red-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">{institute.overview.vision}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-2xl font-bold text-red-900 mb-4">Core Values</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {institute.overview.values.map((value, index) => (
                      <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">{value.title}</h4>
                        <p className="text-gray-600 text-xs">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Achievements</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {institute.achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon === 'award' ? Award :
                                      achievement.icon === 'globe' ? Globe :
                                      achievement.icon === 'users' ? Users : Trophy
                  return (
                    <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors">
                      <IconComponent className="w-12 h-12 text-red-900 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h4>
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Industry Partners Carousel */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Industry Partners</h3>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Collaborating with leading technology companies to provide students with real-world experience and career opportunities
              </p>

              {/* Partners Carousel */}
              <div className="relative overflow-hidden">
                {/* First Row - Moving Right */}
                <div className="flex animate-scroll-right space-x-8 mb-6">
                  {[...Array(2)].map((_, setIndex) => (
                    <div key={setIndex} className="flex space-x-8 min-w-max">
                      <img src="/images/Partner/imgi_35_Microsoft.png" alt="Microsoft" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_51_FPT.png" alt="FPT" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_52_TMA.png" alt="TMA" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_34_kms.png" alt="KMS" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_48_gameloft.png" alt="Gameloft" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_47_lazada.png" alt="Lazada" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_23_cmc.png" alt="CMC" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_43_topdev.png" alt="TopDev" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    </div>
                  ))}
                </div>

                {/* Second Row - Moving Left */}
                <div className="flex animate-scroll-left space-x-8">
                  {[...Array(2)].map((_, setIndex) => (
                    <div key={setIndex} className="flex space-x-8 min-w-max">
                      <img src="/images/Partner/imgi_41_Terralogic.png" alt="Terralogic" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_42_tgdd.png" alt="TGDD" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_44_Vietsoftware.png" alt="VietSoftware" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_45_sunshine.png" alt="Sunshine" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_50_digisoft.png" alt="DigiSoft" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_27_geek-up.png" alt="GeekUp" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_38_onetech.png" alt="OneTech" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      <img src="/images/Partner/imgi_39_opticon.png" alt="Opticon" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Departments Section */}
        {activeSection === 'departments' && (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Departments</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore our specialized departments offering cutting-edge programs designed to prepare students for successful careers in technology.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {departments.map((department) => {
                const IconComponent = departmentIcons[department.icon]
                const colorClasses = {
                  blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                  green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
                  purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
                  pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
                }

                return (
                  <div
                    key={department.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={department.image}
                        alt={department.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[department.color]} opacity-80`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="w-16 h-16 text-white" />
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{department.name}</h3>
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {department.shortName}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed">{department.description}</p>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Department Head</h4>
                        <p className="text-gray-600">{department.head}</p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Programs Offered</h4>
                        <div className="space-y-2">
                          {department.programs.map((program, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-600 text-sm">{program}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {department.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button className="w-full bg-red-900 text-white py-3 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center space-x-2">
                        <span>Learn More</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Annual Events Section */}
        {activeSection === 'events' && (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Annual Events Overview</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {annualEvents.overview}
              </p>

              {/* Event Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-red-900">{annualEvents.statistics.totalEvents}</div>
                  <div className="text-sm text-gray-600">Annual Events</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-red-900">{annualEvents.statistics.annualParticipants}</div>
                  <div className="text-sm text-gray-600">Participants</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-red-900">{annualEvents.statistics.industryPartners}</div>
                  <div className="text-sm text-gray-600">Industry Partners</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-red-900">{annualEvents.statistics.internationalReach}</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
              </div>
            </div>

            {/* Event Categories */}
            <div className="space-y-12">
              {annualEvents.categories && annualEvents.categories.map((category, categoryIndex) => {
                const categoryColors = {
                  blue: 'bg-blue-50 border-blue-200 text-blue-900',
                  green: 'bg-green-50 border-green-200 text-green-900',
                  purple: 'bg-purple-50 border-purple-200 text-purple-900'
                }

                return (
                  <div key={categoryIndex} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    <div className="flex items-center mb-6">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        category.color === 'blue' ? 'bg-blue-500' :
                        category.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                    </div>

                    <p className="text-gray-600 mb-8">{category.description}</p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.events && category.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <img
                            src={event.image}
                            alt={event.name}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-gray-900">{event.name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[category.color]}`}>
                                {event.month}
                              </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{event.description}</p>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{event.duration}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Users className="w-3 h-3 mr-1" />
                                <span>{event.participants}</span>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-xs font-semibold text-gray-900 mb-2">Highlights:</h5>
                              <div className="flex flex-wrap gap-1">
                                {event.highlights && event.highlights.map((highlight, highlightIndex) => (
                                  <span
                                    key={highlightIndex}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AboutPage
