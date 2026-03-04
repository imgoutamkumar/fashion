import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Control, FieldValues, Path } from "react-hook-form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


interface CustomRadioButtonProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    placeholder?: string
    type?: string
    pattern?: string
    options?: { value: string; label: string, description?: string }[]
}

export const CustomRadioButton = <T extends FieldValues>({ control, name, label, options }: CustomRadioButtonProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className="mb-4 gap-0">
                    <FormLabel className="mb-2">{label}</FormLabel>
                    <FormControl>
                        <RadioGroup className="w-fit flex" value={field.value}
                            onValueChange={field.onChange}>
                            {options?.map((option) => {
                                return (
                                    <Field orientation="horizontal" key={option.value}>
                                        <RadioGroupItem value={option.value} id={`desc-r-${option.value}`} className="cursor-pointer" />
                                        <FieldContent>
                                            <FieldLabel>{option.label}</FieldLabel>
                                            {option?.description && <FieldDescription>
                                                {option?.description}
                                            </FieldDescription>}
                                        </FieldContent>
                                    </Field>
                                )
                            })}
                        </RadioGroup>
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