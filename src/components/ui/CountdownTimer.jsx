import { useCountdown } from '../../hooks/useCountdown'

function CountdownTimer({ targetDate, className = "" }) {
  const countdown = useCountdown(targetDate)

  if (!countdown.isActive) {
    return <span className={`text-red-600 font-medium ${className}`}>Event Started</span>
  }

  return (
    <div className={`flex items-center space-x-4 text-sm ${className}`}>
      <div className="text-center">
        <div className="text-red-600 font-bold text-lg">{countdown.days}</div>
        <div className="text-gray-600 text-xs">Days</div>
      </div>
      <div className="text-center">
        <div className="text-red-600 font-bold text-lg">{countdown.hours}</div>
        <div className="text-gray-600 text-xs">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-red-600 font-bold text-lg">{countdown.minutes}</div>
        <div className="text-gray-600 text-xs">Minutes</div>
      </div>
    </div>
  )
}

export default CountdownTimer