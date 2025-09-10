import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bookmark, Cpu, Zap, Home, Info, Calendar, Image, Phone, MessageSquare, UserPlus } from 'lucide-react'
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
        ? 'backdrop-blur-xl bg-slate-900/90 border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10'
        : 'backdrop-blur-md bg-slate-900/70 border-b border-slate-700/30'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - MIT Tech Style */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300 group-hover:scale-105 border border-cyan-400/20">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black relative tracking-tight">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Campus
                </span>
                <span className="text-white font-extrabold text-shadow-lg ml-0.5">
                  Connect
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 blur-lg -z-10 opacity-50"></span>
              </span>
              <span className="text-xs text-cyan-300 font-semibold tracking-[0.2em] uppercase opacity-90">
                <span className="inline-block w-1 h-1 bg-cyan-400 rounded-full mr-1 animate-pulse"></span>
                APTECH EVENT CENTER
                <span className="inline-block w-1 h-1 bg-cyan-400 rounded-full ml-1 animate-pulse"></span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Glass Morphism Style */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"></div>
                  )}
                </Link>
              )
            })}

            {/* Bookmark Indicator - Tech Style */}
            <div className="mx-2">
              <BookmarkIndicator />
            </div>

            {/* Register Button - MIT Style */}
            <Link
              to="/register"
              className="relative group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 border border-cyan-400/20"
            >
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Mobile menu button - Tech Style */}
          <div className="md:hidden flex items-center space-x-3">
            <BookmarkIndicator />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 focus:outline-none transition-all duration-300"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Glass Morphism */}
        {isOpen && (
          <div className="md:hidden">
            <div className="backdrop-blur-xl bg-slate-900/95 border-t border-slate-700/50 px-4 pt-4 pb-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                        : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <Link
                to="/register"
                className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 mt-4 shadow-lg border border-cyan-400/20"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavigationBar
