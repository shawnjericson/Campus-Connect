import { useState, useEffect, useMemo } from 'react'

export const useContacts = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/contacts.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const contactsData = await response.json()
        setData(contactsData)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching contacts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  const contacts = useMemo(() => data?.contacts || [], [data])
  const departments = useMemo(() => data?.departments || [], [data])
  const university = useMemo(() => data?.university || {}, [data])

  // Filter functions
  const getContactsByRole = useMemo(() => {
    return (role) => contacts.filter(contact => contact.role === role)
  }, [contacts])

  const getContactsByDepartment = useMemo(() => {
    return (department) => contacts.filter(contact => 
      contact.department.toLowerCase() === department.toLowerCase()
    )
  }, [contacts])

  const searchContacts = useMemo(() => {
    return (query) => {
      if (!query) return contacts
      const lowercaseQuery = query.toLowerCase()
      return contacts.filter(contact =>
        contact.name.toLowerCase().includes(lowercaseQuery) ||
        contact.title.toLowerCase().includes(lowercaseQuery) ||
        contact.department.toLowerCase().includes(lowercaseQuery) ||
        contact.specialization.toLowerCase().includes(lowercaseQuery) ||
        contact.email.toLowerCase().includes(lowercaseQuery)
      )
    }
  }, [contacts])

  const getContactById = useMemo(() => {
    return (id) => contacts.find(contact => contact.id === parseInt(id))
  }, [contacts])

  const getFacultyContacts = useMemo(() => {
    return contacts.filter(contact => contact.role === 'faculty')
  }, [contacts])

  const getCoordinatorContacts = useMemo(() => {
    return contacts.filter(contact => contact.role === 'coordinator')
  }, [contacts])

  const getDepartmentHead = useMemo(() => {
    return (departmentName) => {
      const department = departments.find(dept => 
        dept.name.toLowerCase() === departmentName.toLowerCase()
      )
      if (!department) return null
      
      return contacts.find(contact => 
        contact.name === department.head
      )
    }
  }, [contacts, departments])

  const filterContacts = useMemo(() => {
    return ({ role, department, search }) => {
      let filtered = contacts

      if (role && role !== 'all') {
        filtered = filtered.filter(contact => contact.role === role)
      }

      if (department && department !== 'all') {
        filtered = filtered.filter(contact => 
          contact.department.toLowerCase() === department.toLowerCase()
        )
      }

      if (search) {
        const lowercaseSearch = search.toLowerCase()
        filtered = filtered.filter(contact =>
          contact.name.toLowerCase().includes(lowercaseSearch) ||
          contact.title.toLowerCase().includes(lowercaseSearch) ||
          contact.department.toLowerCase().includes(lowercaseSearch) ||
          contact.specialization.toLowerCase().includes(lowercaseSearch) ||
          contact.email.toLowerCase().includes(lowercaseSearch)
        )
      }

      return filtered
    }
  }, [contacts])

  const sortContacts = useMemo(() => {
    return (contactsList, sortBy = 'name', order = 'asc') => {
      return [...contactsList].sort((a, b) => {
        let aValue, bValue

        switch (sortBy) {
          case 'name':
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
            break
          case 'title':
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case 'department':
            aValue = a.department.toLowerCase()
            bValue = b.department.toLowerCase()
            break
          case 'role':
            aValue = a.role.toLowerCase()
            bValue = b.role.toLowerCase()
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
    contacts,
    departments,
    university,
    loading,
    error,
    // Filter functions
    getContactsByRole,
    getContactsByDepartment,
    searchContacts,
    getContactById,
    getFacultyContacts,
    getCoordinatorContacts,
    getDepartmentHead,
    filterContacts,
    sortContacts
  }
}

// Remove default export since we're using named export
