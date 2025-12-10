"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";

type CalendarProps = {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  sticky?: boolean; // se true, o header fica fixo ao topo do container
  blockedDates?: string[]; // array de 'YYYY-MM-DD' que devem aparecer desabilitadas
};

const WEEK_DAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  className = "",
  sticky = false,
  blockedDates,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const dayButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
    const dateKey = date.toISOString().slice(0, 10);
    if (blockedDates && blockedDates.includes(dateKey)) return true;
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

  // utilities: go to today, add days and focus/select helper
  const goToToday = () => {
    const d = new Date();
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    onSelect?.(d);
    setTimeout(() => {
      const el = document.getElementById(`day-${d.toISOString()}`) as HTMLElement | null;
      el?.focus();
    }, 0);
  };

  const addDays = (date: Date, daysToAdd: number) => {
    const nd = new Date(date);
    nd.setDate(nd.getDate() + daysToAdd);
    return nd;
  };

  const focusOrSelectDate = (d: Date) => {
    if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) {
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
      setTimeout(() => {
        const el = document.getElementById(`day-${d.toISOString()}`) as HTMLElement | null;
        el?.focus();
      }, 0);
    }
    onSelect?.(d);
  };

  // Touch (swipe) handling for mobile
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = null;
    };
    const onTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      if (touchStartX.current == null || touchEndX.current == null) return;
      const dx = touchStartX.current - touchEndX.current;
      const threshold = 40; // swipe mínimo em px
      if (dx > threshold) {
        handleNextMonth();
      } else if (dx < -threshold) {
        handlePrevMonth();
      }
      touchStartX.current = null;
      touchEndX.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart as EventListener);
      el.removeEventListener("touchmove", onTouchMove as EventListener);
      el.removeEventListener("touchend", onTouchEnd as EventListener);
    };
  }, [currentMonth, currentYear]);

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
      ref={containerRef}
      className={`
        w-full
        mx-auto
        p-2 sm:p-3
        bg-[#0A0A0A] text-white
        rounded-xl shadow-md border border-[#1F1F1F]
        flex flex-col
        max-w-full sm:max-w-sm md:max-w-md lg:max-w-md
        ${className}
      `}
    >
      <div
        className={`flex items-center justify-between mb-2 ${
          sticky ? "sticky top-0 z-20 bg-[#0A0A0A] pt-2 -mx-3 px-3" : ""
        }`}
        style={sticky ? { WebkitBackdropFilter: "blur(4px)" } : undefined}
      >
        <button
          type="button"
          onClick={handlePrevMonth}
          aria-label="Mês anterior"
          className="p-1.5 sm:p-2 rounded-md border border-[#2A2A2A] text-sm text-zinc-200 hover:bg-[#1F1F1F] touch-manipulation"
        >
          {"‹"}
        </button>
        <h2 className="text-sm sm:text-base font-semibold capitalize text-zinc-50">
          {monthLabel}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="text-xs px-2 py-1 rounded-md border border-[#2A2A2A] text-zinc-200 hover:bg-[#1F1F1F]"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Próximo mês"
            className="p-1.5 sm:p-2 rounded-md border border-[#2A2A2A] text-sm text-zinc-200 hover:bg-[#1F1F1F] touch-manipulation"
          >
            {"›"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div className="grid grid-cols-7 gap-1 mb-2 text-[0.62rem] sm:text-[0.7rem] font-semibold text-[#C9A961] text-center min-w-max">
          {WEEK_DAYS.map((d) => (
            <span key={d} className="py-1">
              {d}
            </span>
          ))}
        </div>

        {/* área com rolagem vertical para os dias (barra de rolagem dentro do componente) */}
        <div
          className="h-[200px] sm:h-[280px] overflow-y-auto -mx-1 px-1 vb-days-scroll"
        >
          <div className="grid grid-cols-7 gap-1 text-[0.72rem] sm:text-[0.8rem]" role="grid" aria-label={`Calendário ${monthLabel}`}>
            {Array.from({ length: firstWeekday }).map((_, index) => (
              <div key={`empty-${index}`} role="presentation" />
            ))}

            {days.map((day) => {
              const disabled = isDisabled(day);
              const dateKey = day.toISOString().slice(0, 10);
              const fullyBlocked = blockedDates ? blockedDates.includes(dateKey) : false;
              const selectedDay = isSameDay(selected, day);
              const iso = day.toISOString();

              return (
                <button
                  key={iso}
                  id={`day-${iso}`}
                  ref={(el) => (dayButtonRefs.current[iso] = el)}
                  type="button"
                  onClick={() => handleSelect(day)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(day);
                      return;
                    }
                    let target: Date | null = null;
                    if (e.key === "ArrowLeft") target = addDays(day, -1);
                    else if (e.key === "ArrowRight") target = addDays(day, 1);
                    else if (e.key === "ArrowUp") target = addDays(day, -7);
                    else if (e.key === "ArrowDown") target = addDays(day, 7);
                    else if (e.key === "PageUp") target = new Date(currentYear, currentMonth - 1, day.getDate());
                    else if (e.key === "PageDown") target = new Date(currentYear, currentMonth + 1, day.getDate());

                    if (target) {
                      e.preventDefault();
                      if (isDisabled(target)) {
                        let attempts = 0;
                        const dir = (target.getTime() - day.getTime()) >= 0 ? 1 : -1;
                        let cand = target;
                        while (isDisabled(cand) && attempts < 14) {
                          cand = addDays(cand, dir);
                          attempts += 1;
                        }
                        if (!isDisabled(cand)) focusOrSelectDate(cand);
                      } else {
                        focusOrSelectDate(target);
                      }
                    }
                  }}
                  disabled={disabled}
                  role="gridcell"
                  aria-selected={selectedDay}
                  aria-disabled={disabled}
                  aria-label={day.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  tabIndex={disabled ? -1 : 0}
                  className={[
                    "h-9 w-9 sm:h-8 sm:w-8 mx-auto flex items-center justify-center rounded-md transition-none select-none",
                    disabled
                      ? "text-zinc-500 cursor-not-allowed bg-transparent"
                      : "text-zinc-100 hover:bg-[#222] active:scale-95",
                    selectedDay && "bg-[#C9A961] text-black font-semibold",
                    fullyBlocked && !selectedDay ? "opacity-60 line-through text-red-300" : "",
                  ].filter(Boolean).join(" ")}
                  style={{ touchAction: "manipulation" }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
