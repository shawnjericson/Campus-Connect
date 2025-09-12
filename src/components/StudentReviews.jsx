import { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'

function StudentReviews() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  // Reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Computer Science Student",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "The TECHWIZ competition was absolutely incredible! The organization was flawless and I learned so much from other participants. Can't wait for next year!",
      event: "TECHWIZ 6 2025"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "AI Research Assistant",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "AI & Machine Learning Summit opened my eyes to the future of technology. The speakers were world-class and the networking opportunities were amazing!",
      event: "AI & Machine Learning Summit"
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Software Engineering Student",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Best tech event I've ever attended! The hands-on workshops were incredibly valuable and the community here is so supportive and inspiring.",
      event: "Student Innovation Showcase"
    },
    {
      id: 4,
      name: "David Park",
      role: "Data Science Graduate",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Aptech events consistently deliver high-quality content and amazing networking opportunities. The innovation showcased here is truly cutting-edge!",
      event: "Career Fair 2025"
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "UX/UI Designer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "The creative workshops and design thinking sessions were phenomenal. I gained new perspectives and made connections that will last a lifetime!",
      event: "Winter Graduation"
    }
  ]

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [reviews.length])

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-red-100 border border-red-200 rounded-full px-4 py-2 mb-6">
            <Quote className="w-4 h-4 text-red-600" />
            <span className="text-red-600 text-sm font-medium tracking-wider">STUDENT REVIEWS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-red-900">
              What Our Community Says
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our amazing students and participants about their experiences at our events
          </p>
        </div>

        {/* Review Card with Fade Animation */}
        <div className="max-w-4xl mx-auto">
          <div className="relative h-80 flex items-center justify-center">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentReviewIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="bg-white/90 backdrop-blur-sm border border-red-200 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  {/* Stars */}
                  <div className="flex justify-center space-x-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-xl md:text-2xl text-gray-800 font-light leading-relaxed mb-8 italic">
                    "{review.review}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-300">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-gray-900">{review.name}</h4>
                      <p className="text-red-600 text-sm">{review.role}</p>
                      <p className="text-gray-500 text-xs mt-1">Event: {review.event}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Review Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReviewIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentReviewIndex
                    ? 'bg-red-600 scale-125'
                    : 'bg-gray-300 hover:bg-red-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StudentReviews
