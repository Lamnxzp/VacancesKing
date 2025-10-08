import { useState, useEffect, useMemo } from "react";
import "./App.css";
import SettingsDialog from "./components/SettingsDialog";

const VACATION_STYLES = {
  "Vacances de la Toussaint": {
    style: "autumn-gradient-text",
    emoji: "fallen-leaf",
  },
  "Vacances de Noël": {
    style: "christmas-gradient-text",
    emoji: "santa_beer",
  },
  "Vacances d'Hiver": {
    style: "winter-gradient-text",
    emoji: "snowflake",
  },
  "Vacances de Printemps": {
    style: "spring-gradient-text",
    emoji: "blossom",
  },
  "Pont de l'Ascension": {
    style: "sky-gradient-text",
    emoji: "cloud",
  },
  "Début des Vacances d'Été": {
    style: "summer-gradient-text",
    emoji: "sun-with-face",
  },
};

const GRADIENT_COLORS = {
  "autumn-gradient-text": "#FFB347",
  "christmas-gradient-text": "#FF6347",
  "winter-gradient-text": "#CEDEF2",
  "spring-gradient-text": "#FBC2EB",
  "sky-gradient-text": "#E0FFFF",
  "summer-gradient-text": "#FFD700",
};

const ZONE = "C";
const UPDATE_INTERVAL = 30;

