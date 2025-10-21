import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/TimePicker/TimePicker.jsx";

export function DateTimePicker({
  value,
  onChange,
  label,
  startMonth,
  endMonth,
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(value ? new Date(value) : undefined);

  React.useEffect(() => {
    if (!value) {
      setDate(undefined);
    } else {
      setDate(new Date(value));
    }
  }, [value]);

  const handleDateChange = (selectedDate) => {
    if (!selectedDate) {
      setDate(undefined);
      if (onChange) {
        onChange(null);
      }
      setOpen(false);
      return;
    }

    // Preserve time from previous date if available
    const newDate = new Date(selectedDate);
    if (date) {
      newDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
    }
    setDate(newDate);
    if (onChange) {
      onChange(newDate.toISOString());
    }
    setOpen(false);
  };

  const handleTimeChange = (newDate) => {
    setDate(newDate);
    if (newDate && onChange) {
      onChange(newDate.toISOString());
    }
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
      {/* Date Picker */}
      <div className="flex flex-col w-full sm:w-auto">
        {label && (
          <label className="block text-white/60 text-sm mb-1">{label}</label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              type="button"
              className="w-full sm:w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "jj/mm/aaaa"}
              <ChevronDownIcon className="h-4 w-4 opacity-70" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateChange}
              startMonth={startMonth}
              endMonth={endMonth}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="flex flex-col gap-3 w-full sm:w-auto">
        <TimePicker date={date} setDate={handleTimeChange} />
      </div>
    </div>
  );
}
