import { useEffect, useMemo, useRef, useState } from "react";

/**
 * ChatBotWidget.jsx
 * Enhanced floating chatbot for bottom-right corner. Supports:
 *  - Event lookup from your data with intelligent English responses
 *  - Natural date parsing: "today", "tomorrow", "this week", "next week", or "on 2025-09-30"
 *  - Filters: "in <location>", "tag:<tag>", categories, status
 *  - Smart conversation handling with contextual responses
 *  - Keyboard a11y, localStorage persistence, and quick suggestions
 */

function ChatBotWidget({
  events = [],
  title = "Assistant",
  greeting = "Hello! How can I help you find campus events?",
  suggestions = ["events today", "upcoming events", "technical events"],
  onSendToOpenAI = null,
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const scrollRef = useRef(null);

  // Enhanced date parsing
  function resolveDateRange(token) {
    const now = new Date();
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
    const startOfWeek = (d) => {
      const diff = d.getDay() === 0 ? 6 : d.getDay() - 1;
      const monday = new Date(d);
      monday.setDate(d.getDate() - diff);
      return startOfDay(monday);
    };
    const endOfWeek = (d) => {
      const e = startOfWeek(d);
      e.setDate(e.getDate() + 6);
      return endOfDay(e);
    };

    const lower = token.toLowerCase();
    if (lower === "today") {
      return { from: startOfDay(now), to: endOfDay(now) };
    }
    if (lower === "tomorrow") {
      const t = new Date(now);
      t.setDate(now.getDate() + 1);
      return { from: startOfDay(t), to: endOfDay(t) };
    }
    if (lower === "this week") {
      return { from: startOfWeek(now), to: endOfWeek(now) };
    }
    if (lower === "next week") {
      const n = new Date(now);
      n.setDate(now.getDate() + 7);
      return { from: startOfWeek(n), to: endOfWeek(n) };
    }
    return null;
  }

  function parseExplicitDate(str) {
    const m = str.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`);
    if (isNaN(d.getTime())) return null;
    return { from: d, to: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59) };
  }

  function interpretQuery(query) {
    const q = query.trim();
    const lower = q.toLowerCase();

    // Date keywords
    const dateTokens = ["today", "tomorrow", "this week", "next week"];
    for (const token of dateTokens) {
      if (lower.includes(token)) {
        return { type: "events", range: resolveDateRange(token), location: extractLocation(lower), tag: extractTag(lower), category: extractCategory(lower), status: extractStatus(lower) };
      }
    }

    // Explicit date
    const explicit = parseExplicitDate(lower);
    if (explicit) {
      return { type: "events", range: explicit, location: extractLocation(lower), tag: extractTag(lower), category: extractCategory(lower), status: extractStatus(lower) };
    }

    // Enhanced event search - more intelligent parsing
    const eventKeywords = [
      'event', 'events', 'meetup', 'workshop', 'webinar', 'hackathon', 'conference', 'seminar', 'training',
      'show', 'find', 'search', 'list', 'upcoming', 'ongoing', 'past', 'technical', 'cultural', 'sport',
      'technology', 'programming', 'coding', 'career', 'graduation', 'innovation', 'fair', 'ceremony',
      'happening', 'schedule', 'calendar', 'activities', 'programs', 'sessions', 'classes'
    ];
    
    // More flexible matching - check if it's likely an event query
    const hasEventKeyword = eventKeywords.some(keyword => lower.includes(keyword));
    const hasQuestionWords = /\b(what|when|where|how|which|any|tell|help|info|information)\b/.test(lower);
    const hasTimeWords = /\b(today|tomorrow|week|month|now|soon|later|next|this)\b/.test(lower);
    
    // If it mentions events OR asks questions about time/activities, treat as event search
    if (hasEventKeyword || (hasQuestionWords && hasTimeWords) || lower.includes("campus") || lower.includes("university")) {
      return { type: "events", range: null, location: extractLocation(lower), tag: extractTag(lower), category: extractCategory(lower), status: extractStatus(lower) };
    }

    // Fallback: small talk or route to OpenAI if available
    return { type: "chat" };
  }

  function extractTag(lower) {
    const m = lower.match(/tag:([a-z0-9_-]+)/i);
    return m ? m[1].toLowerCase() : null;
  }

  function extractLocation(lower) {
    const m = lower.match(/\bin\s+([a-zA-ZÀ-ỹ\s]+)$/i);
    if (m) return m[1].trim();
    const m2 = lower.match(/in\s+([a-zA-ZÀ-ỹ\s]+)(?=\s|$)/i);
    return m2 ? m2[1].trim() : null;
  }

  function extractCategory(lower) {
    const categories = {
      'technical': ['technical', 'tech', 'technology', 'programming', 'coding', 'it', 'software', 'development'],
      'cultural': ['cultural', 'culture', 'art', 'music', 'festival', 'celebration'],
      'sport': ['sport', 'sports', 'athletic', 'competition', 'tournament', 'game'],
      'academic': ['academic', 'education', 'seminar', 'conference', 'research'],
      'career': ['career', 'job', 'employment', 'recruitment', 'fair', 'hiring']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        return category;
      }
    }
    return null;
  }

  function extractStatus(lower) {
    if (lower.includes('upcoming') || lower.includes('future') || lower.includes('sắp tới')) {
      return 'upcoming';
    }
    if (lower.includes('ongoing') || lower.includes('current') || lower.includes('happening') || lower.includes('đang diễn ra')) {
      return 'ongoing';
    }
    if (lower.includes('past') || lower.includes('previous') || lower.includes('finished') || lower.includes('đã qua')) {
      return 'past';
    }
    return null;
  }

  function withinRange(dateISO, range) {
    if (!range) return true;
    const t = new Date(dateISO).getTime();
    return t >= range.from.getTime() && t <= range.to.getTime();
  }

  function filterEvents(events, { range, location, tag, category, status }) {
    return events.filter((e) => {
      if (range && !withinRange(e.date, range)) return false;
      if (location && !e.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (tag && !(e.tags || []).map((t) => t.toLowerCase()).includes(tag.toLowerCase())) return false;
      if (category && e.category && !e.category.toLowerCase().includes(category.toLowerCase())) return false;
      if (status && e.status && e.status.toLowerCase() !== status.toLowerCase()) return false;
      return true;
    });
  }

  function getSmartResponse(message) {
    // Greeting responses
    if (/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(message)) {
      return "Hello! I'm your CampusConnect assistant. I can help you find events on campus. Try asking: 'What events are happening today?' or 'Show me technical events'.";
    }
    
    // Help requests
    if (/\b(help|what can you do|how|guide)\b/.test(message)) {
      return "I can help you find campus events! Here are some examples:\n• 'events today' - Today's events\n• 'upcoming technical events' - Technical events coming up\n• 'cultural events this week' - Cultural events this week\n• 'what's happening tomorrow?' - Tomorrow's schedule";
    }
    
    // Thank you responses
    if (/\b(thank|thanks|thx)\b/.test(message)) {
      return "You're welcome! Feel free to ask about any campus events. I'm here to help! 😊";
    }
    
    // Goodbye responses
    if (/\b(bye|goodbye|see you|later)\b/.test(message)) {
      return "Goodbye! Come back anytime to check for new campus events. Have a great day! 👋";
    }
    
    // Default intelligent response
    return "I can help you find campus events! Try asking about:\n• Specific dates: 'events today', 'events tomorrow'\n• Categories: 'technical events', 'cultural events', 'sport events'\n• Time periods: 'events this week', 'upcoming events'\n\nWhat would you like to know about?";
  }

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, open]);

  useEffect(() => {
    // Seed greeting on first load
    if (history.length === 0) {
      setHistory((h) => [
        ...h,
        { role: "assistant", content: greeting, ts: Date.now() },
      ]);
    }
  }, []);

  useEffect(() => {
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  async function handleSend(text) {
    const message = text ?? input;
    if (!message.trim()) return;

    setHistory((h) => [...h, { role: "user", content: message, ts: Date.now() }]);
    setInput("");

    const intent = interpretQuery(message);

    if (intent.type === "events") {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 350)); // Small UX delay
      const matches = filterEvents(events, intent);

      if (matches.length === 0) {
        // Generate helpful response based on what they searched for
        let helpfulMsg = "I couldn't find any events matching your criteria. ";
        
        if (intent.range) {
          helpfulMsg += "Try searching for a different time period. ";
        }
        if (intent.category) {
          helpfulMsg += `No ${intent.category} events found. Try 'technical events', 'cultural events', or 'sport events'. `;
        }
        if (intent.status) {
          helpfulMsg += `No ${intent.status} events available. Try 'upcoming events' or 'ongoing events'. `;
        }
        
        helpfulMsg += "You can also try: 'events today', 'events this week', or just 'events' to see all.";
        
        setHistory((h) => [
          ...h,
          {
            role: "assistant",
            content: helpfulMsg,
            ts: Date.now(),
          },
        ]);
      } else {
        setHistory((h) => [
          ...h,
          {
            role: "assistant",
            content: {
              type: "events",
              count: matches.length,
              items: matches
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 6), // Limit for brevity
            },
            ts: Date.now(),
          },
        ]);
      }
      setLoading(false);
      return;
    }

    // Fallback to OpenAI (if provided)
    if (typeof onSendToOpenAI === "function") {
      try {
        setLoading(true);
        const reply = await onSendToOpenAI(message, history);
        setHistory((h) => [
          ...h,
          { role: "assistant", content: reply ?? "(no reply)", ts: Date.now() },
        ]);
      } catch (e) {
        setHistory((h) => [
          ...h,
          {
            role: "assistant",
            content: "I couldn't connect to the AI service right now. Please try again later.",
            ts: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      // Intelligent responses
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          content: getSmartResponse(message.toLowerCase()),
          ts: Date.now(),
        },
      ]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Rest of the component remains the same...
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Welcome Message */}
      {!open && showWelcome && (
        <div className="relative mb-3 mr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg max-w-[250px] animate-bounce">
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 transition-colors"
          >
            ×
          </button>
          <p className="text-sm text-gray-800 font-medium">Hello! How can I help you?</p>
          <p className="text-xs text-gray-500 mt-1">Demo version - basic features only</p>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="h-14 w-14 rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="mt-3 w-[360px] max-h-[70vh] rounded-2xl border border-white/30 bg-white/70 backdrop-blur-2xl shadow-[0_12px_60px_rgba(0,0,0,0.18)] overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/30 bg-white/40">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-900 text-white grid place-items-center font-bold">A</div>
              <div>
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-[11px] text-gray-600">Event Assistant</div>
              </div>
            </div>
            <button
              className="p-1 rounded-md hover:bg-white/50"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 space-y-3 max-h-[400px] overflow-y-auto">
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-white/80 text-gray-800 border border-white/50"
                  }`}
                >
                  {typeof msg.content === "string" ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div>
                      <div className="font-medium mb-2">Found {msg.content.count} event(s):</div>
                      {msg.content.items.map((event, idx) => (
                        <div key={idx} className="mb-2 p-2 bg-white/50 rounded-lg border border-white/30">
                          <div className="font-medium text-gray-900">{event.title}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.location}
                          </div>
                          <a
                            href={`/events/${event.id}`}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                          >
                            View Details →
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/80 px-3 py-2 rounded-2xl border border-white/50">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-white/30">
              <div className="flex flex-wrap gap-1">
                {suggestions.slice(0, 3).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="text-xs px-2 py-1 bg-white/60 hover:bg-white/80 rounded-full border border-white/40 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about campus events..."
                className="flex-1 px-3 py-2 bg-white/60 border border-white/40 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBotWidget;
