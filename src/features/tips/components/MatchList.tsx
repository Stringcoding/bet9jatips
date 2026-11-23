import React from "react";

const MatchList = () => {
  const matches = [
    {
      id: 1,
      league: "Eredivisie",
      home: "AZ Alkmaar",
      away: "PSV Eindhoven",
      time: "Sun 28 May at 1:30",
      venue: "AFAS Stadion",
      odds: ["2.65", "3.60", "2.49"],
    },
    {
      id: 2,
      league: "Eredivisie",
      home: "Twente",
      away: "Ajax",
      time: "Sun 28 May at 1:30",
      venue: "De Grolsch Veste",
      odds: ["1.48", "7.84", "3.24"],
    },
    {
      id: 3,
      league: "Eredivisie",
      home: "Feyenoord",
      away: "Vitesse",
      time: "Sun 28 May at 17:30",
      venue: "De Kuip",
      odds: ["1.29", "6.00", "8.80"],
    },
  ];

  return (
    <div className="bg-bg-slate rounded-2xl p-6 shadow-xl border border-gray-700/50">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-700/50 pb-4">
        <div className="bg-brand-green text-surface-white text-xs font-bold px-2 py-1 rounded">
          SURE ODDS
        </div>
        <h3 className="text-surface-white font-bold text-lg">Eredivisie</h3>
      </div>

      <div className="flex flex-col gap-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-bg-deep rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-700/30 hover:border-brand-green/50 transition-colors">
            
            {/* Teams */}
            <div className="flex items-center gap-4 flex-1 justify-between w-full md:w-auto">
              <div className="flex flex-col items-center md:items-start w-1/3">
                <div className="w-10 h-10 bg-gray-800 rounded-full mb-2 flex items-center justify-center text-xs text-text-muted">H</div>
                <h4 className="text-surface-white font-semibold text-sm text-center md:text-left">{match.home}</h4>
              </div>
              <div className="text-text-muted font-bold text-lg">VS</div>
              <div className="flex flex-col items-center md:items-end w-1/3">
                <div className="w-10 h-10 bg-gray-800 rounded-full mb-2 flex items-center justify-center text-xs text-text-muted">A</div>
                <h4 className="text-surface-white font-semibold text-sm text-center md:text-right">{match.away}</h4>
              </div>
            </div>

            {/* Match Info */}
            <div className="flex flex-col items-center text-center md:text-left text-xs text-text-muted flex-1 border-t md:border-t-0 md:border-l border-gray-700/50 pt-4 md:pt-0 md:pl-6">
              <p className="text-brand-yellow font-medium mb-1">{match.time}</p>
              <p>{match.venue}</p>
              <p className="text-brand-red mt-1 font-semibold">Not Started</p>
            </div>

            {/* Bet Buttons - Neumorphic style */}
            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
              {match.odds.map((odd, index) => (
                <button 
                  key={index}
                  className="flex-1 md:flex-none bg-bg-slate hover:bg-brand-green hover:text-white text-surface-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.05)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3)]"
                >
                  {odd}
                </button>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchList;
