import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Control, FieldValues, Path } from "react-hook-form"


interface CustomInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: string
  pattern?: string
  numericMode?: "int" | "decimal"
  max?: number
  min?: number
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault()
  }
}

const blockInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault()
  }
}

const sanitizeValue = (value: string, mode: "int" | "decimal") => {
  if (mode === "int") {
    return /^\d*$/.test(value)
  }
  return /^\d*\.?\d*$/.test(value)
}

export const CustomInput = <T extends FieldValues>({ control, name, label, placeholder, type = "text", pattern ,numericMode, max, min }: CustomInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="mb-4 gap-0">
          <FormLabel className="mb-2">{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} max={max} min={min} pattern={pattern} {...field} value={field.value ?? ''}
            inputMode={numericMode ? "decimal" : undefined}
              onKeyDown={numericMode ? blockInvalidKeys : undefined}
               onChange={(e) => {
                if (!numericMode) {
                  field.onChange(e)
                  return
                }

                const value = e.target.value
                if (sanitizeValue(value, numericMode)) {
                  field.onChange(value)
                }
              }} 
              />
          </FormControl>
          <div
            className={`transition-all duration-200 ease-out
              ${fieldState.error
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1"}
            `}
          >
            <FormMessage className="text-[11px]" />
          </div>
        </FormItem>
      )}
    />
  )
}