import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { Calendar } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";

interface CalendarDateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange;
  setDate?: (date: DateRange | undefined) => void;
}

export function CalendarDateRangePicker({
  className,
  date,
  setDate,
}: CalendarDateRangePickerProps) {
  const [localDate, setLocalDate] = React.useState<DateRange | undefined>(
    date || {
      from: new Date(2023, 0, 20),
      to: addDays(new Date(2023, 0, 20), 20),
    }
  );

  // 使用传入的日期和设置函数，如果没有则使用本地状态
  const currentDate = date || localDate;
  const handleDateChange = setDate || setLocalDate;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !currentDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {currentDate?.from ? (
              currentDate.to ? (
                <>
                  {format(currentDate.from, "yyyy-MM-dd")} -{" "}
                  {format(currentDate.to, "yyyy-MM-dd")}
                </>
              ) : (
                format(currentDate.from, "yyyy-MM-dd")
              )
            ) : (
              <span>选择日期范围</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={currentDate?.from}
            selected={currentDate}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
