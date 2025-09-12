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
    return (eventsList, sortBy = 'date', order = 'asc') => {
      return [...eventsList].sort((a, b) => {
        let aValue, bValue

        switch (sortBy) {
          case 'date':
            aValue = new Date(a.date)
            bValue = new Date(b.date)
            break
          case 'title':
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case 'category':
            aValue = a.category.toLowerCase()
            bValue = b.category.toLowerCase()
            break
          case 'participants':
            aValue = a.currentParticipants || a.attendees || 0
            bValue = b.currentParticipants || b.attendees || 0
            break
          default:
            return 0
        }

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
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
