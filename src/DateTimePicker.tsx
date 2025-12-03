import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

export function DateTimePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex justify-center p-6">
      <div
        className="
          rounded-xl 
          border 
          bg-white 
          shadow-lg 
          p-4 
          w-[350px] 
          dark:bg-neutral-900 
          dark:border-neutral-700
        "
      >
        <h2 className="text-lg font-semibold mb-3 text-center">
          Selecione uma data
        </h2>

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="
            rounded-lg 
            border 
            bg-neutral-50
            dark:bg-neutral-800
            dark:border-neutral-700
            p-2
          "
        />
      </div>
    </div>
  )
}
