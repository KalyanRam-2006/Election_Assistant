// nlpEngine.js
// A lightweight, purely local intent-matching engine for CivicPulse AI (English/Hindi).

import electionData from './electionData';

// Fuzzy matching using Levenshtein distance
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from(Array(a.length + 1), () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function isFuzzyMatch(queryWord, keyword) {
  if (queryWord === keyword) return true;
  if (keyword.length > 4 && queryWord.length > 3) {
    const dist = levenshteinDistance(queryWord, keyword);
    return dist <= 2; // Allow up to 2 character edits for longer words
  }
  return false;
}

const dictionary = {
  registration: {
    en: ["register", "registration", "voter id", "apply", "enroll", "new voter", "epic", "get voter id", "how to register", "eligible", "eligibility", "form 6"],
    hi: ["pajikaran", "voter card banwana", "apply karna", "regster", "new card"]
  },
  documents: {
    en: ["document", "proof", "aadhaar", "passport", "pan card", "id proof", "address proof", "what to carry", "carry"],
    hi: ["kagaz", "dastavez", "kya chahiye", "documents", "id"]
  },
  voting_process: {
    en: ["vote", "voting", "process", "steps", "how to vote", "procedure", "cast vote", "voting day", "what happens", "can i vote", "do i vote"],
    hi: ["vote kaise", "matdaan", "prakriya", "tarika"]
  },
  evm_info: {
    en: ["evm", "machine", "electronic", "vvpat", "button", "hack", "tamper", "secure", "rigged", "paper trail"],
    hi: ["masin", "machine", "evm", "button"]
  },
  polling_booth: {
    en: ["booth", "polling station", "find", "where to vote", "location", "center", "centre", "place"],
    hi: ["booth", "kahan vote", "jagah", "kendra"]
  },
  results: {
    en: ["result", "count", "winner", "who won", "tally", "counting", "outcome", "when"],
    hi: ["natija", "result", "kaun jita"]
  },
  navigation: {
    en: ["navigate", "help", "website", "features", "use", "how to use", "what is this"],
    hi: ["madad", "help", "kaise use"]
  },
  nri_voting: {
    en: ["nri", "overseas", "abroad", "foreign", "non resident"],
    hi: ["nri", "videsh", "bahar"]
  },
  accessibility: {
    en: ["disability", "blind", "wheelchair", "accessible", "pwd", "senior citizen", "old age"],
    hi: ["viklang", "buzurg", "sahayata"]
  },
  greeting: {
    en: ["hi", "hello", "hey", "greetings", "good morning", "good evening", "namaste"],
    hi: ["namaste", "pranam"]
  },
  general_election: {
    en: ["election", "democracy", "eci", "politics", "minister", "government", "parliament", "lok sabha", "vidhan sabha", "political"],
    hi: ["chunav", "neta", "sarkar"]
  }
};

const responses = {
  registration: {
    text: "📝 **Steps to get your Voter ID:**\n\n1. Visit voters.eci.gov.in\n2. Register an account using your mobile number\n3. Fill Form 6 (For new voters) or Form 8 (For corrections)\n4. Upload age proof & address proof.\n5. Note down the Reference Number.",
    suggestions: ["Documents needed", "Am I eligible?", "Find my booth"]
  },
  documents: {
    text: "📄 **Documents accepted:**\n\n• Aadhaar Card\n• Voter ID (EPIC)\n• Passport\n• Driving License\n• PAN Card\n\nCarry your original Voter ID (EPIC) on polling day!",
    suggestions: ["How to register?", "Voting process", "EVM info"]
  },
  voting_process: {
    text: "🗳️ **Step-by-Step Voting Process:**\n\n1. Find your Polling Booth.\n2. Bring your Voter ID (EPIC).\n3. The Polling Officer will verify your name.\n4. Get your finger inked & sign the register.\n5. Go to the EVM, press the blue button next to your candidate.\n6. Verify your vote via the VVPAT slip window for 7 seconds.",
    suggestions: ["Find my booth", "What is EVM?", "Documents needed"]
  },
  evm_info: {
    text: "🖥️ **Electronic Voting Machine (EVM):**\n\n• Used nationwide for fast, secure counting.\n• VVPAT (paper trail) ensures accuracy.\n• EVMs are standalone machines (NOT connected to the internet).\n• They have multiple security layers making them highly tamper-proof.",
    suggestions: ["Voting process", "Find my booth", "How to register?"]
  },
  polling_booth: {
    text: "📍 **How to find your polling booth:**\n\nYou can tell me your city directly (e.g. 'Where is my booth in Mumbai?'), or use the locator panel on the right. You can also visit voters.eci.gov.in -> Electoral Search.",
    suggestions: ["Voting process", "What to carry?", "EVM info"]
  },
  results: {
    text: "📊 **Election Results:**\n\nResults are declared after the final phase of voting is complete on results.eci.gov.in.",
    suggestions: ["How to use this site?", "EVM info"]
  },
  navigation: {
    text: "🧭 **How to use CivicPulse AI:**\n\n💬 AI Chat: Ask me questions.\n📅 Timeline: View election stage.\n📍 Booth Locator: Find official CEO portals.",
    suggestions: ["How to register?", "Find my booth"]
  },
  nri_voting: {
    text: "✈️ **Overseas (NRI) Voting:**\n\nNRIs holding an Indian Passport can vote! Fill out Form 6A on voters.eci.gov.in to get enrolled. Currently, NRIs must physically visit their designated polling booth in India to cast their vote.",
    suggestions: ["Documents needed", "Find my booth"]
  },
  accessibility: {
    text: "♿ **Voting Accessibility (PwD & Seniors):**\n\n• Senior citizens (85+) and PwD (40%+) can opt for Home Voting (Form 12D).\n• Polling stations provide ramps, wheelchairs, and priority voting.\n• EVMs have Braille signage for visually impaired voters.",
    suggestions: ["How to register?", "Find my booth"]
  },
  greeting: {
    text: "Hello! 👋 I am CivicPulse AI. Ask me about voter registration, EVMs, or finding your booth!",
    suggestions: ["How to register?", "Voting process", "Find my booth"]
  },
  general_election: {
    text: "🇮🇳 **Indian Elections:**\n\nIndia is the world's largest democracy. I can help you with Registration, EVMs, or finding your Polling Booth!",
    suggestions: ["How to register?", "Voting process", "Find my booth"]
  },
  out_of_domain: {
    text: "⚠️ **Unrelated Question Detected**\n\nI am programmed to assist with Indian Elections, Voting, EVMs, and Polling Booths. Please ask an election-related question!",
    suggestions: ["How to register?", "Voting process", "Find my booth"]
  }
};

const extractLocation = (query) => {
  if (!electionData) return null;
  // Look for any city or state name in the query
  const words = query.split(/[\s,]+/);
  for (const stateObj of electionData) {
    if (query.includes(stateObj.state.toLowerCase())) return stateObj.state;
    for (const city of stateObj.cities) {
      if (query.includes(city.toLowerCase())) return city;
    }
  }
  return null;
}

export const processLocalQuery = (input, context = null) => {
  const query = input.toLowerCase();
  
  let bestIntent = null;
  let highestScore = 0;

  // Words in user query
  const queryWords = query.split(/[\s,]+/);

  for (const [intent, languages] of Object.entries(dictionary)) {
    let score = 0;
    
    // Boost score if it matches the current context (for follow up questions)
    if (context === intent) {
       // if they use pronouns like "it", "that", "this"
       if (query.includes("that") || query.includes("it") || query.includes("this")) {
          score += 5; 
       }
    }

    for (const keywords of Object.values(languages)) {
      for (const keyword of keywords) {
        if (query.includes(keyword)) {
          score += keyword.length * 2; // Exact match is heavily weighted
        } else {
           // Try fuzzy matching on individual words
           for (const qWord of queryWords) {
             if (isFuzzyMatch(qWord, keyword)) {
                score += keyword.length; // Fuzzy match gets half weight
             }
           }
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestIntent = intent;
    }
  }

  if (highestScore === 0) {
    return { ...responses.out_of_domain, intent: "out_of_domain" };
  }

  let responseObj = { ...responses[bestIntent], intent: bestIntent };

  // If asking for a booth and mentioned a location, trigger direct search!
  if (bestIntent === "polling_booth") {
    const location = extractLocation(query);
    if (location) {
      responseObj.action = "SEARCH_BOOTH";
      responseObj.location = location;
      responseObj.text = `📍 **I found polling stations for ${location}!**\n\nHere are some sample booths near you:`;
    }
  }

  return responseObj;
};
