import { useState, useEffect } from 'react'

const useUpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUpcomingEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/upcoming-events.json')
        if (!response.ok) {
          throw new Error('Failed to load upcoming events')
        }
        const data = await response.json()
        setUpcomingEvents(data.upcomingEvents || [])
      } catch (err) {
        console.error('Error loading upcoming events:', err)
        setError(err.message)
        // Fallback data
        setUpcomingEvents([
          {
            id: 1,
            title: "TechFest 2025",
            date: "July 20, 2025",
            time: "09:00 AM",
            shortDescription: "Annual technology festival featuring cutting-edge innovations and networking opportunities.",
            thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&crop=center",
            category: "Technology",
            featured: true,
            countdown: {
              enabled: true,
              targetDate: "2025-07-20T09:00:00"
            }
          },
          {
            id: 2,
            title: "Cultural Week Begins",
            date: "August 5, 2025",
            time: "10:00 AM",
            shortDescription: "Celebrate diversity with traditional performances, food festivals, and cultural exhibitions.",
            thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop&crop=center",
            category: "Cultural",
            featured: true,
            countdown: {
              enabled: true,
              targetDate: "2025-08-05T10:00:00"
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadUpcomingEvents()
  }, [])

  // Helper functions
  const getFeaturedEvents = () => {
    return upcomingEvents.filter(event => event.featured)
  }

  const getEventsByCategory = (category) => {
    return upcomingEvents.filter(event => 
      event.category.toLowerCase() === category.toLowerCase()
    )
  }

  const getUpcomingEventsLimit = (limit = 6) => {
    return upcomingEvents.slice(0, limit)
  }

  // Calculate countdown for an event
  const getCountdown = (targetDate) => {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const difference = target - now

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      
      return {
        days,
        hours,
        minutes,
        isActive: true
      }
    }
    
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      isActive: false
    }
  }

  return {
    upcomingEvents,
    loading,
    error,
    getFeaturedEvents,
    getEventsByCategory,
    getUpcomingEventsLimit,
    getCountdown
  }
}

export default useUpcomingEvents
