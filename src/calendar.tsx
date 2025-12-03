"use client";

import React, { useMemo, useState } from "react";

type CalendarProps = {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
};

const WEEK_DAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  className = "",
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const { days, firstWeekday } = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const d: Date[] = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      d.push(new Date(currentYear, currentMonth, day));
    }
    return { days: d, firstWeekday: firstDay.getDay() };
  }, [currentYear, currentMonth]);

  const isSameDay = (a: Date | undefined, b: Date) =>
    !!a &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isPast = (date: Date) => {
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return d < t;
  };

  const isDisabled = (date: Date) => {
    return date.getDay() === 0 || isPast(date); // domingo ou passado
  };

  const handlePrevMonth = () => {
    const d = new Date(currentYear, currentMonth - 1, 1);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
  };

  const handleNextMonth = () => {
    const d = new Date(currentYear, currentMonth + 1, 1);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
  };

  const handleSelect = (date: Date) => {
    if (isDisabled(date)) return;
    onSelect?.(date);
  };

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString(
    "pt-BR",
    { month: "long", year: "numeric" }
  );

  return (
    <div
      className={`
        w-full max-w-sm mx-auto
        p-4
        bg-[#0A0A0A] text-white
        rounded-3xl shadow-xl border border-[#1F1F1F]
        flex flex-col
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="px-2 py-1 rounded-md border border-[#2A2A2A] text-xs text-zinc-200 hover:bg-[#1F1F1F]"
        >
          {"<"}
        </button>
        <h2 className="text-sm sm:text-base font-semibold capitalize text-zinc-50">
          {monthLabel}
        </h2>
        <button
          type="button"
          onClick={handleNextMonth}
          className="px-2 py-1 rounded-md border border-[#2A2A2A] text-xs text-zinc-200 hover:bg-[#1F1F1F]"
        >
          {">"}
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1 text-[0.65rem] sm:text-[0.7rem] font-semibold text-[#C9A961] text-center">
        {WEEK_DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm">
        {Array.from({ length: firstWeekday }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {days.map((day) => {
          const disabled = isDisabled(day);
          const selectedDay = isSameDay(selected, day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleSelect(day)}
              disabled={disabled}
              className={[
                "h-9 w-9 sm:h-10 sm:w-10 mx-auto flex items-center justify-center rounded-full transition",
                disabled
                  ? "text-zinc-500 cursor-not-allowed"
                  : "text-zinc-100 hover:bg-[#222] cursor-pointer",
                selectedDay &&
                  "bg-[#C9A961] text-black font-semibold hover:bg-[#b8934f]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
