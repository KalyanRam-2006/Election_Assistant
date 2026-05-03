import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPartyInfo, getPartyColor } from "./partyData";
import electionData from "./electionData";

const MYNETA_BASE = "https://nish.space/my_neta";
const CLOUD_BACKEND = "https://election-assistant-302225506324.us-central1.run.app";
const SEARCH_HINTS = [
  "Delhi",
  "Mumbai",
  "Kashipur",
  "Varanasi",
  "Bengaluru",
  "Patna",
  "ACHALPUR",
];

const symbolFallback = {
  Lotus: "BJP",
  Hand: "INC",
  Broom: "AAP",
  Bicycle: "SP",
  "Rising Sun": "DMK",
  Arrow: "JD",
  "Ceiling Fan": "YSR",
  Elephant: "BSP",
  Clock: "NCP",
};

function initialsFor(value = "") {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return initials || "MP";
}

function normalizeText(value = "") {
  return value.toString().trim().toLowerCase();
}

function normalizeCandidate(candidate) {
  return {
    type: candidate.type || "MP",
    state_or_ut: candidate.state_or_ut || "",
    name: candidate.name || "Unknown candidate",
    constituency: candidate.constituency || "",
    party: candidate.party || "IND",
    criminal_cases: Number(candidate.criminal_cases || 0),
    education: candidate.education || "N/A",
    assets: candidate.assets ?? null,
    liabilities: candidate.liabilities ?? null,
    photo: candidate.photo || candidate.image || candidate.avatar || "",
    mynetaUrl: candidate.mynetaUrl || "",
    sourceListUrl: candidate.sourceListUrl || "",
    election: candidate.election || "",
  };
}

