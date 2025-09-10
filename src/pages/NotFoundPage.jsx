import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="text-center max-w-md mx-auto relative z-10">
        <div className="mb-8">
          <div className="text-9xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-lg text-slate-300 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-slate-800 text-cyan-400 px-6 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 shadow-lg border border-cyan-400/20 hover:border-cyan-400/40"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <div className="mt-12 text-sm text-slate-400">
          <p>If you believe this is an error, please <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 hover:underline">contact us</Link>.</p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
