import { useState, useEffect, useMemo } from 'react'

export const useEvents = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/events.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const eventsData = await response.json()
        setData(eventsData)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const events = useMemo(() => {
    if (!data?.events) return []

    // Flatten nested events structure
    let allEvents = []

    data.events.forEach(item => {
      if (item.id && item.title) {
        // Direct event object
        allEvents.push(item)
      } else if (item.events && Array.isArray(item.events)) {
        // Nested events array
        allEvents.push(...item.events)
      }
    })

    return allEvents
  }, [data])
  const categories = useMemo(() => data?.categories || [], [data])
  const faculties = useMemo(() => data?.faculties || [], [data])
  // Helper function to check registration status
  const isRegistrationOpen = useMemo(() => {
    return (event) => {
      const now = new Date()
      const registrationDeadline = new Date(event.registrationDeadline)
      const eventDate = new Date(event.date)

      // Registration is open if deadline hasn't passed and event hasn't happened yet
      return registrationDeadline >= now && eventDate >= now
    }
  }, [])

  // Simple filter functions using status from data
  const getEventsByStatus = useMemo(() => {
    return (status) => events.filter(event => event.status === status)
  }, [events])

  const getEventsByCategory = useMemo(() => {
    return (category) => events.filter(event => 
      event.category.toLowerCase() === category.toLowerCase()
    )
  }, [events])

  const getEventsByFaculty = useMemo(() => {
    return (faculty) => events.filter(event => 
      event.faculty.toLowerCase() === faculty.toLowerCase()
    )
  }, [events])

  const searchEvents = useMemo(() => {
    return (query) => {
      if (!query) return events
      const lowercaseQuery = query.toLowerCase()
      return events.filter(event =>
        event.title.toLowerCase().includes(lowercaseQuery) ||
        event.description.toLowerCase().includes(lowercaseQuery) ||
        event.organizer.toLowerCase().includes(lowercaseQuery) ||
        event.location.toLowerCase().includes(lowercaseQuery) ||
        event.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    }
  }, [events])



  const getEventById = useMemo(() => {
    return (id) => events.find(event => event.id === parseInt(id))
  }, [events])

  const filterEvents = useMemo(() => {
    return ({ category, faculty, status, search }) => {
      let filtered = events

      if (category && category !== 'all') {
        filtered = getEventsByCategory(category)
      }

      if (faculty && faculty !== 'all') {
        filtered = filtered.filter(event =>
          event.faculty.toLowerCase() === faculty.toLowerCase()
        )
      }

      if (status && status !== 'all') {
        filtered = getEventsByStatus(status)
      }

      if (search) {
        filtered = searchEvents(search)
      }

      return filtered
    }
  }, [events, getEventsByCategory, getEventsByStatus, searchEvents])

  const sortEvents = useMemo(() => {
    return (eventsList, sortBy = 'priority', sortOrder = 'asc') => {
      return [...eventsList].sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
          case 'priority':
            // Featured/priority events first
            const aPriority = a.priority || 999
            const bPriority = b.priority || 999
            comparison = aPriority - bPriority
            return sortOrder === 'desc' ? -comparison : comparison

          case 'date':
            // Sort by date: upcoming events first, then by closest date
            const today = new Date()
            today.setHours(0, 0, 0, 0) // Start of today
            const aDate = new Date(a.date)
            const bDate = new Date(b.date)

            const aIsUpcoming = aDate >= today
            const bIsUpcoming = bDate >= today

            if (aIsUpcoming && !bIsUpcoming) {
              // A upcoming, B past: A always first
              return -1
            } else if (!aIsUpcoming && bIsUpcoming) {
              // A past, B upcoming: B always first
              return 1
            } else if (aIsUpcoming && bIsUpcoming) {
              // Both upcoming: closest first
              return aDate - bDate
            } else {
              // Both past: most recent first
              return bDate - aDate
            }

          case 'name':
            // Sort by name: A-Z order (AI Summit before TECHWIZ)
            comparison = a.title.localeCompare(b.title)
            return sortOrder === 'desc' ? -comparison : comparison

          case 'category':
            comparison = a.category.localeCompare(b.category)
            return sortOrder === 'desc' ? -comparison : comparison

          default:
            return 0
        }
      })
    }
  }, [])

  return {
    events,
    categories,
    faculties,
    loading,
    error,
    // Filter functions
    getEventsByStatus,
    getEventsByCategory,
    getEventsByFaculty,
    searchEvents,
    getEventById,
    filterEvents,
    sortEvents,
    // Utility functions
    isRegistrationOpen
  }
}

export default useEvents
