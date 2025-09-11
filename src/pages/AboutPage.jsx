import { Users, Award, Calendar, MapPin, Globe, Heart, Star, Trophy, Code, Music, Gamepad2, Building, GraduationCap, Target, BookOpen, Lightbulb, UserCheck } from 'lucide-react'

function AboutPage() {
  const collegeInfo = {
    name: 'Aptech Computer Education Center',
    affiliation: 'Affiliated with FPT University',
    location: '35/6 D5 Street, Thanh My Tay Ward, Ho Chi Minh City',
    established: '2008',
    recognition: 'Leading IT Education Provider in Vietnam'
  }

  const stats = [
    { icon: Users, label: 'Active Students', value: '500+', color: 'text-red-900' },
    { icon: Award, label: 'Annual Events', value: '50+', color: 'text-red-900' },
    { icon: Trophy, label: 'Industry Awards', value: '15+', color: 'text-red-900' },
    { icon: Globe, label: 'Years of Excellence', value: '15+', color: 'text-red-900' }
  ]

  const highlights = [
    {
      icon: GraduationCap,
      title: 'Premier IT Education',
      description: 'Leading computer education center with industry-aligned curriculum and expert faculty'
    },
    {
      icon: Building,
      title: 'Modern Campus',
      description: 'State-of-the-art facilities with advanced computer labs and learning environments'
    },
    {
      icon: UserCheck,
      title: 'Industry Partnerships',
      description: 'Strong connections with tech companies providing internships and job placements'
    },
    {
      icon: Target,
      title: 'Career Success',
      description: '95% placement rate with graduates working in top IT companies across Vietnam'
    }
  ]

  const annualEvents = {
    technical: [
      {
        name: 'TechFest',
        month: 'July',
        description: 'Annual technology festival featuring coding competitions, project exhibitions, and tech talks',
        highlights: ['Coding Marathon', 'Project Showcase', 'Industry Expert Sessions', 'Innovation Awards']
      },
      {
        name: 'Hackathon Championship',
        month: 'October',
        description: '48-hour intensive coding competition bringing together the best programming minds',
        highlights: ['Team Challenges', 'Real-world Problems', 'Mentorship', 'Cash Prizes']
      },
      {
        name: 'Robotics Championship',
        month: 'March',
        description: 'Robotics competition showcasing automation and AI projects',
        highlights: ['Robot Design', 'AI Integration', 'Automation Tasks', 'Technical Innovation']
      }
    ],
    cultural: [
      {
        name: 'Annual Day Celebration',
        month: 'December',
        description: 'Grand celebration showcasing student talents and achievements',
        highlights: ['Cultural Performances', 'Achievement Awards', 'Alumni Meet', 'Entertainment Shows']
      },
      {
        name: 'Music & Arts Night',
        month: 'April',
        description: 'Evening dedicated to music, dance, and artistic expressions',
        highlights: ['Live Performances', 'Art Exhibitions', 'Poetry Sessions', 'Creative Showcases']
      },
      {
        name: 'Cultural Week',
        month: 'August',
        description: 'Week-long celebration of diverse cultures and traditions',
        highlights: ['Cultural Displays', 'Traditional Food', 'Dance Competitions', 'Fashion Shows']
      }
    ],
    sports: [
      {
        name: 'Inter-College Sports Meet',
        month: 'February',
        description: 'Competitive sports tournament with multiple colleges participating',
        highlights: ['Cricket Tournament', 'Football Championship', 'Basketball League', 'Athletics Meet']
      },
      {
        name: 'Health & Wellness Week',
        month: 'September',
        description: 'Focus on physical and mental well-being of students',
        highlights: ['Fitness Challenges', 'Yoga Sessions', 'Health Checkups', 'Wellness Workshops']
      },
      {
        name: 'Alumni Meet & Sports Day',
        month: 'November',
        description: 'Reunion event combining networking with recreational activities',
        highlights: ['Alumni Networking', 'Sports Competitions', 'Career Guidance', 'Success Stories']
      }
    ]
  }

  const organizingBodies = [
    {
      name: 'Student Council',
      role: 'Overall event coordination and student representation',
      responsibilities: ['Event Planning', 'Student Welfare', 'Academic Support', 'Campus Activities']
    },
    {
      name: 'Technical Committee',
      role: 'Organizing technical events and competitions',
      responsibilities: ['TechFest Organization', 'Hackathon Management', 'Industry Connections', 'Technical Workshops']
    },
    {
      name: 'Cultural Committee',
      role: 'Managing cultural and artistic events',
      responsibilities: ['Cultural Programs', 'Arts & Crafts', 'Music Events', 'Creative Competitions']
    },
    {
      name: 'Sports Committee',
      role: 'Coordinating sports and recreational activities',
      responsibilities: ['Sports Tournaments', 'Fitness Programs', 'Inter-college Competitions', 'Health Initiatives']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-red-900">Aptech</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our journey in shaping tomorrow's tech leaders through excellence in education, 
            innovation in learning, and a vibrant campus community that celebrates achievement and creativity.
          </p>
        </div>

        {/* College Information */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  <span className="text-red-900">{collegeInfo.name}</span>
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-red-900" />
                    <span className="text-gray-700">{collegeInfo.affiliation}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-red-900" />
                    <span className="text-gray-700">{collegeInfo.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-red-900" />
                    <span className="text-gray-700">Established {collegeInfo.established}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-red-900" />
                    <span className="text-gray-700">{collegeInfo.recognition}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Campus Highlights */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Campus Highlights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              What makes Aptech a premier destination for technology education and career development
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <highlight.icon className="w-12 h-12 text-red-900 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{highlight.title}</h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Annual Events */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Annual Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our signature events that bring together students, industry experts, and the community throughout the year
            </p>
          </div>

          {/* Technical Events */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Code className="w-6 h-6 text-red-900 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Technical Events</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {annualEvents.technical.map((event, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{event.name}</h4>
                    <span className="bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm font-medium">{event.month}</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{event.description}</p>
                  <div className="space-y-2">
                    {event.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-red-900 rounded-full mr-2"></div>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Events */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Music className="w-6 h-6 text-red-900 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Cultural Events</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {annualEvents.cultural.map((event, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{event.name}</h4>
                    <span className="bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm font-medium">{event.month}</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{event.description}</p>
                  <div className="space-y-2">
                    {event.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-red-900 rounded-full mr-2"></div>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sports & Activities */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Gamepad2 className="w-6 h-6 text-red-900 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Sports & Activities</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {annualEvents.sports.map((event, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{event.name}</h4>
                    <span className="bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm font-medium">{event.month}</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{event.description}</p>
                  <div className="space-y-2">
                    {event.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-red-900 rounded-full mr-2"></div>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Organizing Bodies */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Organizing Bodies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated teams and committees that make our events and campus life vibrant and successful
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {organizingBodies.map((body, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-red-900 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">{body.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{body.role}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Responsibilities:</h4>
                  {body.responsibilities.map((responsibility, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-red-900 rounded-full mr-2"></div>
                      {responsibility}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
