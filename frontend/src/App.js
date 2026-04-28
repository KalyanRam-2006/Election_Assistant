import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import "./index.css";
import { searchElectionInfo } from "./electionData";
import { processLocalQuery } from "./nlpEngine";

export default function App() {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your Election Assistant 🗳️ Ask me anything about Indian elections — voter registration, documents, polling booths, EVMs, and more!",
      sender: "bot",
      time: new Date(),
      suggestions: ["How to register?", "Voting process", "Find my booth", "What is EVM?"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [boothQuery, setBoothQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    // Temporarily disabled to test if this is causing the window to jump
    // if (isInitialMount.current) {
    //   isInitialMount.current = false;
    //   return;
    // }
    // if (chatContainerRef.current) {
    //   chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    // }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg = { text: msg, sender: "user", time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Show typing indicator
    setIsTyping(true);

    setTimeout(() => {
      const response = processLocalQuery(msg, chatContext);
      setChatContext(response.intent);
      
      let newBotMsg = {
        text: response.text,
        sender: "bot",
        time: new Date(),
        suggestions: response.suggestions
      };

      if (response.action === "SEARCH_BOOTH" && response.location) {
         const results = searchElectionInfo(response.location);
         if (results && results.length > 0) {
            newBotMsg.boothResults = results[0];
         } else {
            newBotMsg.text = `I couldn't find polling booths specifically for ${response.location}, but you can use the locator panel to search broader regions!`;
         }
      }

      setMessages((prev) => [...prev, newBotMsg]);
      
      setIsTyping(false);
    }, 600 + Math.random() * 600); // Simulated delay
  };



  const handleBoothSearch = () => {
    if (!boothQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(false);
    setSearchResults([]);
    setTimeout(() => {
      const results = searchElectionInfo(boothQuery);
      setSearchResults(results);
      setIsSearching(false);
      setHasSearched(true);
    }, 1000); // Simulated delay for "searching" feel
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="app-container">
      <motion.div 
        className="main-content"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <header className="app-header">
          <h1 className="gradient-text">🗳️ Election Assistant</h1>
          <p>Your guide to Indian elections — powered by AI</p>
        </header>

        {/* Chat */}
        <div className="glass-card chat-container">
          <div className="chat-messages" ref={chatContainerRef}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`message-row ${msg.sender}`}>
                    <div className="message-avatar">
                      {msg.sender === "bot" ? "🤖" : "👤"}
                    </div>
                    <div style={{ maxWidth: '80%' }}>
                      <div className="message-bubble" style={{ whiteSpace: "pre-line" }}>
                        {msg.text}
                        {msg.boothResults && (
                          <div className="chat-booth-results" style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{msg.boothResults.state} ({msg.boothResults.matchedLocation})</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {msg.boothResults.filteredBooths.slice(0, 2).map((booth, k) => (
                                <a 
                                  key={k} 
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booth.name + ", " + booth.address + ", " + msg.boothResults.state + ", India")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', textDecoration: 'none', color: 'inherit', display: 'block' }}
                                >
                                  <strong style={{ display: 'block' }}>{booth.name}</strong>
                                  <span style={{ opacity: 0.8 }}>📍 {booth.address}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="message-time">{formatTime(msg.time)}</div>
                    </div>
                  </div>

                  {/* Suggestion chips after the last bot message */}
                  {msg.sender === "bot" && msg.suggestions && i === messages.length - 1 && (
                    <motion.div 
                      className="suggestion-chips" 
                      style={{ marginLeft: "2.5rem" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {msg.suggestions.map((s, j) => (
                        <button key={j} className="suggestion-chip" onClick={() => handleSend(s)}>
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <div className="message-row bot">
                <div className="message-avatar pulse-avatar">🤖</div>
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about elections..."
            />
            <button onClick={() => handleSend()} className="send-btn">
              Send ↗
            </button>
          </div>

          {/* Quick actions */}
          <div className="quick-actions">
            {["📝 Register", "🗳️ Voting", "📄 Documents", "🖥️ EVM", "📊 Results"].map((label) => (
              <button
                key={label}
                className="quick-btn"
                onClick={() => handleSend(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {/* Timeline */}
          <div className="glass-card timeline-card">
            <h2>📅 Election Timeline</h2>
            <div className="timeline-list">
              {[
                { label: "Election Announcement", active: true },
                { label: "Voter Registration", active: true },
                { label: "Nomination Filing", active: false },
                { label: "Campaign Period", active: false },
                { label: "Silent Period (48 hrs)", active: false },
                { label: "Voting Day", active: false },
                { label: "Counting & Results", active: false },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className={`timeline-item ${item.active ? "active" : ""}`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 + 0.5 }}
                >
                  {item.label}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Polling Booth Locator */}
          <div className="glass-card booth-card">
            <h2>📍 Find Your Polling Booth</h2>
            <p className="booth-description">
              Enter your state, city, or district to get official election info:
            </p>

            <div className="booth-search-bar">
              <input
                className="booth-search-input"
                placeholder="e.g. Delhi, Kashipur, Mumbai..."
                value={boothQuery}
                onChange={(e) => setBoothQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBoothSearch()}
              />
              <button onClick={handleBoothSearch} className="booth-search-btn">
                🔍 Search
              </button>
            </div>

            {/* Loading State */}
            {isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: "center", padding: "1.5rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}
              >
                <div style={{ display: "inline-block", animation: "pulse 1.5s infinite" }}>🔍</div> Locating polling booths near you...
              </motion.div>
            )}

            {/* Search Results */}
            {!isSearching && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((r, i) => (
                  <div key={i} className="result-card">
                    <div className="result-card-header">
                      <span className="result-card-badge">{r.type}</span>
                      <h3>{r.state}</h3>
                      <span className="result-card-match">📍 {r.matchedLocation}</span>
                    </div>

                    <div className="result-card-stats">
                      <div className="result-stat">
                        <span className="result-stat-value">{r.lsSeats}</span>
                        <span className="result-stat-label">Lok Sabha</span>
                      </div>
                      <div className="result-stat">
                        <span className="result-stat-value">{r.vsSeats}</span>
                        <span className="result-stat-label">Vidhan Sabha</span>
                      </div>
                      <div className="result-stat">
                        <span className="result-stat-value">{r.districts.length}</span>
                        <span className="result-stat-label">Districts</span>
                      </div>
                    </div>

                    <div className="result-card-links">
                      <a href={r.ceoWebsite} target="_blank" rel="noopener noreferrer" className="result-link ceo">
                        🏛️ {r.ceo} Website
                      </a>
                      <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="result-link search">
                        🔍 Electoral Search
                      </a>
                      <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="result-link nvsp">
                        📋 NVSP Portal
                      </a>
                      <a href="tel:1950" className="result-link call">
                        📞 Call {r.helpline}
                      </a>
                    </div>

                    {/* Polling Booths */}
                    {r.filteredBooths && r.filteredBooths.length > 0 && (
                      <div className="booth-list-section">
                        <h4 className="booth-list-title">
                          🏫 Polling Stations ({r.filteredBooths.length} shown)
                        </h4>
                        <div className="booth-list">
                          {r.filteredBooths.map((booth, j) => (
                            <a 
                              key={j} 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booth.name + ", " + booth.address + ", " + r.state + ", India")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="booth-item"
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <div className="booth-item-id">{booth.id}</div>
                              <div className="booth-item-info">
                                <strong>{booth.name}</strong>
                                <span className="booth-item-address">📍 {booth.address}</span>
                                <span className="booth-item-constituency">🗳️ Constituency: {booth.constituency}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                        <p className="booth-list-note">
                          * Sample data. For your exact booth, use Electoral Search with your Voter ID (EPIC).
                        </p>
                      </div>
                    )}

                    <div className="booth-tip">
                      <span>💡</span>
                      <span>SMS <strong>EPIC &lt;Your Voter ID&gt;</strong> to <strong>1950</strong> for booth details</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {hasSearched && !isSearching && searchResults.length === 0 && boothQuery.trim().length > 0 && (
              <div className="no-results">
                <p>No results found for "{boothQuery}". Try a state name like "Delhi" or a city like "Mumbai".</p>
              </div>
            )}

            {/* Default links when no search */}
            {!hasSearched && !isSearching && searchResults.length === 0 && (
              <div className="booth-links">
                <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="booth-link">
                  <div className="booth-link-icon nvsp">🔍</div>
                  <div className="booth-link-text">
                    <strong>Electoral Search</strong>
                    <span>Search by name or EPIC number</span>
                  </div>
                  <span className="booth-link-arrow">→</span>
                </a>
                <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="booth-link">
                  <div className="booth-link-icon eci">🏛️</div>
                  <div className="booth-link-text">
                    <strong>NVSP Portal</strong>
                    <span>Register, track & verify voter ID</span>
                  </div>
                  <span className="booth-link-arrow">→</span>
                </a>
                <a href="tel:1950" className="booth-link">
                  <div className="booth-link-icon maps">📞</div>
                  <div className="booth-link-text">
                    <strong>Call 1950 (Toll-Free)</strong>
                    <span>ECI Helpline for booth details</span>
                  </div>
                  <span className="booth-link-arrow">→</span>
                </a>
              </div>
            )}
          </div>
        </div>


        {/* Stats */}
        <div className="stats-bar">
          <div className="glass-card stat-card">
            <div className="stat-icon">🇮🇳</div>
            <div className="stat-value"><CountUp end={96.8} decimals={1} duration={2.5} /> Cr</div>
            <div className="stat-label">Registered Voters</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon">🏛️</div>
            <div className="stat-value"><CountUp end={10.5} decimals={1} duration={2.5} /> L+</div>
            <div className="stat-label">Polling Stations</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon">🗳️</div>
            <div className="stat-value"><CountUp end={543} duration={2.5} /></div>
            <div className="stat-label">Lok Sabha Seats</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <p>
            Built for India 🇮🇳 · Data from{" "}
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer">
              Election Commission of India
            </a>
          </p>
          <p style={{ marginTop: "0.25rem", opacity: 0.5 }}>
            Helpline: 1950 (Toll-free)
          </p>
        </footer>
      </motion.div>
    </div>
  );
}