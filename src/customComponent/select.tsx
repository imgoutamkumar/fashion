import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Control, FieldValues, Path } from "react-hook-form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"


interface CustomSelectProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: string
  pattern?: string
  numericMode?: "int" | "decimal"
  options?: { value: string; label: string }[],
  isLoading?: boolean
  onSelectValueChange?: (value: string) => void
}

export const CustomSelect = <T extends FieldValues>({ control, name, label, placeholder, options, isLoading, onSelectValueChange }: CustomSelectProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="mb-4 gap-0">
          <FormLabel className="mb-2">{label}</FormLabel>
          <FormControl>
            <Select {...field} value={field.value ?? ''}
              onValueChange={(value) => {
                field.onChange(value)
                onSelectValueChange?.(value)
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select</SelectLabel>
                  {options?.map((option) => {
                    return <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
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