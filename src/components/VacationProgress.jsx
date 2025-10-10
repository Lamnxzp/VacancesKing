import { useState, useEffect } from "react";

const UPDATE_INTERVAL = 30;

export default function VacationProgress({ vacation, progressBarColor, vacationStyle }) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [rate, setRate] = useState("");

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

    setRate(
      hours >= 1
        ? `1% ≈ ${Math.round(hours)} heure${Math.round(hours) > 1 ? "s" : ""}`
        : `1% ≈ ${Math.round(onePercentDuration / (1000 * 60))} minute${
            Math.round(onePercentDuration / (1000 * 60)) > 1 ? "s" : ""
          }`
    );

    const interval = setInterval(calculateProgress, UPDATE_INTERVAL);
    calculateProgress();

    return () => clearInterval(interval);
  }, [vacation]);

  const isOnVacation = progress >= 100;

  return (
    <>
      <h1 className="mb-[-5px] text-[2.5rem] max-md:text-[2rem]">
        <span className="inline-block min-w-[250px] max-md:min-w-[200px]">
          {isOnVacation ? 100 : progress.toFixed(6)}%
        </span>
      </h1>

      {rate && !isOnVacation && (
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
    </>
  );
}
