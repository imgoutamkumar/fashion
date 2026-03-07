"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type Tree = {
  ID: string
  Name: string
  ParentID: string | null
  children?: Tree[]
}

// 1. Update our state to track BOTH the hovered node AND which direction it should open
type ActivePathItem = {
  node: Tree
  direction: "left" | "right"
}

type Props = {
  tree: Tree[]
  title?: string
  label: string
  onChange: (val: string) => void
}

export const MultiLevelSelect = ({ tree, title, label, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  const [activePath, setActivePath] = useState<ActivePathItem[]>([])
  const [selectedName, setSelectedName] = useState<string | null>(null)

  // 2. Add the MouseEvent so we can calculate screen space on hover
  const handleHover = (e: React.MouseEvent<HTMLDivElement>, node: Tree, level: number) => {
    // Get the exact pixel position of the item we just hovered over
    const rect = e.currentTarget.getBoundingClientRect()
    const subMenuWidth = 200 // This matches our hardcoded w-[200px]
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1000

    let direction: "left" | "right" = "right"

    // Check what direction the parent opened in (so we keep moving the same way if possible)
    const previousDirection = level > 0 ? activePath[level - 1]?.direction : "right"

    if (previousDirection === "left") {
      // Keep going left unless we hit the left edge of the monitor
      if (rect.left - subMenuWidth > 0) {
        direction = "left"
      }
    } else {
      // Move right, BUT if we are about to go off the right edge of the monitor, FLIP to the left!
      if (rect.right + subMenuWidth > windowWidth) {
        direction = "left"
      }
    }

    // Save the node and its calculated direction
    const newPath = [...activePath.slice(0, level), { node, direction }]
    setActivePath(newPath)
  }

  const handleSelect = (node: Tree) => {
    if (!node.children || node.children.length === 0) {
      onChange(node.ID)
      setSelectedName(node.Name)
      setOpen(false)
      setActivePath([])
    }
  }

  const renderMenuLevel = (items: Tree[], level: number) => {
    if (!items || items.length === 0) return null

    // 3. Grab the direction we calculated during the hover event
    const parentDirection = level > 0 ? activePath[level - 1]?.direction : "right"

    return (
      <div 
        className={
          level === 0 
            ? "w-[200px] py-1" 
            : `absolute top-[-5px] w-[200px] bg-popover border text-popover-foreground shadow-md rounded-md py-1 z-50 ${
                parentDirection === "left" ? "right-[98%]" : "left-[98%]" // <-- Flips sides here!
              }`
        }
      >
        {items.map((item) => {
          // Check if this specific item is the one currently hovered
          const isHovered = activePath[level]?.node.ID === item.ID

          return (
            <div
              key={item.ID}
              onMouseEnter={(e) => handleHover(e, item, level)} // Pass the event 'e'
              onClick={(e) => {
                e.stopPropagation() 
                handleSelect(item)
              }}
              className={`
                relative px-3 py-2 cursor-pointer text-sm flex justify-between items-center
                hover:bg-muted
                ${isHovered ? "bg-muted font-medium" : ""}
              `}
            >
              {item.Name}
              
              {/* Point the arrow in the correct direction based on where the menu will open */}
              {item.children && item.children.length > 0 && (
                <span className="text-slate-400">
                  {isHovered && activePath[level]?.direction === "left" ? "‹" : "›"}
                </span>
              )}

              {isHovered && item.children && renderMenuLevel(item.children, level + 1)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Label className="mb-2">{label}</Label>
      
      <Popover 
        open={open} 
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) setActivePath([]) 
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectedName ? selectedName : (title ? title : "Select Category")}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-max overflow-visible border-none bg-transparent shadow-none" align="start">
          <div className="bg-popover border text-popover-foreground shadow-md rounded-md">
            {renderMenuLevel(tree, 0)}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}