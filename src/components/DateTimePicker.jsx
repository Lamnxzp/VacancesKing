"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DateTimePicker({ value, onChange }) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState(value ? new Date(value) : null)
  const [time, setTime] = React.useState(
    value ? new Date(value).toTimeString().slice(0, 8) : "10:00:00"
  )

  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value)
      setDate(newDate)
      setTime(newDate.toTimeString().slice(0, 8))
    }
  }, [value])

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate)
    if (selectedDate && onChange) {
      const [hours, minutes, seconds] = time.split(":").map(Number)
      const newDateTime = new Date(selectedDate)
      newDateTime.setHours(hours, minutes, seconds)
      onChange(newDateTime.toISOString())
      setOpen(false)
    }
  }

  const handleTimeChange = (e) => {
    setTime(e.target.value)
  }

  const handleTimeBlur = () => {
    if (date && onChange) {
      const [hours, minutes, seconds] = time.split(":").map(Number)
      if (
        !isNaN(hours) &&
        !isNaN(minutes) &&
        !isNaN(seconds)
      ) {
        const newDateTime = new Date(date)
        newDateTime.setHours(hours, minutes, seconds)
        onChange(newDateTime.toISOString())
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-4">
      {/* Date Picker */}
      <div className="flex flex-col gap-3 w-full sm:w-auto">
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
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="flex flex-col gap-3 w-full sm:w-auto">
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={handleTimeChange}
          onBlur={handleTimeBlur}
          className="bg-input text-foreground border-border focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
      </div>
    </div>
  )
}
