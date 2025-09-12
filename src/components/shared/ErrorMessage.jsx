import { AlertCircle, RefreshCw } from 'lucide-react'

function ErrorMessage({ 
  message = 'Something went wrong', 
  onRetry = null,
  fullScreen = false,
  className = '' 
}) {
  const containerClasses = fullScreen 
    ? 'min-h-screen bg-gray-50 flex items-center justify-center'
    : 'flex items-center justify-center p-8'

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center max-w-md">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
