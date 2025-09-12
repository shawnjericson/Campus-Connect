import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bookmark, Cpu, Zap, Home, Info, Calendar, Image, Phone, MessageSquare } from 'lucide-react'
import { useBookmarks } from '../contexts/BookmarkContext'
import BookmarkIndicator from './BookmarkIndicator'

function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { count } = useBookmarks()

  // Handle scroll effect for glass morphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Gallery', href: '/gallery', icon: Image },
    { name: 'Contact', href: '/contact', icon: Phone },
    { name: 'Feedback', href: '/feedback', icon: MessageSquare }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'backdrop-blur-xl bg-white/95 border-b border-gray-200 shadow-lg'
        : 'backdrop-blur-md bg-white/90 border-b border-gray-100'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - CampusConnect */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-24 h-16 rounded-md flex items-center justify-center group-hover:shadow-orange-500/25 transition-all duration-300 group-hover:scale-105 " style={{ backgroundColor: '#ffffff' }}>
                <img
                  src="/images/Campusconnect1.jpg"
                  alt="CampusConnect Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="w-48 h-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1680 320" width="100%" height="100%" role="img" aria-label="CampusConnect — Ribbon">
                  <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700;800&display=swap');
                    .w{ fill:#760009; font-family:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",Roboto,Arial; }`}
                  </style>
                  <text x="60" y="190" className="w" fontSize="200" fontWeight="700">Campus </text>
                  <text x="890" y="190" className="w" fontSize="200" fontWeight="800">Connect</text>
                </svg>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Glass Morphism Style */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-red-900 bg-red-50 border border-red-200 shadow-sm'
                      : 'text-gray-700 hover:text-red-900 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <span>{item.name}</span>
                  </div>
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-900 rounded-full"></div>
                  )}
                </Link>
              )
            })}

            {/* Bookmark Indicator - Tech Style */}
            <div className="mx-2">
              <BookmarkIndicator />
            </div>


          </div>

          {/* Mobile menu button - Light Style */}
          <div className="md:hidden flex items-center space-x-3">
            <BookmarkIndicator />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 hover:text-red-900 hover:border-red-300 hover:bg-red-50 focus:outline-none transition-all duration-300"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Light Theme */}
        {isOpen && (
          <div className="md:hidden">
            <div className="backdrop-blur-xl bg-white/95 border-t border-gray-200 px-4 pt-4 pb-6 space-y-2 shadow-lg">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-red-900 bg-red-50 border border-red-200 shadow-sm'
                        : 'text-gray-700 hover:text-red-900 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavigationBar
