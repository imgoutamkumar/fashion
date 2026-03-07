"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type Category = {
  ID: string
  Name: string
  ParentID: string | null
  children?: Category[]
}

type Props = {
  tree: any
  title?: string
  onChange: (val: string) => void
}

export const MultiLevelSelect = ({ tree, title, onChange }: Props) => {
  const [open, setOpen] = useState(false)

  // stores hovered path
  const [activePath, setActivePath] = useState<Category[]>([])

  const handleHover = (node: Category, level: number) => {
    const newPath = [...activePath.slice(0, level), node]
    setActivePath(newPath)
  }

  const handleSelect = (node: Category) => {
    if (!node.children || node.children.length === 0) {
      onChange(node.ID)
      setOpen(false)
      setActivePath([])
    }
  }

  const getColumnData = (level: number) => {
    if (level === 0) return tree
    return activePath[level - 1]?.children || []
  }

  return (
    <>
      <div className="flex flex-col">
        <Label className="mb-2">Category</Label>
        <Popover open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen)       // 1. Actually open or close the popover
          if (!isOpen) {
            setActivePath([])   // 2. Reset the nested list when closing
          }
        }}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {title ? title : "Select "}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0 flex gap-2 w-max shadow-md" align="start">
            {[0, 1, 2].map((level) => {
              const items = getColumnData(level)

              if (!items.length) return null

              return (
                <div key={level} className="min-w-[180px] border-r last:border-none " >
                  {items.map((item) => (
                    <div
                      key={item.ID}
                      onMouseEnter={() => handleHover(item, level)}
                      onClick={() => handleSelect(item)}
                      className={`
                    px-3 py-2 cursor-pointer text-sm
                    hover:bg-muted
                    ${activePath[level]?.ID === item.ID ? "bg-muted" : ""}
                  `}
                    >
                      {item.Name}
                      {item.children?.length ? " →" : ""}
                    </div>
                  ))}
                </div>
              )
            })}
          </PopoverContent>
        </Popover>
      </div>

    </>
  )
}