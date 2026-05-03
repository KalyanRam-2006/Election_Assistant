import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import "./index.css";
import { searchElectionInfo } from "./electionData";
import { processLocalQuery } from "./nlpEngine";
import CandidateExplorer from "./CandidateExplorer";
import { VoterJourney } from "./VoterJourney";
import { VotingDemo } from "./VotingDemo";

export default function App() {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm CivicPulse AI 🗳️ Ask me anything about Indian elections — voter registration, documents, polling booths, EVMs, and more!",
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
  const [candidateAreaFilter, setCandidateAreaFilter] = useState(null);
  const [chatContext, setChatContext] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showVoterHelp, setShowVoterHelp] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [headerInput, setHeaderInput] = useState("");
  const chatContainerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg = { text: msg, sender: "user", time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Show typing indicator
    setIsTyping(true);

    // Try local NLP matching first for speed and offline capability
    const localResponse = processLocalQuery(msg, chatContext);

    setTimeout(() => {
      // If local engine found a high-confidence match, use it
      if (localResponse && localResponse.intent !== "out_of_domain") {
        const botMsg = {
          text: localResponse.text,
          sender: "bot",
          time: new Date(),
          suggestions: localResponse.suggestions,
          intent: localResponse.intent
        };

        // Special action for booth searching from chat
        if (localResponse.action === "SEARCH_BOOTH" && localResponse.location) {
          const results = searchElectionInfo(localResponse.location);
          if (results.length > 0) {
            botMsg.boothResults = results[0];
            setCandidateAreaFilter({
              state: results[0].state,
              matchedLocation: results[0].matchedLocation,
            });
          }
        }

        setMessages((prev) => [...prev, botMsg]);
        setChatContext(localResponse.intent);
        setIsTyping(false);
        return;
      }

      // Fallback to Cloud Backend for more complex queries
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://election-assistant-302225506324.us-central1.run.app";
      
      fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: msg })
      })
        .then(res => res.json())
        .then(data => {
          const newBotMsg = {
            text: data.reply,
            sender: "bot",
            time: new Date(),
            suggestions: ["Voting process", "Find my booth", "Registration"]
          };

          setMessages((prev) => [...prev, newBotMsg]);
          setIsTyping(false);
        })
        .catch(err => {
          console.error("Backend error:", err);
          // Final fallback if backend is down
          const fallbackMsg = {
            text: "I'm having trouble connecting to my server, but I can still help with basic info!",
            sender: "bot",
            time: new Date(),
            suggestions: ["Voting process", "Find my booth", "Registration"]
          };
          setMessages((prev) => [...prev, fallbackMsg]);
          setIsTyping(false);
        });

    }, 600 + Math.random() * 400); // Simulated delay
  };



  const handleBoothSearch = () => {
    if (!boothQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(false);
    setSearchResults([]);
    setTimeout(() => {
      const results = searchElectionInfo(boothQuery);
      setSearchResults(results);
      setCandidateAreaFilter(results[0] ? {
        state: results[0].state,
        matchedLocation: results[0].matchedLocation,
      } : null);
      setIsSearching(false);
      setHasSearched(true);
    }, 1000); // Simulated delay for "searching" feel
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleHeaderSearch = (e) => {
    if (e.key === "Enter" && headerInput.trim()) {
      setGlobalSearch(headerInput);
      document.getElementById("candidates")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="aurora-bg min-h-screen text-on-surface antialiased">
      {/* Background Auras */}
      <div className="aurora-glow top-[-10%] left-[-10%]"></div>
      <div className="aurora-glow bottom-[-10%] right-[-10%] scale-150 opacity-50"></div>

      {/* SideNavBar - Desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 bg-slate-950/40 backdrop-blur-2xl w-64 border-r border-white/10 shadow-2xl">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tighter text-white font-display">CivicPulse</h1>
          <p className="text-[10px] text-slate-400 font-label-caps mt-1">Intelligent Election Guide</p>
        </div>
        <nav className="mt-8 flex-1 px-4 space-y-2">
          {[
            { icon: "dashboard", label: "Dashboard", active: true },
            { icon: "smart_toy", label: "AI Assistant", id: "assistant" },
            { icon: "timeline", label: "Timeline", id: "timeline" },
            { icon: "explore", label: "Booth Locator", id: "booth" },
            { icon: "touch_app", label: "Mock EVM", id: "evm" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.id === "assistant") {
                  document.getElementById("assistant")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-300 ease-spring ${
                item.active 
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full border border-indigo-500/30 bg-indigo-500/20 flex items-center justify-center text-white">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">Guest User</p>
              <p className="text-xs text-slate-400 truncate">Verified Citizen</p>
            </div>
          </div>
        </div>
      </aside>


      {/* Main Content */}
      <main className="pt-12 pb-24 px-6 md:ml-64 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Welcome & Stats */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Welcome Hero */}
              <motion.div 
                className="glass-card rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex-1 space-y-6 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white font-headline">Good Morning, Citizen.</h2>
                  <p className="text-slate-400 text-lg">The 2024 Elections are approaching. Stay informed and ready to participate in the democratic process.</p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <button className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 rounded-xl font-semibold text-white shadow-lg hover:scale-105 active:scale-95 transition-transform">
                      Check Registration
                    </button>
                    <button className="bg-white/5 border border-white/10 px-8 py-3 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-48 h-48 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 overflow-hidden relative group">
                  <span className="material-symbols-outlined text-6xl text-indigo-400 group-hover:scale-110 transition-transform duration-500">how_to_vote</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent"></div>
                </div>
              </motion.div>

              {/* Statistics Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                      <span className="material-symbols-outlined">how_to_reg</span>
                    </div>
                    <span className="text-tertiary text-xs font-bold font-label-caps">+12% New Users</span>
                  </div>
                  <p className="text-slate-400 text-xs font-label-caps tracking-widest mb-1">Registered Voters</p>
                  <h3 className="text-3xl font-bold text-white"><CountUp end={96.8} decimals={1} duration={2.5} /> Cr</h3>
                  <div className="mt-4 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-violet-500/20 rounded-xl text-violet-400">
                      <span className="material-symbols-outlined">groups</span>
                    </div>
                    <span className="text-tertiary text-xs font-bold font-label-caps">Trending</span>
                  </div>
                  <p className="text-slate-400 text-xs font-label-caps tracking-widest mb-1">Youth Turnout</p>
                  <h3 className="text-3xl font-bold text-white"><CountUp end={64.8} decimals={1} duration={2.5} />%</h3>
                  <div className="mt-4 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-violet-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                      initial={{ width: 0 }}
                      animate={{ width: "64.8%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Voter ID Help Banner */}
              <div className="glass-card rounded-2xl p-6 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                    <span className="material-symbols-outlined">info</span>
                  </div>
                  <h3 className="font-bold text-white">Don't have a voter ID?</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">You can register online with Form 6 if you are an Indian citizen and at least 18 years old.</p>
                <div className="flex gap-3">
                  <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="text-amber-500 font-semibold text-sm hover:underline">Apply Officially →</a>
                </div>
              </div>

            </div>

            {/* Right Column: Chat Widget */}
            <div className="lg:col-span-5 h-full" id="assistant">
              <div className="glass-card rounded-2xl h-[600px] flex flex-col border-indigo-500/20 shadow-2xl">
                {/* Chat Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                      <span className="material-symbols-outlined">bolt</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">CivicPulse AI Assistant</p>
                      <p className="text-[10px] text-tertiary flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                        Agent Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6" ref={chatContainerRef}>
                  <AnimatePresence>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] p-4 rounded-2xl ${
                            msg.sender === "user" 
                            ? "bg-indigo-600 text-white rounded-tr-none shadow-lg" 
                            : "glass-card border-white/5 rounded-tl-none"
                          }`}>
                            <p className="text-sm leading-relaxed" style={{ whiteSpace: "pre-line" }}>{msg.text}</p>
                            
                            {msg.boothResults && (
                              <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
                                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{msg.boothResults.state} ({msg.boothResults.matchedLocation})</h4>
                                {msg.boothResults.filteredBooths.slice(0, 2).map((booth, k) => (
                                  <a
                                    key={k}
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booth.name + ", " + booth.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                  >
                                    <strong className="block text-sm">{booth.name}</strong>
                                    <span className="text-[11px] text-slate-400">📍 {booth.address}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                            
                            <p className="text-[9px] text-slate-500 mt-2 opacity-60">{formatTime(msg.time)}</p>
                          </div>
                        </div>

                        {/* Suggestions */}
                        {msg.sender === "bot" && msg.suggestions && i === messages.length - 1 && (
                          <div className="flex flex-wrap gap-2 mt-3 ml-2">
                            {msg.suggestions.map((s, j) => (
                              <button 
                                key={j} 
                                onClick={() => handleSend(s)}
                                className="px-4 py-1.5 rounded-full text-[11px] font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-all"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="glass-card rounded-2xl rounded-tl-none p-4">
                        <div className="flex gap-1.5">
                          {[0, 0.2, 0.4].map(delay => (
                            <motion.div 
                              key={delay}
                              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-white/5 border-t border-white/10">
                  <div className="relative">
                    <input 
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-5 pr-12 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" 
                      placeholder="Ask anything about the election..." 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button 
                      onClick={() => handleSend()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all shadow-lg"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto mt-3 no-scrollbar pb-1">
                    {["📝 Register", "🗳️ Voting", "📄 Documents", "🖥️ EVM"].map(label => (
                      <button 
                        key={label}
                        onClick={() => handleSend(label)}
                        className="whitespace-nowrap px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Timeline Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="glass-card rounded-2xl p-8 h-full" id="timeline">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                      <span className="material-symbols-outlined">event_repeat</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white font-headline">Election Timeline</h3>
                      <p className="text-slate-400 text-sm">Track key phases of the electoral process</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold font-label-caps px-4 py-1.5 rounded-full border border-indigo-500/30">Active</span>
                  </div>
                </div>
                
                <div className="relative pt-12 pb-8">
                  <div className="absolute top-16 left-0 w-full h-[2px] bg-white/5"></div>
                  <div className="absolute top-16 left-0 w-[40%] h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-8 relative">
                    {[
                      { label: "Announcement", active: true, date: "MAR 15" },
                      { label: "Registration", active: true, date: "APR 01" },
                      { label: "Nomination", active: false, date: "APR 20" },
                      { label: "Campaigning", active: false, date: "MAY 05" },
                      { label: "Silent Period", active: false, date: "MAY 18" },
                      { label: "Voting Day", active: false, date: "MAY 20" },
                      { label: "Results", active: false, date: "JUN 04" },
                    ].map((item, i) => (
                      <motion.div 
                        key={i} 
                        className={`flex flex-col items-center text-center relative ${!item.active ? "opacity-40" : ""}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className={`absolute -top-11 w-4 h-4 rounded-full border-4 border-surface ${
                          item.active ? "bg-indigo-500 shadow-[0_0_10px_#6366f1]" : "bg-slate-700"
                        }`}></div>
                        <p className={`font-bold text-[10px] font-label-caps mb-1 ${item.active ? "text-indigo-400" : "text-slate-500"}`}>{item.date}</p>
                        <p className="text-white text-xs font-semibold">{item.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4" id="journey">
              <VoterJourney />
            </div>
          </div>

          {/* Voting Simulation Section */}
          <div id="evm">
            <VotingDemo />
          </div>

          {/* Polling Booth Locator Section */}
          <div className="glass-card rounded-2xl p-8" id="booth">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-tertiary/20 rounded-xl text-tertiary">
                  <span className="material-symbols-outlined">explore</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-headline">Find Your Polling Booth</h3>
                  <p className="text-slate-400 text-sm">Enter your location to discover official polling stations</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-tertiary w-full md:w-80" 
                  placeholder="Enter city, state or district..." 
                  value={boothQuery}
                  onChange={(e) => setBoothQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBoothSearch()}
                />
                <button 
                  onClick={handleBoothSearch}
                  className="bg-tertiary px-6 py-3 rounded-xl font-bold text-on-tertiary hover:scale-105 active:scale-95 transition-all shadow-lg shadow-tertiary/20"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {searchResults.map((r, i) => (
                  <motion.div 
                    key={i} 
                    className="glass-card rounded-2xl p-6 border-white/5 hover:border-tertiary/30 transition-colors"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold font-label-caps border border-tertiary/20 mb-2">{r.type}</span>
                        <h4 className="text-xl font-bold text-white">{r.state}</h4>
                        <p className="text-slate-400 text-sm">📍 {r.matchedLocation}</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-xs text-slate-500 font-label-caps">LS</p>
                          <p className="text-lg font-bold text-white">{r.lsSeats}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500 font-label-caps">VS</p>
                          <p className="text-lg font-bold text-white">{r.vsSeats}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <a href={r.ceoWebsite} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
                          <span className="material-symbols-outlined text-tertiary block mb-1">language</span>
                          <span className="text-[10px] text-slate-300 font-medium">CEO Site</span>
                        </a>
                        <a href="tel:1950" className="p-3 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
                          <span className="material-symbols-outlined text-tertiary block mb-1">call</span>
                          <span className="text-[10px] text-slate-300 font-medium">Helpline</span>
                        </a>
                      </div>
                      
                      {r.filteredBooths?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Suggested Booths</p>
                          {r.filteredBooths.slice(0, 2).map((booth, j) => (
                            <a 
                              key={j} 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booth.name + ", " + booth.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 bg-slate-900/50 rounded-xl border border-white/5 hover:border-tertiary/30 transition-all group"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-bold text-white group-hover:text-tertiary transition-colors">{booth.name}</p>
                                  <p className="text-[10px] text-slate-500">📍 {booth.address}</p>
                                </div>
                                <span className="material-symbols-outlined text-xs text-slate-600 group-hover:text-tertiary transition-colors">open_in_new</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {!isSearching && searchResults.length === 0 && !hasSearched && (
                <div className="md:col-span-2 py-20 text-center space-y-4 opacity-50">
                  <span className="material-symbols-outlined text-6xl">location_on</span>
                  <p className="text-slate-400">Search for your location to see polling details</p>
                </div>
              )}

              {isSearching && (
                <div className="md:col-span-2 py-20 text-center animate-pulse">
                  <p className="text-tertiary font-bold tracking-widest font-label-caps">Locating Booths...</p>
                </div>
              )}
            </div>
          </div>

          {/* Candidate Explorer Section */}
          <div id="candidates">
            <CandidateExplorer areaFilter={candidateAreaFilter} externalQuery={globalSearch} />
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-20 py-12 border-t border-white/5 text-center space-y-4">
          <div className="flex justify-center gap-6 mb-8">
            <span className="text-2xl font-black text-white font-display">CivicPulse AI</span>
          </div>
          <p className="text-slate-500 text-xs">
            © 2024 CivicPulse AI · Data powered by Election Commission of India
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-bold font-label-caps text-slate-600">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">ECI Portal</a>
          </div>
        </footer>
      </main>

      {/* BottomNavBar - Mobile */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 px-4 pb-safe md:hidden bg-slate-950/70 backdrop-blur-xl border-t border-white/10 shadow-[0px_-4px_20px_rgba(0,0,0,0.5)]">
        {[
          { icon: "home", label: "Home", active: true },
          { icon: "chat_bubble", label: "Chat", id: "assistant" },
          { icon: "timeline", label: "Timeline", id: "timeline" },
          { icon: "touch_app", label: "EVM", id: "evm" },
        ].map(item => (
          <button 
            key={item.label}
            onClick={() => {
              if (item.id === "assistant") {
                document.getElementById("assistant")?.scrollIntoView({ behavior: "smooth" });
              } else {
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`flex flex-col items-center justify-center transition-all duration-300 ${
              item.active ? "text-indigo-400" : "text-slate-500"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Floating Action Button */}
      <button 
        onClick={() => document.getElementById("assistant")?.scrollIntoView({ behavior: "smooth" })}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-transform group"
      >
        <span className="material-symbols-outlined text-2xl group-hover:animate-pulse">bolt</span>
      </button>
    </div>
  );
}