function MediaFallback({ src, alt, fallback, className, style }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className={`${className || ""} logo-fallback`} style={style} aria-label={alt}>
        {fallback}
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      style={style}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

function PartyLogo({ partyName, size = 34, className = "" }) {
  const party = getPartyInfo(partyName);
  const color = getPartyColor(partyName);
  const fallback = symbolFallback[party?.symbol] || party?.abbr || initialsFor(partyName);

  return (
    <MediaFallback
      src={party?.logo}
      alt={`${party?.fullName || partyName} logo`}
      fallback={fallback}
      className={`party-logo-img ${className}`}
      style={{ width: size, height: size, borderColor: `${color}55` }}
    />
  );
}

function CandidateAvatar({ candidate, size = 44 }) {
  const partyColor = getPartyColor(candidate.party);
  const party = getPartyInfo(candidate.party);
  const fallback = candidate.photo ? initialsFor(candidate.name) : (
    <PartyLogo partyName={candidate.party} size={size - 8} />
  );

  return (
    <div className="relative group">
      <MediaFallback
        src={candidate.photo || party?.logo}
        alt={`${candidate.name} image`}
        fallback={fallback}
        className="rounded-xl object-cover border-2 border-white/10 shadow-lg group-hover:border-indigo-500/50 transition-all duration-300"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${partyColor}44, ${partyColor}11)`,
        }}
      />
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 bg-slate-950 flex items-center justify-center shadow-md">
        <PartyLogo partyName={candidate.party} size={12} />
      </div>
    </div>
  );
}

function PartyPopup({ partyName, onClose }) {
  const party = getPartyInfo(partyName);
  if (!party) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-indigo-500/30"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="h-32 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${party.color}, ${party.color}44)` }}>
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4">
            {Array.from({ length: 20 }).map((_, i) => <span key={i} className="material-symbols-outlined text-4xl">bolt</span>)}
          </div>
          <button className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-8 pb-8 -mt-12 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="p-1 rounded-2xl bg-slate-900 border-4 border-slate-900 shadow-2xl mb-4">
              <PartyLogo partyName={partyName} size={96} className="rounded-xl" />
            </div>
            <h2 className="text-3xl font-bold text-white font-headline">{party.fullName}</h2>
            <p className="text-sm font-bold tracking-[0.2em] font-label-caps mt-1" style={{ color: party.color }}>{party.abbr}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            {[
              { label: "Founded", value: party.founded },
              { label: "President", value: party.president },
              { label: "Alliance", value: party.alliance },
              { label: "Lok Sabha", value: party.lsSeats, highlight: true },
              { label: "Rajya Sabha", value: party.rsSeats, highlight: true },
              { label: "States", value: party.statesGoverned, highlight: true },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-bold text-slate-500 font-label-caps mb-1">{item.label}</p>
                <p className={`text-sm font-bold ${item.highlight ? "text-white text-lg" : "text-slate-300"}`}>{item.value || "N/A"}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-indigo-500/50 pl-4">
              {party.history}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {party.ideology.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CandidateModal({ candidate, onClose, onPartyClick }) {
  if (!candidate) return null;
  const partyInfo = getPartyInfo(candidate.party);
  const partyColor = getPartyColor(candidate.party);
  const myNetaUrl = candidate.mynetaUrl || `https://www.myneta.info/search_myneta.php?q=${encodeURIComponent(candidate.name)}`;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="p-8 border-b border-white/10 flex flex-col sm:flex-row gap-8 items-center bg-white/5">
          <CandidateAvatar candidate={candidate} size={100} />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold font-label-caps bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {candidate.type || "MP"} Candidate
              </span>
              {candidate.election && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold font-label-caps bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {candidate.election}
                </span>
              )}
            </div>
            <h2 className="text-4xl font-bold text-white font-headline leading-tight">{candidate.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400 mt-2">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <p className="text-sm font-medium">{candidate.constituency}, {candidate.state_or_ut}</p>
            </div>
          </div>
          <button className="hidden sm:block p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all self-start" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Info Grid */}
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Party Banner */}
          <button
            type="button"
            className="w-full glass-card rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-500/50 transition-all"
            onClick={() => onPartyClick(candidate.party)}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-xl">
                <PartyLogo partyName={candidate.party} size={40} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-500 font-label-caps">Affiliation</p>
                <p className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {partyInfo?.fullName || candidate.party}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-indigo-500 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Criminal Cases", value: candidate.criminal_cases === 0 ? "Clean Record" : `${candidate.criminal_cases} Cases`, 
                status: candidate.criminal_cases === 0 ? "text-tertiary" : "text-error", icon: "security" },
              { label: "Education", value: candidate.education || "N/A", icon: "school" },
              { label: "Total Assets", value: candidate.assets || "Not declared", icon: "payments" },
              { label: "Total Liabilities", value: candidate.liabilities || "0", icon: "account_balance" },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 font-label-caps">{stat.label}</p>
                  <p className={`text-sm font-bold ${stat.status || "text-slate-200"}`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-950/50 border-t border-white/10 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-4">
            <a 
              href={myNetaUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-indigo-400 font-bold text-xs hover:underline"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              FULL PROFILE (MYNETA)
            </a>
          </div>
          <button 
            className="bg-indigo-600 px-8 py-3 rounded-xl font-bold text-white hover:bg-indigo-500 transition-all shadow-lg"
            onClick={onClose}
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="candidate-card skeleton">
      <div className="skel-avatar"></div>
      <div className="skel-lines">
        <div className="skel-line w70"></div>
        <div className="skel-line w50"></div>
        <div className="skel-line w40"></div>
      </div>
    </div>
  );
}

function CandidateCard({ candidate, onCandidateClick, onPartyClick }) {
  const partyColor = getPartyColor(candidate.party);

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 group cursor-pointer hover:border-indigo-500/50"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onCandidateClick(candidate)}
    >
      <div className="flex items-start justify-between mb-6">
        <CandidateAvatar candidate={candidate} size={56} />
        <button
          type="button"
          className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onPartyClick(candidate.party);
          }}
        >
          <PartyLogo partyName={candidate.party} size={20} />
        </button>
      </div>
      
      <div className="space-y-1 mb-6">
        <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight truncate">{candidate.name}</h4>
        <p className="text-xs font-bold text-slate-500 font-label-caps tracking-widest">{candidate.type} - {candidate.constituency}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-600 font-label-caps">Records</span>
          <span className={`text-[11px] font-bold ${candidate.criminal_cases === 0 ? "text-tertiary" : "text-error"}`}>
            {candidate.criminal_cases === 0 ? "CLEAN" : `${candidate.criminal_cases} CASES`}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-bold text-slate-600 font-label-caps">Education</span>
          <span className="text-[11px] font-bold text-slate-400 truncate max-w-[100px]">
            {candidate.education?.split(/\s+/)[0] || "N/A"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function CandidateExplorer({ areaFilter, externalQuery }) {
  const [candidates, setCandidates] = useState([]);
  const [mlaCandidates, setMlaCandidates] = useState([]);
  const [mlaElection, setMlaElection] = useState("");
  const [loading, setLoading] = useState(false);
  const [mlaLoading, setMlaLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mlaError, setMlaError] = useState(null);
  const [year, setYear] = useState("2024");
  const [dataMode, setDataMode] = useState("both");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [partyPopup, setPartyPopup] = useState(null);
  const [visibleCount, setVisibleCount] = useState(30);
  const [expanded, setExpanded] = useState(false);
  const [dataSource, setDataSource] = useState("");
  const [selectedParty, setSelectedParty] = useState("");

  // Sync external query
  useEffect(() => {
    if (externalQuery) {
      setSearchQuery(externalQuery);
      runSearch(externalQuery);
    }
  }, [externalQuery]);

  const configuredBackend = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
  const activeRecords = useMemo(() => {
    if (dataMode === "mp") return candidates;
    if (dataMode === "mla") return mlaCandidates;
    return [...candidates, ...mlaCandidates];
  }, [candidates, dataMode, mlaCandidates]);

  const candidateUrls = useMemo(() => {
    return [...new Set([
      `${configuredBackend}/api/candidates/${year}`,
      `${CLOUD_BACKEND}/api/candidates/${year}`,
      `${MYNETA_BASE}/mps/${year}`,
    ])];
  }, [configuredBackend, year]);

  const fetchCandidates = useCallback(async () => {
    if (candidates.length) return;
    setLoading(true);
    setError(null);
    setVisibleCount(30);

    const errors = [];

    for (const url of candidateUrls) {
      try {
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        const mps = Array.isArray(data?.mps) ? data.mps.map(normalizeCandidate) : [];
        if (!mps.length) throw new Error("No candidate records returned");
        setCandidates(mps);
        setDataSource(url.includes("nish.space") ? "MyNeta API" : "backend proxy");
        setLoading(false);
        return;
      } catch (err) {
        errors.push(`${url}: ${err.message}`);
      }
    }

    setCandidates([]);
    setError(`Unable to fetch candidate data. Tried ${candidateUrls.length} source${candidateUrls.length > 1 ? "s" : ""}.`);
    console.error(errors.join("\n"));
    setLoading(false);
  }, [candidateUrls, candidates.length]);

  const fetchMlas = useCallback(async (state) => {
    if (!state) {
      setMlaCandidates([]);
      setMlaElection("");
      return;
    }

    setMlaLoading(true);
    setMlaError(null);

    const mlaUrls = [
      `${configuredBackend}/api/mlas/${encodeURIComponent(state)}`,
      `${CLOUD_BACKEND}/api/mlas/${encodeURIComponent(state)}`
    ];

    const errors = [];

    for (const url of mlaUrls) {
      try {
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        const mlas = Array.isArray(data?.mlas) ? data.mlas.map(normalizeCandidate) : [];
        setMlaCandidates(mlas);
        setMlaElection(data.election || "");
        setMlaLoading(false);
        return;
      } catch (err) {
        errors.push(`${url}: ${err.message}`);
      }
    }

    setMlaCandidates([]);
    setMlaElection("");
    setMlaError(`Unable to fetch MLA data for ${state}. Checked ${mlaUrls.length} sources.`);
    console.error(errors.join("\n"));
    setMlaLoading(false);
  }, [configuredBackend]);

  useEffect(() => {
    if (areaFilter?.state) {
      setExpanded(true);
      setSelectedState(areaFilter.state);
      setSearchQuery(areaFilter.matchedLocation || "");
      setSubmittedQuery(areaFilter.matchedLocation || areaFilter.state);
      setHasSearched(true);
      fetchCandidates();
      fetchMlas(areaFilter.state);
    }
  }, [areaFilter, fetchCandidates, fetchMlas]);

  const states = useMemo(() => {
    const fromMps = candidates.map(c => c.state_or_ut).filter(Boolean);
    const fallback = [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
      "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
      "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
      "Uttarakhand", "West Bengal"
    ];
    return [...new Set([...fromMps, ...fallback])].sort();
  }, [candidates]);

  function inferStateFromQuery(query) {
    const q = normalizeText(query);
    return states.find((state) => q.includes(normalizeText(state))) || "";
  }

  const runSearch = async (forcedQuery) => {
    const queryValue = typeof forcedQuery === "string" ? forcedQuery : searchQuery;
    const q = queryValue.trim();
    if (!q && !selectedState) return;

    setExpanded(true);
    setHasSearched(true);
    setSubmittedQuery(q || selectedState);
    setSelectedParty("");
    setVisibleCount(20);

    await fetchCandidates();

    const inferredState = selectedState || inferStateFromQuery(q);
    if (inferredState) {
      setSelectedState(inferredState);
      await fetchMlas(inferredState);
    } else {
      setMlaCandidates([]);
      setMlaElection("");
      setMlaError("Type or select a state to fetch MLA records. MP results can still match by constituency, city, party, or name.");
    }
  };

  const stateScopedRecords = useMemo(() => {
    if (!selectedState) return activeRecords;
    return activeRecords.filter(c => c.state_or_ut === selectedState);
  }, [activeRecords, selectedState]);
  const parties = useMemo(() => [...new Set(stateScopedRecords.map(c => c.party).filter(Boolean))].sort(), [stateScopedRecords]);

  const filtered = useMemo(() => {
    if (!hasSearched) return [];
    const q = normalizeText(submittedQuery);
    const area = normalizeText(areaFilter?.matchedLocation);

    return activeRecords
      .filter((candidate) => {
        if (selectedState && candidate.state_or_ut !== selectedState) return false;
        if (selectedDistrict && !candidate.constituency.includes(selectedDistrict)) return false;
        if (selectedConstituency && candidate.constituency !== selectedConstituency) return false;
        if (selectedParty && candidate.party !== selectedParty) return false;

        const haystack = normalizeText([
          candidate.name,
          candidate.constituency,
          candidate.party,
          candidate.state_or_ut,
        ].join(" "));

        if (q && !haystack.includes(q)) {
          if (!area || !haystack.includes(area)) return false;
        }

        return true;
      })
      .sort((a, b) =>
        a.state_or_ut.localeCompare(b.state_or_ut) ||
        a.constituency.localeCompare(b.constituency) ||
        a.name.localeCompare(b.name)
      );
  }, [activeRecords, areaFilter, hasSearched, selectedParty, selectedDistrict, selectedConstituency, selectedState, submittedQuery]);

  const visible = filtered.slice(0, visibleCount);
  const grouped = useMemo(() => {
    return visible.reduce((acc, candidate) => {
      const section = candidate.state_or_ut || "Other";
      if (!acc[section]) acc[section] = [];
      acc[section].push(candidate);
      return acc;
    }, {});
  }, [visible]);

  const areaLabel = areaFilter?.matchedLocation
    ? `${areaFilter.matchedLocation}, ${areaFilter.state}`
    : "";
  const showRegionStats = hasSearched && Boolean(selectedState || submittedQuery || areaLabel);

  if (!expanded) {
    return (
      <motion.button
        type="button"
        className="glass-card rounded-2xl flex items-center justify-between w-full text-left group"
        id="candidates"
        onClick={() => setExpanded(true)}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-6 p-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">groups</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-indigo-400 font-label-caps tracking-widest">Candidate Explorer</span>
            <h2 className="text-xl font-bold text-white">Search candidates by area</h2>
            <p className="text-sm text-slate-400 mt-1">
              Find MP and MLA records for your region.
            </p>
          </div>
        </div>
        <div className="pr-8">
          <span className="text-indigo-400 material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </div>
      </motion.button>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden border-indigo-500/20" id="candidates">
      <div className="p-8 border-b border-white/10 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white font-headline">Candidate Explorer</h2>
            <p className="text-slate-400 text-sm mt-1">
              Analyze representative data for your constituency
            </p>
            {areaLabel && <p className="text-indigo-400 text-xs font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {areaLabel}
            </p>}
          </div>
          <button className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors" onClick={() => setExpanded(false)}>
            <span className="material-symbols-outlined">expand_less</span>
            Collapse
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="Search by city, constituency, or name..."
            />
          </div>
          <button 
            className="bg-indigo-600 px-8 py-4 rounded-xl font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
            onClick={() => runSearch()}
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {SEARCH_HINTS.map((hint) => (
            <button
              key={hint}
              className="px-4 py-1.5 rounded-full text-[11px] font-bold font-label-caps bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all"
              onClick={() => {
                setSearchQuery(hint);
                runSearch(hint);
              }}
            >
              {hint}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 font-label-caps tracking-widest pl-1">Election Type</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setDataMode("mp")}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                  dataMode === "mp" 
                  ? "bg-indigo-500/10 border-indigo-500 text-indigo-400" 
                  : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                }`}
              >
                Lok Sabha (MP)
              </button>
              <button 
                onClick={() => setDataMode("mla")}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                  dataMode === "mla" 
                  ? "bg-indigo-500/10 border-indigo-500 text-indigo-400" 
                  : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                }`}
              >
                Vidhan Sabha (MLA)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 font-label-caps tracking-widest pl-1">State / UT</label>
            <select 
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={selectedState} 
              onChange={e => { setSelectedState(e.target.value); setSelectedParty(""); }}
            >
              <option value="">All Regions</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 font-label-caps tracking-widest pl-1">Political Party</label>
            <select 
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={selectedParty} 
              onChange={e => setSelectedParty(e.target.value)}
            >
              <option value="">All Parties</option>
              {parties.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="p-8 bg-slate-950/30">
        {hasSearched && (
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm font-medium text-slate-400">
              Found <span className="text-white">{filtered.length}</span> records for your search
            </p>
            {dataMode === "mla" && mlaElection && (
              <span className="text-[10px] font-bold font-label-caps text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Source: {mlaElection}
              </span>
            )}
          </div>
        )}

        <div className="space-y-12">
          {Object.entries(grouped).map(([state, candidates]) => (
            <div key={state} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold font-label-caps text-slate-500 tracking-[0.2em] whitespace-nowrap">{state}</h3>
                <div className="h-[1px] w-full bg-white/5"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map(candidate => (
                  <CandidateCard 
                    key={`${candidate.name}-${candidate.constituency}`} 
                    candidate={candidate} 
                    onCandidateClick={setSelectedCandidate}
                    onPartyClick={setPartyPopup}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length > visibleCount && (
          <div className="mt-12 text-center">
            <button 
              className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
              onClick={() => setVisibleCount(prev => prev + 12)}
            >
              Load More Representatives
            </button>
          </div>
        )}

        {hasSearched && filtered.length === 0 && (
          <div className="py-20 text-center space-y-4 opacity-50">
            <span className="material-symbols-outlined text-6xl">search_off</span>
            <p className="text-slate-400">No candidates found for this selection.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <CandidateModal 
            candidate={selectedCandidate} 
            onClose={() => setSelectedCandidate(null)}
            onPartyClick={(party) => {
              setSelectedCandidate(null);
              setPartyPopup(party);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {partyPopup && (
          <PartyPopup 
            partyName={partyPopup} 
            onClose={() => setPartyPopup(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
