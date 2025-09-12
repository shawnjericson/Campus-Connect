// API Endpoints
export const API_ENDPOINTS = {
  EVENTS: '/data/events.json',
  CONTACTS: '/data/contacts-info.json',
  ABOUT: '/data/about-info.json',
  BANNERS: '/data/banners.json'
}

// Storage Keys
export const STORAGE_KEYS = {
  BOOKMARKS: 'campusconnect_bookmarks',
  LANGUAGE: 'campusconnect_language',
  THEME: 'campusconnect_theme'
}

// Event Status
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  PAST: 'past'
}

// Event Categories
export const EVENT_CATEGORIES = {
  ALL: 'all',
  TECHNICAL: 'Technical',
  CULTURAL: 'Cultural',
  SPORTS: 'Sports',
  ACADEMIC: 'Academic',
  DEPARTMENTAL: 'Departmental'
}

// Gallery Categories
export const GALLERY_CATEGORIES = {
  ALL: 'all',
  TECHNICAL: 'Technical',
  CULTURAL: 'Cultural',
  SPORT: 'Sport'
}

// Sort Options
export const SORT_OPTIONS = {
  PRIORITY: 'priority',
  DATE: 'date',
  NAME: 'name',
  CATEGORY: 'category'
}

// Sort Order
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc'
}

// Contact Tabs
export const CONTACT_TABS = {
  FACULTY: 'faculty',
  COORDINATORS: 'coordinators',
  DEPARTMENTS: 'departments'
}

// About Sections
export const ABOUT_SECTIONS = {
  OVERVIEW: 'overview',
  HISTORY: 'history',
  DEPARTMENTS: 'departments',
  FACILITIES: 'facilities',
  ACHIEVEMENTS: 'achievements'
}

// Feedback Categories
export const FEEDBACK_CATEGORIES = {
  EVENT: 'event',
  FACILITY: 'facility',
  SERVICE: 'service',
  SUGGESTION: 'suggestion',
  COMPLAINT: 'complaint',
  OTHER: 'other'
}

// User Types
export const USER_TYPES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  STAFF: 'staff',
  VISITOR: 'visitor'
}

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  SLIDER: 5000
}

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

// Default Values
export const DEFAULTS = {
  EVENTS_PER_PAGE: 12,
  GALLERY_IMAGES_PER_PAGE: 20,
  SEARCH_DEBOUNCE: 300,
  TOAST_DURATION: 3000,
  SLIDER_AUTO_PLAY: true,
  SLIDER_INTERVAL: 5000
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  DATA_LOAD_ERROR: 'Failed to load data. Please try again.',
  EVENT_NOT_FOUND: 'Event not found.',
  INVALID_INPUT: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  BOOKMARK_ADDED: 'Event bookmarked successfully!',
  BOOKMARK_REMOVED: 'Bookmark removed successfully!',
  FEEDBACK_SENT: 'Thank you for your feedback!',
  REGISTRATION_SUCCESS: 'Registration successful!'
}

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[\d\s\-\(\)]{10,}$/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000
}

// Image Fallbacks
export const FALLBACK_IMAGES = {
  EVENT: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center',
  AVATAR: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  BANNER: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop&crop=center'
}

// App Config
export const APP_CONFIG = {
  NAME: 'CampusConnect',
  DESCRIPTION: 'Student Event Management System',
  VERSION: '1.0.0',
  AUTHOR: 'Aptech Computer Education Center',
  CONTACT_EMAIL: 'aptech2@aprotrain.com',
  CONTACT_PHONE: '1800 1779'
}
