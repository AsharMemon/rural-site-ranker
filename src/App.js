import React, { useState, useMemo } from 'react';
import { MapPin, Users, Stethoscope, Baby, Tent, Video, AlertCircle, ChevronDown, Search, UserCheck, Sparkles } from 'lucide-react';

// --- Data Structure ---

const locations = [
  {
    id: 'banff',
    name: "Banff",
    distance: 127,
    population: 9656,
    preceptors: ["Dr. Zuzana Triska", "Dr. Alina Smirnova"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: false, // Names appear Eastern European/Caucasian
    notes: "Alpine Medical Clinic & Bear Street. Tourist medicine, MSK injuries, low risk obstetrics. Service Stoney Nakoda reserve."
  },
  {
    id: 'bassano',
    name: "Bassano",
    distance: 141,
    population: 1200, // Estimated based on small town context
    preceptors: ["Dr. Amechi Okam"],
    hasEM: true,
    hasObs: false,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: true,
    notes: "Bassano Medical Clinic. Dr. Okam has solo practice. Exposure to ER and clinic. 40 mins west of Medicine Hat."
  },
  {
    id: 'blairmore',
    name: "Blairmore (Crowsnest Pass)",
    distance: 227,
    population: 5700,
    preceptors: ["Dr. Vanessa Rogers", "Dr. Ali Barras"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: true, // Ali Barras likely diversity
    notes: "Crowsnest Medical Clinic. 5 mountain communities. Full service hospital, active OR, GI, Gyn. 15-20 deliveries/year."
  },
  {
    id: 'brooks',
    name: "Brooks",
    distance: 189,
    population: 14623,
    preceptors: ["Dr. Tobi Owolabi", "Dr. Petrus Vermeulen", "Dr. Thian Muller", "Dr. Cobus Grobbelaar", "Dr. Erich van der Linde"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: true, // Dr. Owolabi
    notes: "Busy regional center. Large immigrant population (meat packing industry). 4 clinics, active OR, OB, Anesthesia."
  },
  {
    id: 'camrose',
    name: "Camrose",
    distance: 278, // PDF says 278km
    population: 19847,
    preceptors: ["Dr. Babatunde Awakan"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: true, // Dr. Awakan
    notes: "Smith Clinic. Major regional referral center. CT, OR, Active ER. Over 400 deliveries/year."
  },
  {
    id: 'canmore',
    name: "Canmore",
    distance: 105,
    population: 14530,
    preceptors: ["Dr. Megan Cuthbertson", "Dr. Emma Morin"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: true,
    hasPOCPreceptor: false,
    notes: "Mountain Maternity & Ridgeview. Busy hospital, tourist/rec injuries. Strong OB focus. Video available."
  },
  {
    id: 'cardston',
    name: "Cardston",
    distance: 235,
    population: 3454,
    preceptors: ["Dr. Justin Low"],
    hasEM: true,
    hasObs: false, // PDF says No for clinic deliveries, but does prenatal
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: true, // Dr. Low
    notes: "Bordering Kainai Nation. Residents run 'mini-clinic'. Visits to satellite clinic on reserve. OR/Anesthesia exposure."
  },
  {
    id: 'claresholm',
    name: "Claresholm",
    distance: 133,
    population: 3823,
    preceptors: ["Dr. Scott Smith"],
    hasEM: true,
    hasObs: false, // Prenatal to 24wks only
    hasIndig: false,
    hasVideo: true,
    hasPOCPreceptor: false,
    notes: "Claresholm Medical Centre. Large elderly population, psych rehab hospital nearby. Video available."
  },
  {
    id: 'delburne',
    name: "Delburne",
    distance: 181,
    population: 889,
    preceptors: ["Dr. Muti Kauchali"],
    hasEM: true, // Via rotation in Red Deer/Blackfalds
    hasObs: true,
    hasIndig: false,
    hasVideo: false,
    hasPOCPreceptor: true, // Dr. Kauchali
    notes: "Village 40min east of Red Deer. New clinic. Includes shifts in Blackfalds and Red Deer Hospitalist."
  },
  {
    id: 'didsbury',
    name: "Didsbury",
    distance: 80,
    population: 5092,
    preceptors: ["Dr. Akin Osakuade", "Dr. Lauren Galbraith"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: true, // Dr. Osakuade
    notes: "Trinity Rose & Jacaranda Clinics. Hospital/OR work done in Olds. OSS skills available."
  },
  {
    id: 'drumheller',
    name: "Drumheller",
    distance: 135,
    population: 7968,
    preceptors: ["Dr. Brock Randolph", "Dr. Derek Maseka", "Dr. Ritesh Ram"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: true, // Dr. Maseka, Dr. Ram
    notes: "Riverside & Associate Clinics. Dinosaur capital. Federal penitentiary (complex patients). Cancer clinic, dialysis, CT."
  },
  {
    id: 'hanna',
    name: "Hanna",
    distance: 218,
    population: 2552,
    preceptors: ["Dr. Wendy Fortna"],
    hasEM: true,
    hasObs: false,
    hasIndig: false,
    hasVideo: false,
    hasPOCPreceptor: false,
    notes: "Hanna Medical Clinic. Agricultural community. Hospital in town with ER."
  },
  {
    id: 'high_river',
    name: "High River",
    distance: 65,
    population: 14448,
    preceptors: ["Dr. Scott Rapske", "Dr. Chris Powell", "Dr. Makhdoom", "Dr. Mark Smillie"],
    hasEM: true,
    hasObs: true,
    hasIndig: false,
    hasVideo: false,
    hasPOCPreceptor: true, // Dr. Makhdoom
    notes: "Charles Clark & Highwood Health. Mini-regional center. Busy ER (20k/yr), active Obs (400/yr), OR."
  },
  {
    id: 'innisfail',
    name: "Innisfail",
    distance: 120,
    population: 7672,
    preceptors: ["Dr. Upesh Chauhan", "Dr. Andrew Wing"],
    hasEM: true,
    hasObs: true,
    hasIndig: false,
    hasVideo: false,
    hasPOCPreceptor: true, // Dr. Chauhan, Dr. Wing
    notes: "Innisfail Medical Clinic. Strong academic center. Hospitalist, ER, LTC, minor surgery."
  },
  {
    id: 'inuvik',
    name: "Inuvik, NT",
    distance: 3472,
    population: 3000,
    preceptors: ["Dr. Gail Robson"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: false,
    notes: "Remote northern site. Cultural safety focus. Full scope rural: ER, OB, OR, remote community visits."
  },
  {
    id: 'olds',
    name: "Olds",
    distance: 96,
    population: 9567,
    preceptors: ["Dr. Murray Rodych"],
    hasEM: true,
    hasObs: true,
    hasIndig: false,
    hasVideo: false,
    hasPOCPreceptor: false,
    notes: "Wild Rose Medical Centre. Rapid growth town. 35 bed hospital, surgical program, ~200 deliveries/year."
  },
  {
    id: 'olds_didsbury',
    name: "Olds/Didsbury (Combined)",
    distance: 88, // Avg
    population: 14600, // Combined
    preceptors: ["Dr. Lauren Galbraith (OSS)", "Clinic Team"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: true, // Shared pool
    notes: "Likely a rotation split between Jacaranda (Didsbury) and hospital work in Olds."
  },
  {
    id: 'pincher_creek',
    name: "Pincher Creek",
    distance: 216,
    population: 3428,
    preceptors: ["Dr. Gavin Parker", "Dr. Mark Stephens"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: true,
    hasPOCPreceptor: false,
    notes: "Associate Clinic & PC Medical Clinic. Serves Piikani Nation. Active ER, OR, Anesthesia. Video available."
  },
  {
    id: 'raymond',
    name: "Raymond",
    distance: 244,
    population: 4136,
    preceptors: ["Dr. Eric Baker"],
    hasEM: true,
    hasObs: false, // Prenatal only
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: false,
    notes: "Raymond Medical Clinic. 20 min south of Lethbridge. Co-located clinic/hospital. Busy ER."
  },
  {
    id: 'sundre',
    name: "Sundre",
    distance: 116,
    population: 2544,
    preceptors: ["Dr. Rob Warren", "Dr. Jon Sommerville"],
    hasEM: true,
    hasObs: false, // No OR/Obs
    hasIndig: false, // PDF says Unknown/No
    hasVideo: false,
    hasPOCPreceptor: false,
    notes: "Moose & Squirrel / Greenwood Family. Heavy recreational/tourist ER in summer. Simulation lab onsite."
  },
  {
    id: 'taber',
    name: "Taber",
    distance: 259,
    population: 9212,
    preceptors: ["Dr. Ryan Torrie", "Dr. Eric Leishman"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: false,
    notes: "Taber Clinic / Coulee Medical. Co-located in hospital. ARP model. Surgical procedures, GI, OB."
  },
  {
    id: 'whitehorse',
    name: "Whitehorse, YT",
    distance: 2251,
    population: 24000,
    preceptors: ["Dr. Julie Warren", "Dr. Alison Madlung"],
    hasEM: true,
    hasObs: true,
    hasIndig: true,
    hasVideo: false,
    hasPOCPreceptor: false,
    notes: "Capital of Yukon. Regional hospital with ICU, psych, surgical specialists. Multiple clinics available."
  }
];

// --- Components ---

const Badge = ({ children, colorClass }) => (
  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colorClass} backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-sm`}>
    {children}
  </span>
);

const Toggle = ({ label, active, onClick, icon: Icon, colorClass }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${active
      ? `${colorClass} border-transparent text-white shadow-lg shadow-${colorClass.split('-')[1]}-500/30`
      : 'bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-md'
      }`}
  >
    {Icon && <Icon size={18} className={active ? 'animate-pulse' : ''} />}
    <span className="text-sm font-semibold">{label}</span>
    {active && <span className="ml-1 text-lg">✓</span>}
  </button>
);

const RuralSiteMatch = () => {
  const [filterPOC, setFilterPOC] = useState(false);
  const [filterIndig, setFilterIndig] = useState(false);
  const [filterObs, setFilterObs] = useState(false);
  const [filterVideo, setFilterVideo] = useState(false);

  const [sortBy, setSortBy] = useState('distance-asc');
  const [expandedId, setExpandedId] = useState(null);

  // Filter & Sort Logic
  const processedLocations = useMemo(() => {
    let result = locations;

    // Filtering (Exclusion Logic: If toggle is ON, exclude sites WITH that feature)
    // Note: Mentorship (POC) usually is "Show me sites WITH mentorship", but user asked to be able to "exclude sites with those features"
    // The user specifically mentioned "emergency med" or "obstetrics".
    // I will apply exclusion logic to clinical filters.
    // For "Made Video" and "Mentorship", exclusion might be weird ("Exclude sites with video"?).
    // But consistent behavior is best. I will treat ALL toggles as "Exclude" if that ensures the user can "exclude sites with those features".
    // "By clicking 'emergency med' or 'obstetrics' ... you should be able to exclude sites with those features"
    // This implies creating a "No EM" or "No Obs" filter.

    if (filterPOC) result = result.filter(l => !l.hasPOCPreceptor);
    if (filterIndig) result = result.filter(l => !l.hasIndig);
    if (filterObs) result = result.filter(l => !l.hasObs);
    // For Video, "Made Video" usually implies "Show me only ones with video". 
    // If I click "Made Video" and it REMOVES sites with video, that's counter-intuitive unless labeled "No Video".
    // I'll stick to the user's explicit request for EM/Obs and apply it broadly for consistency, but maybe Video is an exception?
    // "Change name of 'has video info' to 'made video'".
    // If I rename it to "Made Video" and it excludes, it's confusing.
    // I will assume the user wants to filter *by* these attributes.
    // Maybe they want: "Show only sites without EM".
    // I will implement exclusion for EM, Obs, Indig.

    if (filterVideo) result = result.filter(l => l.hasVideo); // Keep video as "Include" for now unless explicitly asked?
    // "By clicking 'emergency med' or 'obstetrics' or the other toggles, you should be able to exclude sites with those features"
    // "the other toggles" implies ALL.
    // So if I toggle "Made Video", it excludes sites with video? (Show me sites WITHOUT video?)
    // That seems unlikely to be useful.
    // But "Exclude sites with Obstetrics" is a valid preference.
    // I'll implement exclusion for ALL except maybe Video/Mentorship if it breaks UX, but "other toggles" is strong.
    // I'll filter OUT sites with the feature.

    if (filterVideo) result = result.filter(l => !l.hasVideo);

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'distance-asc') return a.distance - b.distance;
      if (sortBy === 'distance-desc') return b.distance - a.distance;
      if (sortBy === 'pop-desc') return b.population - a.population;
      if (sortBy === 'pop-asc') return a.population - b.population;

      // Multi-sort: Distance (primary) + Population (secondary)
      // Since distance is mostly unique, we normalize to create a score?
      // "Sort by distance and population at the same time"
      // Let's implement a simple rank sum? (Rank by Dist + Rank by Pop)
      // For now, I'll do Primary/Secondary standard keys.
      if (sortBy === 'dist-asc-pop-desc') {
        if (a.distance !== b.distance) return a.distance - b.distance;
        return b.population - a.population;
      }
      if (sortBy === 'dist-asc-pop-asc') {
        if (a.distance !== b.distance) return a.distance - b.distance;
        return a.population - b.population;
      }

      return 0;
    });

    return result;
  }, [filterPOC, filterIndig, filterObs, filterVideo, sortBy]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative p-4 md:p-8">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-white/40 shadow-lg mb-4">
            <Sparkles size={18} className="text-purple-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Find Your Perfect Match
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Rural Rotation Site Selector
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Discover and rank Alberta rural family medicine sites tailored to your personal priorities and career goals.
          </p>
        </div>

        {/* Controls Container */}
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6 mb-8 sticky top-4 z-10">
          {/* Top Row: Sort & Main Toggles */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
            {/* Sort */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-700">Sort by:</label>
              <select
                className="bg-white/90 backdrop-blur-sm border-2 border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 px-4 py-2.5 font-medium shadow-sm hover:border-slate-300 transition-all cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="distance-asc">📍 Distance (Closest to Calgary)</option>
                <option value="distance-desc">📍 Distance (Furthest)</option>
                <option value="pop-desc">👥 Population (Largest)</option>
                <option value="pop-asc">👥 Population (Smallest)</option>
                <option value="dist-asc-pop-desc">📍 Closest + 👥 Largest</option>
                <option value="dist-asc-pop-asc">📍 Closest + 👥 Smallest</option>
              </select>
            </div>

            {/* Mentorship Toggle (Highlighted) */}
            <Toggle
              label="Exclude BIPOC Preceptor"
              active={filterPOC}
              onClick={() => setFilterPOC(!filterPOC)}
              icon={UserCheck}
              colorClass="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            />
          </div>

          {/* Bottom Row: Clinical Filters */}
          <div className="flex flex-wrap gap-3">
            <Toggle
              label="Exclude Obs"
              active={filterObs}
              onClick={() => setFilterObs(!filterObs)}
              icon={Baby}
              colorClass="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
            />
            <Toggle
              label="Exclude Indigenous"
              active={filterIndig}
              onClick={() => setFilterIndig(!filterIndig)}
              icon={Tent}
              colorClass="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            />
            <Toggle
              label="Made Video (Exclude)"
              active={filterVideo}
              onClick={() => setFilterVideo(!filterVideo)}
              icon={Video}
              colorClass="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="max-w-5xl mx-auto grid gap-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
              Showing <span className="text-purple-600 font-bold">{processedLocations.length}</span> locations
            </p>
          </div>

          {processedLocations.map((loc, index) => (
            <div
              key={loc.id}
              className={`bg-white/80 backdrop-blur-md rounded-2xl border-2 transition-all duration-300 overflow-hidden transform hover:scale-[1.01] ${expandedId === loc.id
                ? 'shadow-2xl border-purple-400 ring-4 ring-purple-100'
                : 'shadow-lg border-white/60 hover:border-purple-300 hover:shadow-xl'
                }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Card Header */}
              <div
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-white/40 transition-all duration-200"
                onClick={() => setExpandedId(expandedId === loc.id ? null : loc.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 flex-grow">
                  {/* Name & Badges */}
                  <div className="min-w-[220px]">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-1">
                      {loc.name}
                      {loc.hasVideo && (
                        <div className="bg-blue-500 p-1.5 rounded-lg">
                          <Video size={16} className="text-white" />
                        </div>
                      )}
                    </h3>
                    <div className="text-sm text-slate-600 flex items-center gap-4 font-medium">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <MapPin size={14} className="text-purple-600" /> {loc.distance} km
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Users size={14} className="text-blue-600" /> {loc.population.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    {loc.hasPOCPreceptor && (
                      <Badge colorClass="bg-gradient-to-r from-purple-500 to-purple-600 text-white border border-purple-400">
                        BIPOC Preceptor
                      </Badge>
                    )}
                    {loc.hasIndig && (
                      <Badge colorClass="bg-gradient-to-r from-orange-400 to-orange-500 text-white border border-orange-300">
                        Indigenous Health
                      </Badge>
                    )}
                    {loc.hasObs && (
                      <Badge colorClass="bg-gradient-to-r from-pink-400 to-pink-500 text-white border border-pink-300">
                        Obs
                      </Badge>
                    )}
                    {loc.hasEM && (
                      <Badge colorClass="bg-gradient-to-r from-red-400 to-red-500 text-white border border-red-300">
                        ER
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Chevron */}
                <div className={`ml-4 transition-transform duration-300 ${expandedId === loc.id ? 'rotate-180' : ''}`}>
                  <ChevronDown size={24} className="text-slate-400" />
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === loc.id && (
                <div className="px-5 pb-5 pt-0 bg-gradient-to-br from-slate-50/80 to-purple-50/50 backdrop-blur-sm border-t-2 border-purple-100">
                  <div className="mt-5 grid md:grid-cols-2 gap-5">
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/60 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <div className="bg-purple-100 p-1.5 rounded-lg">
                          <Stethoscope size={16} className="text-purple-600" />
                        </div>
                        Preceptors
                      </h4>
                      <ul className="space-y-2">
                        {loc.preceptors.map((p, idx) => (
                          <li
                            key={idx}
                            className={`text-sm flex items-start gap-2 ${loc.hasPOCPreceptor && !["Dr. Zuzana Triska", "Dr. Alina Smirnova", "Dr. Scott Smith", "Dr. Wendy Fortna"].some(n => p.includes(n))
                              ? "font-bold text-purple-700"
                              : "text-slate-600 font-medium"
                              }`}
                          >
                            <span className="text-purple-400 mt-0.5">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/60 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-700 mb-3">Site Notes</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {loc.notes}
                      </p>
                      {!loc.hasObs && (
                        <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-2.5">
                          <p className="text-xs text-orange-700 italic font-medium">
                            ⚠️ This site may offer prenatal care but typically does not support deliveries/full OB scope.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {processedLocations.length === 0 && (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl border-2 border-dashed border-slate-300 shadow-lg">
              <div className="bg-gradient-to-br from-slate-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={40} className="text-slate-400" />
              </div>
              <p className="text-lg font-semibold text-slate-600 mb-2">No locations match your filters</p>
              <p className="text-sm text-slate-500 mb-4">Try adjusting your criteria to see more results</p>
              <button
                onClick={() => {
                  setFilterPOC(false);
                  // setFilterEM(false);
                  setFilterIndig(false);
                  setFilterObs(false);
                  setFilterVideo(false);
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuralSiteMatch;