import { Routes, Route } from 'react-router-dom'
import { BookmarkProvider } from './contexts/BookmarkContext'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'

// Pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import ContactPage from './pages/ContactPage'
import FeedbackPage from './pages/FeedbackPage'
import GalleryPage from './pages/GalleryPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import ChatBotWidget from './widget/chat_bot_widget'
import { useEvents } from './hooks/useEvents'

function App() {
  const { events } = useEvents()

  // Convert events data to chatbot format
  const chatbotEvents = events.map(event => ({
    id: event.id.toString(),
    title: event.title,
    date: event.date,
    location: event.location,
    tags: event.tags || [event.category?.toLowerCase()],
    url: `/events/${event.id}`,
    summary: event.description
  }))

  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />

        <main className="min-h-screen pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />

        <ChatBotWidget
          events={chatbotEvents}
          title="CampusConnect Assistant"
          greeting="Chào bạn! Mình có thể giúp tìm sự kiện tại CampusConnect. Hãy thử: 'events today', 'events this week', hoặc 'events tag:technical'."
          suggestions={[
            "events today",
            "events this week",
            "events tag:technical",
            "events tag:cultural"
          ]}
        />
      </div>
    </BookmarkProvider>
  )
}

export default App
