import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * ChatBotWidget.jsx
 * Floating chatbot for bottom-right corner. Supports:
 *  - Event lookup from your data (mocked here but can be passed via props)
 *  - Natural-ish date parsing: "today", "tomorrow", "this week", "next week", or "on 2025-09-30"
 *  - Filters: "in <location>", "tag:<tag>"
 *  - Optional handoff to OpenAI via onSendToOpenAI(message, history)
 *  - Keyboard a11y, localStorage persistence, and quick suggestions
 *
 * USAGE (basic):
 *  <ChatBotWidget />
 *
 * USAGE (with your data & OpenAI):
 *  <ChatBotWidget
 *    events={myEvents}
 *    onSendToOpenAI={async (message, history) => {
 *      // Call your backend that wraps OpenAI API here
 *      const res = await fetch("/api/chat", {
 *        method: "POST",
 *        headers: { "Content-Type": "application/json" },
 *        body: JSON.stringify({ message, history }),
 *      });
 *      const data = await res.json();
 *      return data.reply || "(No reply)";
 *    }}
 *  />
 */

// ----------- Mock data (replace with your real events) -----------
const MOCK_EVENTS = [
  {
    id: "evt-001",
    title: "Product Launch Webinar",
    date: "2025-09-18T14:00:00+07:00",
    location: "Ho Chi Minh City",
    tags: ["webinar", "product"],
    url: "https://example.com/events/launch",
    summary: "Deep dive into our new features with live Q&A.",
  },
  {
    id: "evt-002",
    title: "Community Meetup #5",
    date: "2025-09-12T18:30:00+07:00",
    location: "Hanoi",
    tags: ["meetup"],
    url: "https://example.com/events/meetup-5",
    summary: "Casual networking and lightning talks.",
  },
  {
    id: "evt-003",
    title: "Workshop: UX Writing 101",
    date: "2025-09-25T09:00:00+07:00",
    location: "Da Nang",
    tags: ["workshop", "ux"],
    url: "https://example.com/events/ux-writing",
    summary: "Hands-on session on clear, helpful microcopy.",
  },
  {
    id: "evt-004",
    title: "Hackathon Weekend",
    date: "2025-10-04T08:00:00+07:00",
    location: "Ho Chi Minh City",
    tags: ["hackathon"],
    url: "https://example.com/events/hackathon",
    summary: "Build, ship, and demo in 36 hours.",
  },
];

// ----------- Utilities -----------
const STORAGE_KEY = "chatbot:history:v1";

/** Format a date string nicely in the user's locale */
function formatDateHuman(iso) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

