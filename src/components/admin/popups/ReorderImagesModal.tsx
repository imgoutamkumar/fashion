/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { closestCenter, DndContext } from "@dnd-kit/core"
import { useReorderProductImagesMutation } from "@/redux/services/productApi"

type ImageType = {
  id: string
  url: string
}

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
  images: ImageType[]
  productId: string
}

export default function ReorderImagesModal({
  open,
  setOpen,
  images,
  productId,
}: Props) {
  const [ reorderProductImages,{isLoading}] = useReorderProductImagesMutation()
  const [items, setItems] = useState<ImageType[]>([])

  useEffect(() => {
    setItems(images)
  }, [images])
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id)
      const newIndex = prev.findIndex((i) => i.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  // ⭐ hit reorder api
  const handleSave = async () => {
  console.log("items",items)
    const images = items.map((img, index) => ({
      id: img.id,
      sort_order: index + 1,
    }))
      console.log("images",images)
    const payload = {
      product_id: productId,
      images : images,
    }

    await reorderProductImages(payload)

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reorder Images</DialogTitle>
        </DialogHeader>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {items.map((img) => (
                <SortableImage key={img.id} image={img} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Button onClick={handleSave} className="w-full mt-6 cursor-pointer" disabled={isLoading}>
          Save Order
        </Button>
      </DialogContent>
    </Dialog>
  )
}


const SortableImage = ({ image }: { image: ImageType }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <img
        src={image.url}
        className="w-24 h-24 object-cover rounded-lg border"
      />
    </div>
  )
}