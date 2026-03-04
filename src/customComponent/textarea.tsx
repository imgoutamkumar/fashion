import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Control, FieldValues, Path } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"


interface CustomTextareaProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  id ?: string
  height?: string
}

export const CustomTextarea = <T extends FieldValues>({ control, name, label, placeholder, id,height}: CustomTextareaProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="mb-4 gap-0">
          <FormLabel className="mb-2">{label}</FormLabel>
          <FormControl>
             <Textarea id={id} placeholder={placeholder} {...field} style={{ height: height || "100px" }} />
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

