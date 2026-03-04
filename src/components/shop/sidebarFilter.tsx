/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { useForm } from 'react-hook-form';

const brands = [
  "Roadster",
  "H&M",
  "Zara",
  "Puma",
  "Nike",
  "Adidas",
  "Levi's",
  "U.S. Polo Assn.",
  "Allen Solly",
  "Peter England",
  "Van Heusen",
  "Wrangler",
  "Jack & Jones",
  "Louis Philippe",
  "Tommy Hilfiger",
  "Calvin Klein",
  "Mufti",
  "Spykar",
  "Flying Machine",
  "Wrogn"
];

const discountRanges = [
  {
    title: "10% and above",
    value: 10,
  },
  {
    title: "20% and above",
    value: 20,
  },
  {
    title: "30% and above",
    value: 30,
  },
  {
    title: "40% and above",
    value: 40,
  },
  {
    title: "50% and above",
    value: 50,
  },
  {
    title: "60% and above",
    value: 60,
  },
  {
    title: "70% and above",
    value: 70,
  },
  {
    title: "80% and above",
    value: 80,
  },
]

const SidebarFilter = ({ filters, setFilters }:any) => {

    const form = useForm({
    defaultValues: filters
  })

  const onFilterApply = (data:any)=>{
    console.log("filters applied", data)
    setFilters((prev:any)=>({...prev,...data}))
  }
  
  return (
   <form onChange={form.handleSubmit(onFilterApply)}>
      <Sidebar>
        <SidebarHeader>
          <Label className="font-bold text-lg text-black">Filters</Label>
        </SidebarHeader>
        <SidebarContent className="sidebar-scrollbar pr-2">
          <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-sm text-gray-600">Brands</SidebarGroupLabel>
            <SidebarGroupContent className="p-2">
              <FieldGroup className="mx-auto w-56 flex flex-col gap-2 max-h-60 overflow-y-auto thin-scrollbar pr-2">
                {brands?.map((brand, i) =>
                  <div key={i} className="flex items-center gap-2">
                    <Checkbox
                     className="cursor-pointer"
                      id={`brand-${i}`} 
                      checked={form.watch("brands")?.includes(brand)}
                      onCheckedChange={(checked:boolean)=>{
                      const prev = form.getValues("brands") || []

                      if(checked){
                        form.setValue("brands",[...prev,brand])
                      }else{
                        form.setValue("brands", prev.filter((b:string)=>b!==brand))
                      }

                      form.handleSubmit(onFilterApply)()
                    }}
                      />
                    <label
                      htmlFor={`brand-${i}`}
                      className="text-sm font-medium cursor-pointer hover:text-primary"
                    >
                      {brand}
                    </label>

                  </div>
                )}

              </FieldGroup>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-sm text-gray-600">Price</SidebarGroupLabel>
            <SidebarGroupContent className="p-2">
              <Slider
                defaultValue={filters.price || [0,5000]}
                max={5000}
                step={100}
                 onValueChange={(val:any)=>{
                  form.setValue("price", val)
                  form.handleSubmit(onFilterApply)()
                }}
                className="mx-auto w-full max-w-xs cursor-pointer"
              />
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-sm text-gray-600">Discount range</SidebarGroupLabel>
            <SidebarGroupContent className="p-2">
              <RadioGroup defaultValue="comfortable" className="w-fit"
               onValueChange={(val)=>{
                  form.setValue("discount", Number(val))
                  form.handleSubmit(onFilterApply)()
                }}
              >
                {discountRanges?.map((discountRange) =>
                  <div key={discountRange.value} className="flex items-center gap-3">
                    <RadioGroupItem className="cursor-pointer" value={discountRange.value.toString()} id="r3" />
                    <Label htmlFor="r3">{discountRange?.title}</Label>
                  </div>
                )}

              </RadioGroup>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      </form>
  )
}

export default SidebarFilter
