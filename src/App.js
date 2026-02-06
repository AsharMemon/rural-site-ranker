import React, { useState, useMemo } from 'react';
import { MapPin, Users, Stethoscope, Baby, Tent, Video, AlertCircle, ChevronDown, ChevronUp, Search, UserCheck } from 'lucide-react';

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
  <span className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}>
    {children}
  </span>
);

const Toggle = ({ label, active, onClick, icon: Icon, colorClass }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${active
      ? `${colorClass} border-transparent text-white shadow-md`
      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
  >
    {Icon && <Icon size={16} />}
    <span className="text-sm font-medium">{label}</span>
    {active && <span className="ml-1">✓</span>}
  </button>
);

const RuralSiteMatch = () => {
  const [filterPOC, setFilterPOC] = useState(false);
  const [filterEM, setFilterEM] = useState(false);
  const [filterIndig, setFilterIndig] = useState(false);
  const [filterObs, setFilterObs] = useState(false);
  const [filterVideo, setFilterVideo] = useState(false);

  const [sortBy, setSortBy] = useState('distance-asc'); // distance-asc, distance-desc, pop-asc, pop-desc
  const [expandedId, setExpandedId] = useState(null);

  // Filter & Sort Logic
  const processedLocations = useMemo(() => {
    let result = locations;

    // Filtering
    if (filterPOC) result = result.filter(l => l.hasPOCPreceptor);
    if (filterEM) result = result.filter(l => l.hasEM);
    if (filterIndig) result = result.filter(l => l.hasIndig);
    if (filterObs) result = result.filter(l => l.hasObs);
    if (filterVideo) result = result.filter(l => l.hasVideo);

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'distance-asc') return a.distance - b.distance;
      if (sortBy === 'distance-desc') return b.distance - a.distance;
      if (sortBy === 'pop-desc') return b.population - a.population;
      if (sortBy === 'pop-asc') return a.population - b.population;
      return 0;
    });

    return result;
  }, [filterPOC, filterEM, filterIndig, filterObs, filterVideo, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Rural Rotation Site Selector</h1>
        <p className="text-slate-600">
          Rank and explore Alberta rural family medicine sites based on your personal priorities.
        </p>
      </div>

      {/* Controls Container */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 sticky top-2 z-10">

        {/* Top Row: Sort & Main Toggles */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">Sort by:</label>
            <select
              className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="distance-asc">Distance (Closest to Calgary)</option>
              <option value="distance-desc">Distance (Furthest)</option>
              <option value="pop-desc">Population (Largest)</option>
              <option value="pop-asc">Population (Smallest)</option>
            </select>
          </div>

          {/* Mentorship Toggle (Highlighted) */}
          <Toggle
            label="BIPOC Mentorship"
            active={filterPOC}
            onClick={() => setFilterPOC(!filterPOC)}
            icon={UserCheck}
            colorClass="bg-purple-600 hover:bg-purple-700"
          />
        </div>

        {/* Bottom Row: Clinical Filters */}
        <div className="flex flex-wrap gap-2">
          <Toggle
            label="Emergency Med"
            active={filterEM}
            onClick={() => setFilterEM(!filterEM)}
            icon={AlertCircle}
            colorClass="bg-red-500 hover:bg-red-600"
          />
          <Toggle
            label="Obstetrics"
            active={filterObs}
            onClick={() => setFilterObs(!filterObs)}
            icon={Baby}
            colorClass="bg-pink-500 hover:bg-pink-600"
          />
          <Toggle
            label="Indigenous Health"
            active={filterIndig}
            onClick={() => setFilterIndig(!filterIndig)}
            icon={Tent}
            colorClass="bg-orange-500 hover:bg-orange-600"
          />
          <Toggle
            label="Has Video Info"
            active={filterVideo}
            onClick={() => setFilterVideo(!filterVideo)}
            icon={Video}
            colorClass="bg-blue-500 hover:bg-blue-600"
          />
        </div>
      </div>

      {/* Results List */}
      <div className="max-w-5xl mx-auto grid gap-4">
        <p className="text-sm text-slate-500 mb-2">Showing {processedLocations.length} locations</p>

        {processedLocations.map((loc) => (
          <div
            key={loc.id}
            className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${expandedId === loc.id ? 'shadow-md border-blue-400 ring-1 ring-blue-100' : 'shadow-sm border-slate-200 hover:border-blue-300'
              }`}
          >
            {/* Card Header */}
            <div
              className="p-4 cursor-pointer flex items-center justify-between"
              onClick={() => setExpandedId(expandedId === loc.id ? null : loc.id)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-grow">
                {/* Name & Badges */}
                <div className="min-w-[200px]">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    {loc.name}
                    {loc.hasVideo && <Video size={16} className="text-blue-500" />}
                  </h3>
                  <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {loc.distance} km</span>
                    <span className="flex items-center gap-1"><Users size={14} /> Pop: {loc.population.toLocaleString()}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  {loc.hasPOCPreceptor && <Badge colorClass="bg-purple-100 text-purple-700">Mentorship</Badge>}
                  {loc.hasIndig && <Badge colorClass="bg-orange-100 text-orange-700">Indigenous Health</Badge>}
                  {loc.hasObs && <Badge colorClass="bg-pink-100 text-pink-700">Obs</Badge>}
                  {loc.hasEM && <Badge colorClass="bg-red-100 text-red-700">ER</Badge>}
                </div>
              </div>

              {/* Chevron */}
              <div className="text-slate-400 ml-4">
                {expandedId === loc.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === loc.id && (
              <div className="px-4 pb-4 pt-0 bg-slate-50 border-t border-slate-100">
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Stethoscope size={16} /> Preceptors
                    </h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {loc.preceptors.map((p, idx) => (
                        <li key={idx} className={loc.hasPOCPreceptor && !["Dr. Zuzana Triska", "Dr. Alina Smirnova", "Dr. Scott Smith", "Dr. Wendy Fortna"].some(n => p.includes(n)) ? "font-medium text-purple-700" : ""}>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Site Notes</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {loc.notes}
                    </p>
                    {!loc.hasObs && (
                      <p className="text-xs text-orange-600 mt-2 italic">
                        * Note: This site may offer prenatal care but typically does not support deliveries/full OB scope.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {processedLocations.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>No locations match your current filters.</p>
            <button
              onClick={() => {
                setFilterPOC(false);
                setFilterEM(false);
                setFilterIndig(false);
                setFilterObs(false);
                setFilterVideo(false);
              }}
              className="mt-4 text-blue-600 hover:underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuralSiteMatch;