import { useState, useEffect, useMemo } from 'react'
import { API_ENDPOINTS, ERROR_MESSAGES } from '../constants'

export const useAbout = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(API_ENDPOINTS.ABOUT)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const aboutData = await response.json()
        setData(aboutData)
      } catch (err) {
        console.error('Error fetching about data:', err)
        setError(err.message || ERROR_MESSAGES.DATA_LOAD_ERROR)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  // Memoized data extractions
  const institute = useMemo(() => data?.institute || {}, [data])
  const departments = useMemo(() => data?.departments || [], [data])
  const facilities = useMemo(() => data?.facilities || [], [data])
  const achievements = useMemo(() => data?.achievements || [], [data])
  const history = useMemo(() => data?.history || {}, [data])
  const annualEvents = useMemo(() => data?.annualEvents || {}, [data])

  // Filter functions
  const getDepartmentById = useMemo(() => {
    return (id) => departments.find(dept => dept.id === id)
  }, [departments])

  const getDepartmentsByType = useMemo(() => {
    return (type) => departments.filter(dept => 
      dept.type?.toLowerCase() === type.toLowerCase()
    )
  }, [departments])

  const getFacilitiesByCategory = useMemo(() => {
    return (category) => facilities.filter(facility => 
      facility.category?.toLowerCase() === category.toLowerCase()
    )
  }, [facilities])

  const getAchievementsByYear = useMemo(() => {
    return (year) => achievements.filter(achievement => 
      achievement.year === year
    )
  }, [achievements])

  // Utility functions
  const searchDepartments = useMemo(() => {
    return (query) => {
      if (!query) return departments
      
      const searchTerm = query.toLowerCase()
      return departments.filter(dept =>
        dept.name?.toLowerCase().includes(searchTerm) ||
        dept.description?.toLowerCase().includes(searchTerm) ||
        dept.head?.toLowerCase().includes(searchTerm)
      )
    }
  }, [departments])

  const getRecentAchievements = useMemo(() => {
    return (limit = 5) => {
      return achievements
        .sort((a, b) => b.year - a.year)
        .slice(0, limit)
    }
  }, [achievements])

  const retry = () => {
    setError(null)
    setLoading(true)
    // Re-trigger the useEffect
    window.location.reload()
  }

  return {
    // Raw data
    data,
    loading,
    error,
    
    // Processed data
    institute,
    departments,
    facilities,
    achievements,
    history,
    annualEvents,
    
    // Filter functions
    getDepartmentById,
    getDepartmentsByType,
    getFacilitiesByCategory,
    getAchievementsByYear,
    
    // Utility functions
    searchDepartments,
    getRecentAchievements,
    retry
  }
}

export default useAbout