function App() {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [rate, setRate] = useState("");
  const [vacation, setVacation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const progressBarColor = useMemo(() => {
    if (vacation?.name && VACATION_STYLES[vacation.name]?.style) {
      const gradientStyle = VACATION_STYLES[vacation.name].style;
      return GRADIENT_COLORS[gradientStyle] || "#00ff00";
    }
    return "#00ff00";
  }, [vacation]);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 300);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const fetchVacation = async () => {
      try {
        const settings = JSON.parse(localStorage.getItem("settings") || "{}");
        const vacationOverrides = settings.vacationsOverrides || {};

        const currentYear = new Date().getFullYear();
        const schoolYear =
          new Date().getMonth() >= 8
            ? `${currentYear}-${currentYear + 1}`
            : `${currentYear - 1}-${currentYear}`;

        const baseUrl =
          "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records";
        const url = `${baseUrl}?refine=zones:${encodeURIComponent(
          `Zone ${ZONE.toUpperCase()}`
        )}&refine=annee_scolaire:${encodeURIComponent(
          schoolYear
        )}&group_by=${encodeURIComponent(
          "description,start_date,end_date,zones"
        )}&limit=20`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");

        const json = await response.json();
        if (!json?.results?.length) return;

        const now = new Date();
        const allVacations = json.results
          .map((result) => {
            const override = vacationOverrides[result.description];
            return {
              name: result.description,
              start: new Date(
                override?.start_date || result.start_date
              ),
              end: new Date(
                override?.end_date || result.end_date
              ),
            };
          })
          .sort((a, b) => a.start - b.start);

        const upcomingVacations = allVacations.filter((v) => v.start > now);
        if (!upcomingVacations.length) return;

        const nextVacation = upcomingVacations[0];
        const nextVacationIndex = allVacations.findIndex(
          (v) => v.start.getTime() === nextVacation.start.getTime()
        );

        let progressStart;
        if (nextVacationIndex === 0) {
          progressStart = new Date(nextVacation.start.getFullYear(), 8, 1);
        } else {
          progressStart = allVacations[nextVacationIndex - 1].end;
        }

        setVacation({
          name: nextVacation.name,
          start: nextVacation.start,
          last: progressStart,
        });
      } catch (error) {
        console.error("Error fetching vacation data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVacation();
  }, []);

  useEffect(() => {
    if (!vacation) return;

    const calculateProgress = () => {
      const now = new Date();
      const totalDuration = vacation.start - vacation.last;
      const elapsedDuration = now - vacation.last;
      const percentage = Math.min(
        100,
        Math.max(0, (elapsedDuration / totalDuration) * 100)
      );

      setProgress(percentage);

      const remainingTime = vacation.start - now;

      if (remainingTime < 60 * 1000) {
        setTimeLeft(`${Math.floor(remainingTime / 1000)} secondes`);
      } else if (remainingTime < 60 * 60 * 1000) {
        setTimeLeft(`${Math.floor(remainingTime / (60 * 1000))} minutes`);
      } else if (remainingTime < 24 * 60 * 60 * 1000) {
        setTimeLeft(`${Math.floor(remainingTime / (60 * 60 * 1000))} heures`);
      } else {
        setTimeLeft(
          `${Math.floor(remainingTime / (24 * 60 * 60 * 1000))} jours`
        );
      }
    };

    const totalDuration = vacation.start - vacation.last;
    const onePercentDuration = totalDuration / 100;
    const hours = onePercentDuration / (1000 * 60 * 60);

    if (hours >= 1) {
      setRate(
        `1% ≈ ${Math.round(hours)} heure${Math.round(hours) > 1 ? "s" : ""}`
      );
    } else {
      const minutes = onePercentDuration / (1000 * 60);
      setRate(
        `1% ≈ ${Math.round(minutes)} minute${
          Math.round(minutes) > 1 ? "s" : ""
        }`
      );
    }

    const interval = setInterval(calculateProgress, UPDATE_INTERVAL);
    calculateProgress();

    return () => clearInterval(interval);
  }, [vacation]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-[#999] text-xl font-bold loading-text">
          Chargement{dots}
        </span>
      </div>
    );
  }

  const vacationStyle = vacation?.name && VACATION_STYLES[vacation.name];
  const isOnVacation = progress >= 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-5 relative antialiased bg-black">
      <h1 className="mb-2.5 text-[2.5rem] border-2 border-dashed border-white/25 rounded-[10px] p-2.5 flex items-center justify-center flex-wrap max-md:text-[1.8rem]">
        <span className={`font-bold ${vacationStyle?.style || ""}`}>
          {vacation?.name}
        </span>
        {vacationStyle?.emoji && (
          <img
            src={`/emojis/${vacationStyle.emoji}.avif`}
            alt={`${vacationStyle.emoji} emoji`}
            className="ml-2.5 h-[1.25em] w-auto align-middle"
          />
        )}
      </h1>

      <h1 className="mb-[-5px] text-[2.5rem] max-md:text-[2rem]">
        <span className="inline-block min-w-[250px] max-md:min-w-[200px]">
          {isOnVacation ? 100 : progress.toFixed(6)}%
        </span>
      </h1>

      {!isOnVacation && rate && (
        <div className="mb-5 text-sm text-[#808080] text-center">({rate})</div>
      )}

      <div className="w-[95%] max-w-[1200px] h-[60px] border-[5px] border-white relative bg-black shadow-[0_0_0_3px_black,0_0_0_7px_white]">
        <div
          className="h-full transition-[width] duration-1000 ease-linear"
          style={{
            width: `${progress}%`,
            backgroundColor: progressBarColor,
          }}
        />
      </div>

      <div className="mt-[30px] text-[1.7rem] max-md:text-[1.4rem]">
        {isOnVacation ? (
          <>
            <span className="rainbow-text">En vacances !</span>
            <img
              src="/emojis/party_popper.avif"
              alt="party popper emoji"
              className="ml-1.5 h-[1.25em] w-auto align-middle inline-block"
            />
          </>
        ) : (
          <>
            Plus que{" "}
            <span
              className={
                vacationStyle?.style ? `rainbow-${vacationStyle.style}` : ""
              }
            >
              {timeLeft}
            </span>{" "}
            avant les vacances
          </>
        )}
      </div>

      <div className="absolute bottom-5 w-full px-5 flex items-center">
        <div className="pointer-events-none absolute inset-x-0 text-center text-[#808080] opacity-30 text-base font-[Arial,sans-serif]">
          zaza paye pas
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="ml-auto relative z-10 text-[#808080] hover:text-white/80 px-3 py-1.5 border-2 border-dashed border-[#808080]/30 rounded-[10px] hover:border-white/40 opacity-70 hover:opacity-90 transition-all duration-300 text-sm font-[Arial,sans-serif] focus:outline-none cursor-pointer"
        >
          Paramètres
        </button>

        <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </div>
  );
}

export default App;
