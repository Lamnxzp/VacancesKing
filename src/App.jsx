import React, { useState, useEffect, useMemo, useCallback } from "react";

import "./App.css";
import { getSchoolYear } from "@/lib/utils.js";
import SettingsDialog from "@/components/SettingsDialog.jsx";
import VacationProgress from "@/components/VacationProgress.jsx";
import { Settings } from "lucide-react";

const VACATION_THEMES = {
  "Vacances de la Toussaint": {
    gradient: "from-orange-400 to-yellow-500",
    emoji: "🍁",
  },
  "Vacances de Noël": {
    gradient: "from-red-500 to-green-500",
    emoji: "🎄",
  },
  "Vacances d'Hiver": {
    gradient: "from-sky-300 to-blue-400",
    emoji: "❄️",
  },
  "Vacances de Printemps": {
    gradient: "from-pink-400 to-purple-400",
    emoji: "🌸",
  },
  "Pont de l'Ascension": {
    gradient: "from-sky-400 to-indigo-400",
    emoji: "☁️",
  },
  "Début des Vacances d'Été": {
    gradient: "from-yellow-300 to-orange-400",
    emoji: "☀️",
  },
};

const DEFAULT_THEME = {
  gradient: "from-zinc-400 to-zinc-200",
  emoji: "📅",
};

function App() {
  const [vacation, setVacation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);

  const theme = useMemo(() => {
    return VACATION_THEMES[vacation?.name] || DEFAULT_THEME;
  }, [vacation]);

  const fetchVacationData = useCallback(async () => {
    setShowContent(false);
    setIsLoading(true);
    setError(null);
    try {
      const settings = JSON.parse(localStorage.getItem("settings") || "{}");
      const { zone = "C", vacationOverrides = {} } = settings;
      const schoolYear = getSchoolYear();

      const baseUrl =
        "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records";
      const url = `${baseUrl}?refine=zones:${encodeURIComponent(
        `Zone ${zone}`
      )}&refine=annee_scolaire:${encodeURIComponent(
        schoolYear
      )}&group_by=${encodeURIComponent(
        "description,start_date,end_date,zones"
      )}&limit=20`;

      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (!data?.results?.length)
        throw new Error(
          "Aucune donnée de vacances trouvée pour cette zone/année."
        );

      const sortedVacations = data.results
        .map((v) => {
          const override = vacationOverrides[v.description] || {};
          return {
            name: v.description,
            start: new Date(override.start_date || v.start_date),
            end: new Date(override.end_date || v.end_date),
          };
        })
        .sort((a, b) => a.start - b.start);

      const now = new Date();
      const currentVacation = sortedVacations.find(
        (v) => now >= v.start && now < v.end
      );

      if (currentVacation) {
        setVacation({ ...currentVacation, current: true });
        return;
      }

      const nextVacation = sortedVacations.find((v) => v.start > now);
      if (!nextVacation) {
        setVacation(null);
        return;
      }

      const nextVacationIndex = sortedVacations.findIndex(
        (v) => v.name === nextVacation.name
      );
      const previousVacationEnd =
        nextVacationIndex > 0
          ? sortedVacations[nextVacationIndex - 1].end
          : new Date(`${schoolYear.split("-")[0]}-09-01`); // Rentrée scolaire

      setVacation({
        name: nextVacation.name,
        start: nextVacation.start,
        last: previousVacationEnd,
        current: false,
      });
    } catch (err) {
      console.error("Error fetching vacation data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      // Petit délai pour permettre au DOM de se mettre à jour avant la transition
      setTimeout(() => setShowContent(true), 100);
    }
  }, []);

  useEffect(() => {
    fetchVacationData();
  }, [fetchVacationData]);

  const renderContent = () => {
    if (isLoading) return null;

    if (error) {
      return (
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Une erreur est survenue.</p>
          <p className="text-zinc-400 mb-6">{error}</p>
        </div>
      );
    }

    if (!vacation) {
      return (
        <div className="text-zinc-300 text-2xl">
          Plus de vacances prévues pour cette année scolaire.
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          <span
            className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}
          >
            {vacation.name}
          </span>
          <span className="ml-3 text-4xl">{theme.emoji}</span>
        </h1>
        <VacationProgress vacation={vacation} theme={theme} />
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col items-center justify-center p-4 relative antialiased overflow-hidden">
      <div className="absolute top-0 right-0 p-4 z-20">
        <button
          type="button"
          onClick={() =>
            window.open("https://github.com/Lamnxzp/VacancesKing", "_blank")
          }
          className="p-3 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
          aria-label="Ouvrir le dépôt GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-github-icon lucide-github"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
          aria-label="Ouvrir les paramètres"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Loading text */}
      <div
        className={`absolute transition-opacity duration-500 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-zinc-400 text-xl animate-pulse text-center">
          Chargement des données...
        </div>
      </div>

      {/* Content */}
      <div
        className={`w-full transition-opacity duration-700 ${
          !isLoading && showContent
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {renderContent()}
      </div>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          fetchVacationData(); // Refresh data when dialog closes
        }}
      />
    </main>
  );
}

export default App;
