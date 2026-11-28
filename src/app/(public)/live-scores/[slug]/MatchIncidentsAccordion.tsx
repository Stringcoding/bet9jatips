"use client";

import React, { useState } from "react";
import {
  Clock,
  ArrowLeftRight,
  Square,
  ChevronDown,
} from "lucide-react";

export interface MatchIncident {
  time?: number | string;
  type?: string;
  type_id?: number;
  side?: "home" | "away" | string;
  player?: string;
  player_in?: string;
  player_out?: string;
  is_card?: boolean;
  is_sub?: boolean;
}

function IncidentRow({
  incident,
  homeTeam,
  awayTeam,
}: {
  incident: MatchIncident;
  homeTeam: string;
  awayTeam: string;
}) {
  const isAway = incident.side === "away";
  const lowerType = (incident.type || "").toLowerCase();
  const isRedCard =
    lowerType.includes("red") || incident.type_id === 4 || incident.type_id === 5;
  const isYellowCard =
    incident.is_card || lowerType.includes("yellow") || incident.type_id === 3;
  const isSub =
    incident.is_sub || lowerType.includes("sub") || incident.type_id === 9;

  const teamLabel = isAway ? awayTeam : homeTeam;

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg bg-bg-deep/60 border border-gray-700/40">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-xs font-extrabold text-brand-green tabular-nums w-8 shrink-0">
          {incident.time !== "" ? `${incident.time}'` : "--"}
        </span>

        {isSub ? (
          <ArrowLeftRight className="w-4 h-4 text-sky-400 shrink-0" />
        ) : isRedCard ? (
          <Square className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
        ) : isYellowCard ? (
          <Square className="w-4 h-4 text-brand-yellow fill-brand-yellow shrink-0" />
        ) : (
          <Clock className="w-4 h-4 text-text-muted shrink-0" />
        )}

        <div className="min-w-0">
          {isSub ? (
            <div className="text-xs leading-snug">
              {incident.player_in && (
                <p className="font-bold text-brand-green truncate">
                  IN: {incident.player_in}
                </p>
              )}
              {incident.player_out && (
                <p className="text-text-muted truncate">
                  OUT: {incident.player_out}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs font-bold text-surface-white truncate">
              {incident.player || incident.type}
            </p>
          )}
          <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
            {incident.type} • {teamLabel}
          </p>
        </div>
      </div>

      <span
        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
          isAway
            ? "bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30"
            : "bg-brand-green/15 text-brand-green border border-brand-green/30"
        }`}
      >
        {isAway ? "Away" : "Home"}
      </span>
    </div>
  );
}

export default function MatchIncidentsAccordion({
  incidents,
  homeTeam,
  awayTeam,
}: {
  incidents: MatchIncident[];
  homeTeam: string;
  awayTeam: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-bg-slate rounded-xl border border-gray-700/50 overflow-hidden shadow-xl mb-5">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full bg-bg-slate hover:bg-gray-800/60 px-4 py-3 flex items-center justify-between transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-brand-yellow rounded-full" />
          <Clock className="text-brand-yellow w-4 h-4" />
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-surface-white">
            Match Incidents ({incidents.length})
          </h3>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
          <span>{isOpen ? "Hide" : "Show"}</span>
          <ChevronDown
            size={16}
            className={`text-brand-yellow transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-gray-700/50">
          {incidents.length === 0 ? (
            <div className="text-center py-6 bg-bg-deep/50 rounded-lg border border-gray-700/30">
              <p className="text-text-muted text-xs font-semibold">
                No match incidents recorded yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {incidents.map((incident, index) => (
                <IncidentRow
                  key={`${incident.time}-${incident.type}-${index}`}
                  incident={incident}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
