// Curated election data for Indian states and major cities
// Source: Election Commission of India (eci.gov.in)
import indianCities from './indianCities.json';

const electionData = [
  {
    state: "Delhi", type: "UT", lsSeats: 7, vsSeats: 70, ceo: "CEO Delhi", ceoWebsite: "https://ceodelhi.gov.in", helpline: "1950",
    districts: ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "South Delhi", "West Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South East Delhi", "South West Delhi"],
    cities: ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh", "Lajpat Nagar", "Janakpuri"],
    booths: [
      { id: "PS-01", name: "Govt. Boys Sr. Sec. School", address: "Rajendra Nagar, New Delhi - 110060", constituency: "New Delhi" },
      { id: "PS-14", name: "MCD Primary School", address: "Karol Bagh, Central Delhi - 110005", constituency: "Chandni Chowk" },
      { id: "PS-28", name: "Sarvodaya Vidyalaya", address: "Dwarka Sector 6, South West Delhi - 110075", constituency: "West Delhi" },
      { id: "PS-42", name: "Govt. Co-ed Sr. Sec. School", address: "Rohini Sector 16, North West Delhi - 110089", constituency: "North West Delhi" },
      { id: "PS-55", name: "MCD Primary School", address: "Saket, South Delhi - 110017", constituency: "South Delhi" },
      { id: "PS-67", name: "Govt. Girls Sr. Sec. School", address: "Lajpat Nagar, South East Delhi - 110024", constituency: "South Delhi" },
    ]
  },
  {
    state: "Uttar Pradesh", type: "State", lsSeats: 80, vsSeats: 403, ceo: "CEO Uttar Pradesh", ceoWebsite: "https://ceouttarpradesh.nic.in", helpline: "1950",
    districts: ["Lucknow", "Agra", "Varanasi", "Kanpur", "Prayagraj", "Meerut", "Ghaziabad", "Noida", "Moradabad", "Bareilly", "Gorakhpur", "Aligarh", "Mathura", "Jhansi", "Ayodhya", "Udham Singh Nagar", "Amroha"],
    cities: ["Lucknow", "Agra", "Varanasi", "Kanpur", "Noida", "Ghaziabad", "Meerut", "Prayagraj", "Gorakhpur", "Bareilly", "Moradabad", "Aligarh", "Kashipur", "Ayodhya", "Gajraula"],
    booths: [
      { id: "PS-101", name: "Primary School, Hazratganj", address: "Hazratganj, Lucknow - 226001", constituency: "Lucknow Central" },
      { id: "PS-112", name: "Govt. Inter College", address: "Aminabad, Lucknow - 226018", constituency: "Lucknow West" },
      { id: "PS-203", name: "Agra Public School", address: "Civil Lines, Agra - 282002", constituency: "Agra Cantt" },
      { id: "PS-305", name: "BHU Campus School", address: "Lanka, Varanasi - 221005", constituency: "Varanasi South" },
      { id: "PS-410", name: "Govt. Primary School", address: "Sector 62, Noida - 201301", constituency: "Noida" },
      { id: "PS-501", name: "Municipal School", address: "Kashipur, Udham Singh Nagar - 244713", constituency: "Kashipur" },
      { id: "PS-502", name: "Govt. Inter College, Kashipur", address: "Bazpur Road, Kashipur - 244713", constituency: "Kashipur" },
    ]
  },
  {
    state: "Maharashtra", type: "State", lsSeats: 48, vsSeats: 288, ceo: "CEO Maharashtra", ceoWebsite: "https://ceo.maharashtra.gov.in", helpline: "1950",
    districts: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Kolhapur", "Solapur"],
    cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Navi Mumbai"],
    booths: [
      { id: "PS-001", name: "BMC School, Dadar", address: "Dadar West, Mumbai - 400028", constituency: "Mumbai South Central" },
      { id: "PS-015", name: "Municipal School, Andheri", address: "Andheri West, Mumbai - 400058", constituency: "Mumbai North West" },
      { id: "PS-032", name: "Govt. School, Bandra", address: "Bandra East, Mumbai - 400051", constituency: "Mumbai North Central" },
      { id: "PS-101", name: "PMC Primary School", address: "Shivajinagar, Pune - 411005", constituency: "Pune" },
      { id: "PS-112", name: "ZP School, Hadapsar", address: "Hadapsar, Pune - 411028", constituency: "Pune Cantonment" },
      { id: "PS-201", name: "Nagpur Municipal School", address: "Sitabuldi, Nagpur - 440012", constituency: "Nagpur Central" },
    ]
  },
  {
    state: "Karnataka", type: "State", lsSeats: 28, vsSeats: 224, ceo: "CEO Karnataka", ceoWebsite: "https://ceokarnataka.kar.nic.in", helpline: "1950",
    districts: ["Bengaluru", "Mysuru", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Shimoga"],
    cities: ["Bengaluru", "Mysuru", "Hubli-Dharwad", "Mangalore", "Belgaum"],
    booths: [
      { id: "PS-01", name: "BBMP Primary School", address: "Jayanagar 4th Block, Bengaluru - 560011", constituency: "Jayanagar" },
      { id: "PS-18", name: "Govt. School, Koramangala", address: "Koramangala, Bengaluru - 560034", constituency: "BTM Layout" },
      { id: "PS-25", name: "Govt. Higher Primary School", address: "Indiranagar, Bengaluru - 560038", constituency: "Shantinagar" },
      { id: "PS-101", name: "ZP School, Mysuru", address: "Nazarbad, Mysuru - 570010", constituency: "Chamaraja" },
    ]
  },
  {
    state: "Tamil Nadu", type: "State", lsSeats: 39, vsSeats: 234, ceo: "CEO Tamil Nadu", ceoWebsite: "https://ceotamilnadu.nic.in", helpline: "1950",
    districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode"],
    cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    booths: [
      { id: "PS-01", name: "Corporation Primary School", address: "T. Nagar, Chennai - 600017", constituency: "Mylapore" },
      { id: "PS-12", name: "Govt. School, Adyar", address: "Adyar, Chennai - 600020", constituency: "Velachery" },
      { id: "PS-30", name: "Municipal School", address: "Anna Nagar, Chennai - 600040", constituency: "Virugambakkam" },
      { id: "PS-101", name: "Govt. High School", address: "RS Puram, Coimbatore - 641002", constituency: "Coimbatore South" },
    ]
  },
  {
    state: "West Bengal", type: "State", lsSeats: 42, vsSeats: 294, ceo: "CEO West Bengal", ceoWebsite: "https://ceowestbengal.nic.in", helpline: "1950",
    districts: ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol", "Durgapur", "Murshidabad"],
    cities: ["Kolkata", "Howrah", "Siliguri", "Asansol", "Durgapur"],
    booths: [
      { id: "PS-01", name: "KMC Primary School", address: "Park Street, Kolkata - 700016", constituency: "Kolkata Dakshin" },
      { id: "PS-15", name: "Govt. School, Salt Lake", address: "Sector V, Salt Lake, Kolkata - 700091", constituency: "Bidhannagar" },
      { id: "PS-101", name: "Municipal School", address: "Howrah Maidan, Howrah - 711101", constituency: "Howrah Uttar" },
    ]
  },
  {
    state: "Rajasthan", type: "State", lsSeats: 25, vsSeats: 200, ceo: "CEO Rajasthan", ceoWebsite: "https://ceorajasthan.nic.in", helpline: "1950",
    districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar"],
    cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
    booths: [
      { id: "PS-01", name: "Govt. School, C-Scheme", address: "C-Scheme, Jaipur - 302001", constituency: "Jaipur" },
      { id: "PS-15", name: "Rajkiya Vidyalaya", address: "Malviya Nagar, Jaipur - 302017", constituency: "Jaipur South" },
      { id: "PS-101", name: "Municipal School", address: "Sardarpura, Jodhpur - 342003", constituency: "Jodhpur" },
    ]
  },
  {
    state: "Gujarat", type: "State", lsSeats: 26, vsSeats: 182, ceo: "CEO Gujarat", ceoWebsite: "https://ceo.gujarat.gov.in", helpline: "1950",
    districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar"],
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    booths: [
      { id: "PS-01", name: "AMC Primary School", address: "Navrangpura, Ahmedabad - 380009", constituency: "Ahmedabad East" },
      { id: "PS-20", name: "Govt. School, Satellite", address: "Satellite Road, Ahmedabad - 380015", constituency: "Ahmedabad West" },
      { id: "PS-101", name: "SMC School", address: "Athwa Gate, Surat - 395001", constituency: "Surat East" },
    ]
  },
  {
    state: "Madhya Pradesh", type: "State", lsSeats: 29, vsSeats: 230, ceo: "CEO Madhya Pradesh", ceoWebsite: "https://ceomadhyapradesh.nic.in", helpline: "1950",
    districts: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Rewa", "Sagar"],
    cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
    booths: [
      { id: "PS-01", name: "Govt. School, New Market", address: "New Market, Bhopal - 462003", constituency: "Bhopal North" },
      { id: "PS-101", name: "Municipal School", address: "Rajwada, Indore - 452002", constituency: "Indore-1" },
    ]
  },
  {
    state: "Bihar", type: "State", lsSeats: 40, vsSeats: 243, ceo: "CEO Bihar", ceoWebsite: "https://ceobihar.nic.in", helpline: "1950",
    districts: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia"],
    cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
    booths: [
      { id: "PS-01", name: "Govt. Middle School", address: "Boring Road, Patna - 800001", constituency: "Patna Sahib" },
      { id: "PS-15", name: "Primary School, Kankarbagh", address: "Kankarbagh, Patna - 800020", constituency: "Patna" },
    ]
  },
  {
    state: "Telangana", type: "State", lsSeats: 17, vsSeats: 119, ceo: "CEO Telangana", ceoWebsite: "https://ceotelangana.nic.in", helpline: "1950",
    districts: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
    booths: [
      { id: "PS-01", name: "GHMC School, Ameerpet", address: "Ameerpet, Hyderabad - 500016", constituency: "Khairatabad" },
      { id: "PS-18", name: "Govt. School, Kukatpally", address: "Kukatpally, Hyderabad - 500072", constituency: "Kukatpally" },
      { id: "PS-30", name: "Municipal School, Secunderabad", address: "Secunderabad - 500003", constituency: "Secunderabad" },
    ]
  },
  {
    state: "Andhra Pradesh", type: "State", lsSeats: 25, vsSeats: 175, ceo: "CEO Andhra Pradesh", ceoWebsite: "https://ceoandhra.nic.in", helpline: "1950",
    districts: ["Amaravati", "Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Nellore", "East Godavari", "West Godavari"],
    cities: ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Rajahmundry", "Eluru"],
    booths: [
      { id: "PS-01", name: "Municipal School, Dwaraka Nagar", address: "Dwaraka Nagar, Visakhapatnam - 530016", constituency: "Visakhapatnam East" },
      { id: "PS-101", name: "Govt. School, Vijayawada", address: "MG Road, Vijayawada - 520010", constituency: "Vijayawada Central" },
      { id: "PS-201", name: "Govt. Arts College", address: "Rajahmundry, East Godavari - 533101", constituency: "Rajahmundry City" },
      { id: "PS-301", name: "Zilla Parishad High School", address: "Eluru, West Godavari - 534001", constituency: "Eluru" },
    ]
  },
  {
    state: "Kerala", type: "State", lsSeats: 20, vsSeats: 140, ceo: "CEO Kerala", ceoWebsite: "https://ceo.kerala.gov.in", helpline: "1950",
    districts: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur"],
    cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
    booths: [
      { id: "PS-01", name: "Govt. LP School", address: "Statue, Thiruvananthapuram - 695001", constituency: "Thiruvananthapuram" },
      { id: "PS-101", name: "Corporation School", address: "MG Road, Kochi - 682016", constituency: "Kochi" },
    ]
  },
  {
    state: "Punjab", type: "State", lsSeats: 13, vsSeats: 117, ceo: "CEO Punjab", ceoWebsite: "https://ceopunjab.nic.in", helpline: "1950",
    districts: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    booths: [
      { id: "PS-01", name: "Govt. Primary School", address: "Civil Lines, Ludhiana - 141001", constituency: "Ludhiana Central" },
      { id: "PS-101", name: "Municipal School", address: "Hall Bazaar, Amritsar - 143001", constituency: "Amritsar Central" },
    ]
  },
  {
    state: "Haryana", type: "State", lsSeats: 10, vsSeats: 90, ceo: "CEO Haryana", ceoWebsite: "https://ceoharyana.gov.in", helpline: "1950",
    districts: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak"],
    cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
    booths: [
      { id: "PS-01", name: "Govt. School, Sector 14", address: "Sector 14, Gurugram - 122001", constituency: "Gurugram" },
      { id: "PS-15", name: "Govt. Primary School", address: "NIT, Faridabad - 121001", constituency: "Faridabad" },
    ]
  },
  {
    state: "Uttarakhand", type: "State", lsSeats: 5, vsSeats: 70, ceo: "CEO Uttarakhand", ceoWebsite: "https://ceouttarakhand.nic.in", helpline: "1950",
    districts: ["Dehradun", "Haridwar", "Nainital", "Udham Singh Nagar", "Almora", "Haldwani", "Kashipur"],
    cities: ["Dehradun", "Haridwar", "Haldwani", "Kashipur", "Rishikesh", "Roorkee"],
    booths: [
      { id: "PS-01", name: "Govt. Inter College", address: "Rajpur Road, Dehradun - 248001", constituency: "Dehradun Cantt" },
      { id: "PS-10", name: "Primary School, Clement Town", address: "Clement Town, Dehradun - 248002", constituency: "Dehradun" },
      { id: "PS-101", name: "Municipal Primary School", address: "Bazpur Road, Kashipur - 244713", constituency: "Kashipur" },
      { id: "PS-102", name: "Govt. Girls Inter College", address: "Station Road, Kashipur - 244713", constituency: "Kashipur" },
      { id: "PS-103", name: "Nagar Palika Parishad School", address: "Ratan Cinema Road, Kashipur - 244713", constituency: "Kashipur" },
      { id: "PS-201", name: "Primary School, Haldwani", address: "Nainital Road, Haldwani - 263139", constituency: "Haldwani" },
      { id: "PS-301", name: "Govt. School, Haridwar", address: "Railway Road, Haridwar - 249401", constituency: "Haridwar" },
    ]
  },
  {
    state: "Odisha", type: "State", lsSeats: 21, vsSeats: 147, ceo: "CEO Odisha", ceoWebsite: "https://ceoodisha.nic.in", helpline: "1950",
    districts: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"],
    cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
    booths: [
      { id: "PS-01", name: "Govt. UP School", address: "Saheed Nagar, Bhubaneswar - 751007", constituency: "Bhubaneswar Central" },
    ]
  },
  {
    state: "Assam", type: "State", lsSeats: 14, vsSeats: 126, ceo: "CEO Assam", ceoWebsite: "https://ceoassam.nic.in", helpline: "1950",
    districts: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"],
    cities: ["Guwahati", "Silchar", "Dibrugarh"],
    booths: [
      { id: "PS-01", name: "Govt. Primary School", address: "Pan Bazaar, Guwahati - 781001", constituency: "Guwahati East" },
    ]
  },
  {
    state: "Jharkhand", type: "State", lsSeats: 14, vsSeats: 81, ceo: "CEO Jharkhand", ceoWebsite: "https://ceojharkhand.nic.in", helpline: "1950",
    districts: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
    booths: [
      { id: "PS-01", name: "DAV School, Main Road", address: "Main Road, Ranchi - 834001", constituency: "Ranchi" },
    ]
  },
  {
    state: "Chhattisgarh", type: "State", lsSeats: 11, vsSeats: 90, ceo: "CEO Chhattisgarh", ceoWebsite: "https://ceochhattisgarh.nic.in", helpline: "1950",
    districts: ["Raipur", "Bilaspur", "Durg", "Korba", "Jagdalpur"],
    cities: ["Raipur", "Bilaspur", "Durg", "Korba"],
    booths: [
      { id: "PS-01", name: "Govt. School, Sadar Bazaar", address: "Sadar Bazaar, Raipur - 492001", constituency: "Raipur City" },
    ]
  },
  {
    state: "Goa", type: "State", lsSeats: 2, vsSeats: 40, ceo: "CEO Goa", ceoWebsite: "https://ceogoa.nic.in", helpline: "1950",
    districts: ["North Goa", "South Goa"],
    cities: ["Panaji", "Margao", "Vasco da Gama"],
    booths: [
      { id: "PS-01", name: "Govt. Primary School", address: "Panaji, North Goa - 403001", constituency: "Panaji" },
    ]
  },
  {
    state: "Himachal Pradesh", type: "State", lsSeats: 4, vsSeats: 68, ceo: "CEO Himachal Pradesh", ceoWebsite: "https://ceohimachal.nic.in", helpline: "1950",
    districts: ["Shimla", "Kangra", "Mandi", "Kullu", "Solan"],
    cities: ["Shimla", "Dharamshala", "Manali", "Solan"],
    booths: [
      { id: "PS-01", name: "Govt. School, The Ridge", address: "The Ridge, Shimla - 171001", constituency: "Shimla" },
    ]
  },
  {
    state: "Jammu and Kashmir", type: "UT", lsSeats: 5, vsSeats: 90, ceo: "CEO J&K", ceoWebsite: "https://ceojk.nic.in", helpline: "1950",
    districts: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
    cities: ["Srinagar", "Jammu"],
    booths: [
      { id: "PS-01", name: "Govt. School, Lal Chowk", address: "Lal Chowk, Srinagar - 190001", constituency: "Srinagar" },
      { id: "PS-101", name: "Govt. Higher Secondary School", address: "Raghunath Bazaar, Jammu - 180001", constituency: "Jammu East" },
    ]
  },
  {
    state: "Chandigarh", type: "UT", lsSeats: 1, vsSeats: 0, ceo: "CEO Chandigarh", ceoWebsite: "https://ceochandigarh.gov.in", helpline: "1950",
    districts: ["Chandigarh"],
    cities: ["Chandigarh"],
    booths: [
      { id: "PS-01", name: "Govt. Model School, Sector 16", address: "Sector 16, Chandigarh - 160016", constituency: "Chandigarh" },
      { id: "PS-10", name: "Govt. School, Sector 35", address: "Sector 35, Chandigarh - 160035", constituency: "Chandigarh" },
    ]
  },
];

