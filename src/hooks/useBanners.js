import { useState, useEffect } from 'react'

export function useBanners() {
  const [banners, setBanners] = useState({
    welcomeMessages: [],
    bannerSlides: [],
    collegeInfo: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/banners.json')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setBanners(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching banner data:', err)
        setError(err.message)
        // Fallback data
        setBanners({
          welcomeMessages: [{
            id: 1,
            title: "Welcome to CampusConnect",
            subtitle: "Stay Updated, Stay Involved!",
            description: "Connect with your community and discover amazing events.",
            badge: "LIVE SYSTEM",
            active: true
          }],
          bannerSlides: [],
          collegeInfo: {
            name: "Aptech Computer Education Center",
            shortName: "Aptech",
            tagline: "Shaping Tomorrow's Tech Leaders"
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Get active welcome message
  const getActiveWelcomeMessage = () => {
    return banners.welcomeMessages.find(msg => msg.active) || banners.welcomeMessages[0]
  }

  // Get featured banner slides
  const getFeaturedSlides = () => {
    return banners.bannerSlides.filter(slide => slide.featured)
  }

  // Get slides by category
  const getSlidesByCategory = (category) => {
    return banners.bannerSlides.filter(slide => 
      slide.category.toLowerCase() === category.toLowerCase()
    )
  }

  return {
    banners,
    loading,
    error,
    getActiveWelcomeMessage,
    getFeaturedSlides,
    getSlidesByCategory,
    welcomeMessages: banners.welcomeMessages,
    bannerSlides: banners.bannerSlides,
    collegeInfo: banners.collegeInfo
  }
}

export default useBanners
