import { useState, useEffect, useMemo } from 'react'
import { API_ENDPOINTS, ERROR_MESSAGES } from '../constants'

export const useContactsInfo = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchContactsInfo = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(API_ENDPOINTS.CONTACTS)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const contactsData = await response.json()
        setData(contactsData)
      } catch (err) {
        console.error('Error fetching contacts info:', err)
        setError(err.message || ERROR_MESSAGES.DATA_LOAD_ERROR)
      } finally {
        setLoading(false)
      }
    }

    fetchContactsInfo()
  }, [])

  // Memoized data extractions
  const university = useMemo(() => data?.university || {}, [data])
  const facultyMembers = useMemo(() => data?.faculty || [], [data])
  const studentCoordinators = useMemo(() => data?.student_coordinators || [], [data])
  const departments = useMemo(() => data?.departments || [], [data])
  const contactInfo = useMemo(() => data?.contact_info || {}, [data])
  const officeHours = useMemo(() => data?.office_hours || {}, [data])

  // Filter functions
  const getFacultyByDepartment = useMemo(() => {
    return (department) => facultyMembers.filter(member => 
      member.department?.toLowerCase() === department.toLowerCase()
    )
  }, [facultyMembers])

  const getCoordinatorsByRole = useMemo(() => {
    return (role) => studentCoordinators.filter(coordinator => 
      coordinator.designation?.toLowerCase().includes(role.toLowerCase())
    )
  }, [studentCoordinators])

  const getDepartmentByName = useMemo(() => {
    return (name) => departments.find(dept => 
      dept.name?.toLowerCase() === name.toLowerCase()
    )
  }, [departments])

  // Utility functions
  const getAllContacts = useMemo(() => {
    return [...facultyMembers, ...studentCoordinators]
  }, [facultyMembers, studentCoordinators])

  const searchContacts = useMemo(() => {
    return (query) => {
      if (!query) return getAllContacts
      
      const searchTerm = query.toLowerCase()
      return getAllContacts.filter(contact =>
        contact.name?.toLowerCase().includes(searchTerm) ||
        contact.designation?.toLowerCase().includes(searchTerm) ||
        contact.department?.toLowerCase().includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm)
      )
    }
  }, [getAllContacts])

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
    university,
    facultyMembers,
    studentCoordinators,
    departments,
    contactInfo,
    officeHours,
    
    // Filter functions
    getFacultyByDepartment,
    getCoordinatorsByRole,
    getDepartmentByName,
    
    // Utility functions
    getAllContacts,
    searchContacts,
    retry
  }
}

export default useContactsInfo