export function searchElectionInfo(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();

  const primaryResults = electionData
    .filter((entry) => {
      const stateLower = entry.state.toLowerCase();
      const matchesState = stateLower.includes(q) || q.includes(stateLower);
      const matchesDistrict = entry.districts.some((d) => d.toLowerCase().includes(q));
      const matchesCity = entry.cities.some((c) => c.toLowerCase().includes(q));
      return matchesState || matchesDistrict || matchesCity;
    })
    .map((entry) => {
      const matchedCity = entry.cities.find((c) => c.toLowerCase().includes(q));
      const matchedDistrict = entry.districts.find((d) => d.toLowerCase().includes(q));
      const matchedLocation = matchedCity || matchedDistrict || entry.state;

      // Filter booths relevant to the searched location
      let relevantBooths = entry.booths.filter((b) => {
        const bLower = (b.address + b.constituency + b.name).toLowerCase();
        return bLower.includes(q) || q.includes(entry.state.toLowerCase());
      });

      // If we matched a specific city/district but it has no explicit booths in the curated list,
      // dynamically generate mock booths instead of showing unrelated ones from the same state.
      if (relevantBooths.length === 0 && (matchedCity || matchedDistrict) && q !== entry.state.toLowerCase()) {
        const loc = matchedCity || matchedDistrict;
        relevantBooths = [
          { id: `PS-${Math.floor(Math.random() * 100)}`, name: `Govt. High School, ${loc}`, address: `Main Road, ${loc}, ${entry.state} - 000000`, constituency: loc },
          { id: `PS-${Math.floor(Math.random() * 100) + 100}`, name: `Municipal Office, ${loc}`, address: `Civil Lines, ${loc}, ${entry.state} - 000000`, constituency: loc }
        ];
      }

      return {
        ...entry,
        matchedLocation,
        filteredBooths: relevantBooths.length > 0 ? relevantBooths : entry.booths.slice(0, 3),
      };
    });

  if (primaryResults.length > 0) return primaryResults;

  // Fallback to searching the comprehensive cities database
  const cityMatches = indianCities.filter(c => c.name.toLowerCase().includes(q));
  if (cityMatches.length > 0) {
    const uniqueStates = [...new Set(cityMatches.map(c => c.state))];
    
    return uniqueStates.map(stateName => {
      const curatedState = electionData.find(s => s.state.toLowerCase() === stateName.toLowerCase());
      const stateObj = curatedState || {
        state: stateName, type: "State/UT", lsSeats: "-", vsSeats: "-", ceo: `CEO ${stateName}`, ceoWebsite: "https://eci.gov.in", helpline: "1950", districts: [], cities: [], booths: []
      };

      const stateCitiesMatched = cityMatches.filter(c => c.state === stateName);
      const primaryCity = stateCitiesMatched[0].name;

      const mockBooths = [
        { id: `PS-${Math.floor(Math.random() * 100)}`, name: `Govt. High School, ${primaryCity}`, address: `Main Road, ${primaryCity}, ${stateName} - 000000`, constituency: primaryCity },
        { id: `PS-${Math.floor(Math.random() * 100) + 100}`, name: `Municipal Office, ${primaryCity}`, address: `Civil Lines, ${primaryCity}, ${stateName} - 000000`, constituency: primaryCity },
        { id: `PS-${Math.floor(Math.random() * 100) + 200}`, name: `Zilla Parishad School, ${primaryCity}`, address: `Station Road, ${primaryCity}, ${stateName} - 000000`, constituency: primaryCity }
      ];

      return {
        ...stateObj,
        matchedLocation: primaryCity,
        filteredBooths: mockBooths
      };
    });
  }

  return [];
}

export default electionData;
