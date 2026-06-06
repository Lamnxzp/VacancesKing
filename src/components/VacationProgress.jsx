import React, { useEffect, useState } from "react";
import { truncateToDecimals } from "@/lib/utils.js";

export default function VacationProgress({ vacation, theme }) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!vacation) {
      setProgress(100);
      return;
    }

    // Using custom rounding method (ceil, floor, round) only for days
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");
    const roundMethod = Math[settings.roundingMethod] || Math.round;

    const calculateProgress = () => {
      const now = new Date().getTime();
      let start, end;

      if (vacation.current) {
        start = vacation.start.getTime();
        end = vacation.end.getTime();
      } else {
        start = vacation.last.getTime();
        end = vacation.start.getTime();
      }

      if (now >= end) {
        setProgress(100);
        setTimeLeft("0s");
        return;
      }

      const totalDuration = end - start;
      const elapsedDuration = now - start;
      const percentage = Math.min(
        100,
        Math.max(0, (elapsedDuration / totalDuration) * 100)
      );
      setProgress(percentage);

      const remainingTime = end - now;
      if (remainingTime < 60 * 1000) {
        setTimeLeft(`${Math.floor(remainingTime / 1000)}s`);
      } else if (remainingTime < 60 * 60 * 1000) {
        setTimeLeft(`${Math.floor(remainingTime / (60 * 1000))}m`);
      } else if (remainingTime < 24 * 60 * 60 * 1000) {
        setTimeLeft(`${Math.floor(remainingTime / (60 * 60 * 1000))}h`);
      } else {
        let totalDays = roundMethod(remainingTime / (24 * 60 * 60 * 1000));
        const parts = [];

        if (totalDays >= 30) {
          const months = Math.floor(totalDays / 30);
          totalDays %= 30;
          parts.push(`${months} mois`);
        }

        if (totalDays >= 7) {
          const weeks = Math.floor(totalDays / 7);
          totalDays %= 7;
          parts.push(`${weeks} semaine${weeks > 1 ? "s" : ""}`);
        }

        if (totalDays > 0) {
          parts.push(`${totalDays} jour${totalDays > 1 ? "s" : ""}`);
        }

        if (parts.length === 0) {
          setTimeLeft("0 jour");
        } else if (parts.length === 1) {
          setTimeLeft(parts[0]);
        } else if (parts.length === 2) {
          setTimeLeft(`${parts[0]} et ${parts[1]}`);
        } else {
          setTimeLeft(
            `${parts.slice(0, -1).join(", ")} et ${parts[parts.length - 1]}`
          );
        }
      }
    };

    const interval = setInterval(calculateProgress, 1000);
    calculateProgress();

    return () => clearInterval(interval);
  }, [vacation]);

  const isOnVacation = vacation?.current;
  const isFinished = progress >= 100 && !isOnVacation;
  const themeGradient = theme.gradient || "";

  const displayProgress = truncateToDecimals(progress, 4);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter">
        {isFinished ? 100 : displayProgress}%
      </h2>
      <div className="w-full bg-zinc-700/50 rounded-full h-6 overflow-hidden border border-zinc-600/50">
        <div
          className={`relative h-full rounded-full bg-gradient-to-r ${themeGradient} transition-all duration-1000 ease-out overflow-hidden`}
          style={{ width: `${isFinished ? 100 : displayProgress}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_3s_1s_infinite_backwards]"></div>
        </div>
      </div>

      <div className="text-2xl md:text-3xl font-medium text-zinc-300">
        {isOnVacation ? (
          <div className="flex flex-col items-center gap-2">
            <div>
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${themeGradient}`}
              >
                En vacances !
              </span>
              <span> 🎉</span>
            </div>
            <div className="text-xl md:text-2xl opacity-80 mt-2">
              Se termine dans{" "}
              <span
                className={`font-medium text-transparent bg-clip-text bg-gradient-to-r ${themeGradient}`}
              >
                {timeLeft}
              </span>
            </div>
          </div>
        ) : isFinished ? (
          <>
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${themeGradient}`}
            >
              En vacances !
            </span>
            <span> 🎉</span>
          </>
        ) : (
          <>
            Plus que{" "}
            <span
              className={`font-medium text-transparent bg-clip-text bg-gradient-to-r ${themeGradient}`}
            >
              {timeLeft}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
