import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Calendar, Users, BookOpen, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
    { name: 'Feedback', href: '/feedback' }
  ]

  const eventCategories = [
    { name: 'Technology Events', href: '/events?category=technology' },
    { name: 'Cultural Programs', href: '/events?category=cultural' },
    { name: 'Academic Seminars', href: '/events?category=academic' },
    { name: 'Career Development', href: '/events?category=career' },
    { name: 'Student Activities', href: '/events?category=student' },
    { name: 'Workshops', href: '/events?category=workshop' }
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <div className="w-48 h-8 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1680 320" width="100%" height="100%" role="img" aria-label="CampusConnect — Ribbon">
                  <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700;800&display=swap');
                    .w{ fill:#760009; font-family:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",Roboto,Arial; }`}
                  </style>
                  <text x="60" y="190" className="w" fontSize="200" fontWeight="700">Campus </text>
                  <text x="880" y="190" className="w" fontSize="200" fontWeight="800">Connect</text>
                  <path d="M60 210 C 360 240, 540 240, 625 210 S 980 170, 1820 200" fill="none" stroke="#760009" strokeWidth="18" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced Event Management System for Aptech Computer Education Center.
                Stay connected with your tech community and discover amazing events.
              </p>
            </div>

            {/* Partner Logos */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Our Partners</h4>
              <div className="flex items-center space-x-4">
                <img
                  src="/images/Logo1.png"
                  alt="Partner Logo 1"
                  className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
                <img
                  src="/images/Logo2.png"
                  alt="Partner Logo 2"
                  className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
                <img
                  src="/images/Logo3.png"
                  alt="Partner Logo 3"
                  className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-4 h-4 text-red-900 mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-red-900 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-4 h-4 text-red-900 mr-2" />
              Event Categories
            </h4>
            <ul className="space-y-2">
              {eventCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.href}
                    className="text-gray-600 hover:text-red-900 transition-colors duration-300 text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-4 h-4 text-red-900 mr-2" />
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-red-900 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    35/6 đường D5, Phường Thạnh Mỹ Tây<br />
                    Ho Chi Minh City, Vietnam
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-red-900 flex-shrink-0" />
                <a
                  href="tel:18001779"
                  className="text-gray-600 hover:text-red-900 transition-colors duration-300 text-sm"
                >
                  1800 1779
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-red-900 flex-shrink-0" />
                <a
                  href="mailto:aptech2@aprotrain.com"
                  className="text-gray-600 hover:text-red-900 transition-colors duration-300 text-sm"
                >
                  aptech2@aprotrain.com
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Campus Stats</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-red-600 font-bold">500+</div>
                  <div className="text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-bold">50+</div>
                  <div className="text-gray-600">Events/Year</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-bold">20+</div>
                  <div className="text-gray-600">Programs</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-bold">15+</div>
                  <div className="text-gray-600">Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                © {currentYear} CampusConnect - Aptech Computer Education Center. All rights reserved.
              </p>
            </div>

            {/* Team Signature */}
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm flex items-center justify-center md:justify-end">
                Made with
                <Heart className="w-3 h-3 text-red-600 mx-1" />
                by <span className="font-semibold text-red-600 ml-1">Concurrency</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
