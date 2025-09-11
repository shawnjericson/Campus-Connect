import { Routes, Route } from 'react-router-dom'
import { BookmarkProvider } from './contexts/BookmarkContext'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'

// Pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import EventsPage from './pages/EventsPage'
import ContactPage from './pages/ContactPage'
import FeedbackPage from './pages/FeedbackPage'
import GalleryPage from './pages/GalleryPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-slate-900">
        <NavigationBar />

        <main className="min-h-screen pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BookmarkProvider>
  )
}

export default App
