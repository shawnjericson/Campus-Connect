import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Cpu, Zap, Github, Linkedin } from 'lucide-react'

function Footer() {
  return (
    <footer className="relative bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 text-white overflow-hidden">
      {/* Tech Background Pattern */}
      <div className="absolute inset-0 tech-grid opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand - MIT Tech Style */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-circuit border border-cyan-400/20">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  CampusConnect
                </span>
                <span className="text-xs text-slate-400 font-medium tracking-wider">
                  APTECH EVENT CENTER
                </span>
              </div>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Advanced Event Management System • Connecting the future of education through technology and innovation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-cyan-400 circuit-line">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Events</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Gallery</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-cyan-400 circuit-line">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/register" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Registration</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Feedback</span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-cyan-400 circuit-line">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 group-hover:border-cyan-500/30 transition-all duration-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <span className="text-slate-300 text-sm">144 Xuan Thuy, Cau Giay</span>
                  <br />
                  <span className="text-slate-400 text-xs">Hanoi, Vietnam</span>
                </div>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 group-hover:border-cyan-500/30 transition-all duration-300">
                  <Phone className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-slate-300 text-sm">(024) 3869-2222</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 group-hover:border-cyan-500/30 transition-all duration-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-slate-300 text-sm">info@aptech.edu.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Tech Style */}
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-slate-400 text-sm">
                © 2024 CampusConnect • Aptech Event Center
              </p>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-500">System Online</span>
              </div>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                API Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
