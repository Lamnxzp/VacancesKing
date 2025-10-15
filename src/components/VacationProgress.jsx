import { useState, useEffect } from "react";

const UPDATE_INTERVAL = 30;

export default function VacationProgress({
  vacation,
  progressBarColor,
  vacationStyle,
}) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    if (!vacation) return;

    if (vacation.current) {
      setProgress(100);
      setTimeLeft("0 secondes");
      setRate("");
      return;
    }

    const settings = JSON.parse(localStorage.getItem("settings") || "{}");
    const roundMethod = Math[settings.roundingMethod] || Math.round;

    const totalDuration = vacation.start - vacation.last;
    const onePercentDuration = totalDuration / 100;
    const hours = onePercentDuration / (1000 * 60 * 60);

    setRate(
      `1% ≈ ${Math.round(hours)} heure${Math.round(hours) > 1 ? "s" : ""}`
    );

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
        const secondes = roundMethod(remainingTime / 1000);
        setTimeLeft(`${secondes} seconde${secondes <= 1 ? "" : "s"}`);
      } else if (remainingTime < 60 * 60 * 1000) {
        const minutes = roundMethod(remainingTime / (60 * 1000));
        setTimeLeft(`${minutes} minute${minutes <= 1 ? "" : "s"}`);
      } else if (remainingTime < 24 * 60 * 60 * 1000) {
        const heures = roundMethod(remainingTime / (60 * 60 * 1000));
        setTimeLeft(`${heures} heure${heures <= 1 ? "" : "s"}`);
      } else {
        const jours = roundMethod(remainingTime / (24 * 60 * 60 * 1000));
        setTimeLeft(`${jours} jour${jours <= 1 ? "" : "s"}`);
      }
    };

    const interval = setInterval(calculateProgress, UPDATE_INTERVAL);
    calculateProgress();

    return () => clearInterval(interval);
  }, [vacation]);

  const isOnVacation = progress >= 100;

  return (
    <>
      <h1 className="text-[2.5rem] max-md:text-[2rem]">
        <span className="inline-block min-w-[250px] max-md:min-w-[200px]">
          {isOnVacation ? 100 : progress.toFixed(6)}%
        </span>
      </h1>

      {rate && !isOnVacation && (
        <div className="text-sm text-[#808080] text-center mt-[-0.5rem] mb-1">
          ({rate})
        </div>
      )}

      <div className="w-[95%] max-w-[1200px] h-[60px] border-[5px] mt-4 border-white relative bg-black shadow-[0_0_0_3px_black,0_0_0_7px_white]">
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
            <span
              className={
                vacationStyle?.style ? `rainbow-${vacationStyle.style}` : ""
              }
            >
              En vacances !
            </span>
            <img
              src="/emojis/party_popper.avif"
              alt="party popper emoji"
              className="ml-1.5 h-[1.25em] w-auto align-middle inline-block saturate-150"
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
    </>
  );
}
