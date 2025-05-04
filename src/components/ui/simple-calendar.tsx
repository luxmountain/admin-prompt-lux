import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";

function getDaysInMonth(date: Date) {
  const days: Date[] = [];
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  for (let i = 1; i <= lastDay; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }
  return days;
}

interface SimpleCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  disableDate?: (date: Date) => boolean;
  month?: Date;
  setMonth?: (date: Date) => void;
}

export const SimpleCalendar: React.FC<SimpleCalendarProps> = ({
  value,
  onChange,
  disableDate,
  month,
  setMonth,
}) => {
  const currentMonth = month || new Date();
  const days = getDaysInMonth(currentMonth);

  const handlePrevMonth = () =>
    setMonth ? setMonth(subMonths(currentMonth, 1)) : null;
  const handleNextMonth = () =>
    setMonth ? setMonth(addMonths(currentMonth, 1)) : null;

  return (
    <div className="w-64 rounded bg-white">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevMonth}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium">{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={handleNextMonth}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="text-muted-foreground font-medium">
            {d}
          </div>
        ))}
        {days.map((day) => (
          <button
            key={day.toISOString()}
            className={`p-2 rounded ${
              value && isSameDay(day, value)
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            } ${
              disableDate?.(day)
                ? "text-gray-400 cursor-not-allowed opacity-50"
                : ""
            }`}
            onClick={() => !disableDate?.(day) && onChange?.(day)}
            disabled={disableDate?.(day)}
          >
            {day.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};
