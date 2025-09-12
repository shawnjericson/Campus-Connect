import { useState, useEffect } from 'react'

export const useCountdown = (targetDate) => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isActive: false })

  const calculateCountdown = (target) => {
    const now = new Date().getTime()
    const targetTime = new Date(target).getTime()
    const difference = targetTime - now

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds, isActive: true }
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0, isActive: false }
  }

  useEffect(() => {
    if (!targetDate) return

    const timer = setInterval(() => {
      setCountdown(calculateCountdown(targetDate))
    }, 1000)

    // Initial calculation
    setCountdown(calculateCountdown(targetDate))

    return () => clearInterval(timer)
  }, [targetDate])

  return countdown
}