/** Get date range for tokens like today/tomorrow/this week/next week */
function resolveDateRange(token) {
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

  const startOfWeek = (d) => {
    const day = d.getDay(); // 0 Sun ... 6 Sat
    const diff = (day + 6) % 7; // make Monday start
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

/** Try to parse explicit date like YYYY-MM-DD */
function parseExplicitDate(str) {
  const m = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`);
  if (isNaN(d.getTime())) return null;
  return { from: d, to: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59) };
}

/**
 * Very small NL parser for queries like:
 *  - events today
 *  - show events tomorrow in Hanoi
 *  - events this week tag:webinar
 *  - what happens on 2025-09-18 in HCMC
 */
function interpretQuery(query) {
  const q = query.trim();
  const lower = q.toLowerCase();

  // date keywords
  const dateTokens = ["today", "tomorrow", "this week", "next week"];
  for (const token of dateTokens) {
    if (lower.includes(token)) {
      return { type: "events", range: resolveDateRange(token), location: extractLocation(lower), tag: extractTag(lower) };
    }
  }

  // explicit date
  const explicit = parseExplicitDate(lower);
  if (explicit) {
    return { type: "events", range: explicit, location: extractLocation(lower), tag: extractTag(lower) };
  }

  // Enhanced event search keywords - English and Vietnamese
  const eventKeywords = [
    // English
    'event', 'events', 'meetup', 'workshop', 'webinar', 'hackathon', 'conference', 'seminar', 'training',
    'show', 'find', 'search', 'list', 'upcoming', 'ongoing', 'past', 'technical', 'cultural', 'sport',
    'technology', 'programming', 'coding', 'career', 'graduation', 'innovation', 'fair', 'ceremony',
    // Vietnamese
    'sự kiện', 'hội thảo', 'đào tạo', 'tìm kiếm', 'danh sách', 'sắp tới', 'đang diễn ra', 'đã qua'
  ];

  const hasEventKeyword = eventKeywords.some(keyword => lower.includes(keyword));

  if (hasEventKeyword || lower.startsWith("events") || lower.includes("what") || lower.includes("when")) {
    return { type: "events", range: null, location: extractLocation(lower), tag: extractTag(lower), category: extractCategory(lower), status: extractStatus(lower) };
  }

  // fallback: small talk or route to OpenAI if available
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

// ----------- UI bits -----------
function BotBubble({ children }) {
  return (
    <div className="max-w-[85%] rounded-2xl bg-white/60 backdrop-blur-xl border border-white/30 shadow-sm px-4 py-2 text-sm text-gray-900">
      {children}
    </div>
  );
}

function UserBubble({ children }) {
  return (
    <div className="max-w-[85%] rounded-2xl bg-gray-900 text-white shadow px-4 py-2 text-sm">
      {children}
    </div>
  );
}

function EventCard({ evt }) {
  return (
    <a
      href={evt.url || "#"}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-white/30 bg-white/50 backdrop-blur-xl p-3 hover:shadow-lg transition"
    >
      <div className="text-sm font-semibold">{evt.title}</div>
      <div className="text-xs text-gray-700 mt-1">{formatDateHuman(evt.date)}</div>
      <div className="text-xs text-gray-700">{evt.location}</div>
      {evt.summary && <div className="text-xs text-gray-600 mt-1 line-clamp-2">{evt.summary}</div>}
      {evt.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {evt.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-900 text-white/90">
              #{t}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}

// ----------- Main Component -----------
export default function ChatBotWidget({
  events: eventsProp,
  title = "Assistant",
  greeting = "Chào bạn! Mình có thể giúp tra cứu sự kiện. Hãy thử: ‘events today’, ‘events this week in HCMC’, hoặc ‘events on 2025-09-18 tag:webinar’.",
  suggestions = [
    "events today",
    "events this week",
    "events tomorrow in Hanoi",
    "events on 2025-09-18 tag:webinar",
  ],
  onSendToOpenAI,
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  const events = useMemo(() => eventsProp || MOCK_EVENTS, [eventsProp]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, open]);

  useEffect(() => {
    // seed greeting on first load
    if (history.length === 0) {
      setHistory((h) => [
        ...h,
        { role: "assistant", content: greeting, ts: Date.now() },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSend(text) {
    const message = text ?? input;
    if (!message.trim()) return;

    setHistory((h) => [...h, { role: "user", content: message, ts: Date.now() }]);
    setInput("");

    const intent = interpretQuery(message);

    if (intent.type === "events") {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 350)); // small UX delay
      const matches = filterEvents(events, intent);

      if (matches.length === 0) {
        setHistory((h) => [
          ...h,
          {
            role: "assistant",
            content:
              "Mình không tìm thấy sự kiện phù hợp. Thử thay đổi ngày, địa điểm (in <city>) hoặc thêm tag:<từ_khóa>.",
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
                .slice(0, 6), // limit for brevity
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
            content:
              "Mình không kết nối được tới dịch vụ AI lúc này. Vui lòng thử lại sau hoặc kiểm tra /api/chat.",
            ts: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      // local small-talk echo
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          content:
            "Mình có thể tra cứu sự kiện với câu như: ‘events today’, ‘events this week in HCMC’, ‘events on 2025-09-18 tag:webinar’. Bạn cũng có thể cấu hình kết nối OpenAI bằng prop onSendToOpenAI.",
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

  return (
    <div className="fixed z-[1000] bottom-5 right-5">
      {/* Toggle Button */}
      <button
        aria-label={open ? "Close assistant" : "Open assistant"}
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gray-900 text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
      >
        {/* Chat icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M7.5 8.25h9m-9 3h6.75M21 12a9 9 0 11-4.219-7.594L21 3v9z" />
        </svg>
        {!open && history.filter((m) => m.role === "assistant").length === 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 text-[10px] flex items-center justify-center bg-red-600 text-white rounded-full">1</span>
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="px-3 py-3 space-y-3 overflow-y-auto" style={{ maxHeight: "50vh" }}>
            {history.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                {m.role === "assistant" ? (
                  typeof m.content === "string" ? (
                    <BotBubble>{m.content}</BotBubble>
                  ) : m.content?.type === "events" ? (
                    <div className="w-full">
                      <BotBubble>
                        <div className="text-sm font-semibold mb-2">Tìm thấy {m.content.count} sự kiện:</div>
                        <div className="grid grid-cols-1 gap-2">
                          {m.content.items.map((evt) => (
                            <EventCard key={evt.id} evt={evt} />
                          ))}
                        </div>
                      </BotBubble>
                    </div>
                  ) : (
                    <BotBubble>{JSON.stringify(m.content)}</BotBubble>
                  )
                ) : (
                  <UserBubble>{m.content}</UserBubble>
                )}
              </div>
            ))}

            {history.length <= 2 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-xs px-3 py-1 rounded-full border border-white/40 bg-white/60 hover:bg-white/80"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-block h-2 w-2 rounded-full bg-gray-900 animate-pulse" />
                Assistant is typing…
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-white/30 bg-white/50 p-2">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Nhập câu hỏi… (Enter để gửi, Shift+Enter xuống dòng)"
                className="flex-1 resize-none rounded-xl border border-white/30 bg-white/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <button
                onClick={() => handleSend()}
                className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
                disabled={loading || !input.trim()}
              >
                Gửi
              </button>
            </div>
            <div className="mt-1 text-[10px] text-gray-600">Gợi ý: "events today", "events this week in HCMC", "events on 2025-09-18 tag:webinar"</div>
          </div>
        </div>
      )}
    </div>
  );
}
