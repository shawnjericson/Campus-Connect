import { Loader2 } from 'lucide-react'

function LoadingSpinner({ 
  size = 'default', 
  message = 'Loading...', 
  fullScreen = false,
  className = '' 
}) {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-gray-50 flex items-center justify-center'
    : 'flex items-center justify-center p-8'

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-red-900 mx-auto mb-4`} />
        {message && (
          <p className="text-gray-600 text-sm">{message}</p>
        )}
      </div>
    </div>
  )
}

export default LoadingSpinner
