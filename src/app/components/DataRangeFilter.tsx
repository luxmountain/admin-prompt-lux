import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SimpleCalendar } from "@/components/ui/simple-calendar";

interface DateRangeFilterProps {
  fromDate?: Date;
  toDate?: Date;
  onFromDateChange: (date?: Date) => void;
  onToDateChange: (date?: Date) => void;
}

export function DateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: DateRangeFilterProps) {
  const [calendarMonthFrom, setCalendarMonthFrom] = useState<Date>(fromDate ?? new Date());
  const [calendarMonthTo, setCalendarMonthTo] = useState<Date>(toDate ?? new Date());

  return (
    <div className="flex gap-4 items-center">
      <h3>Filter: </h3>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            From: {fromDate ? fromDate.toLocaleDateString("en-GB") : "Select"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <SimpleCalendar
            value={fromDate}
            onChange={(date) => {
              onFromDateChange(date);
              setCalendarMonthFrom(date ?? new Date());
            }}
            month={calendarMonthFrom}
            setMonth={setCalendarMonthFrom}
            disableDate={(date) => toDate !== undefined && date > toDate}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            To: {toDate ? toDate.toLocaleDateString("en-GB") : "Select"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <SimpleCalendar
            value={toDate}
            onChange={(date) => {
              onToDateChange(date);
              setCalendarMonthTo(date ?? new Date());
            }}
            month={calendarMonthTo}
            setMonth={setCalendarMonthTo}
            disableDate={(date) =>
              date > new Date() || (fromDate !== undefined && date < fromDate)
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
