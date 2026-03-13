/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
} from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Heart } from "lucide-react";
import { useState } from "react";

type Props = {
  product: any;
  handleCardClick?: () => void;
};

const ProductCard = ({ product, handleCardClick }: Props) => {
  const [liked, setLiked] = useState(false)
  const discountedPrice =
    (product?.variants[0]?.original_price -
      (product?.variants[0]?.original_price * product?.variants[0]?.discount_percent) / 100).toFixed(2);
  return (
    <Card className="group relative w-64 sm:w-60 p-0 h-[320px] rounded-sm overflow-hidden cursor-pointer transition"    onClick={() => handleCardClick()}>
      {/* <div className="absolute inset-0 z-30 aspect-video bg-black/35" /> */}
      <img
        src={product?.variants[0]?.images[0]?.url}
        alt={product?.variants[0]?.sku}
        className="relative w-full h-full object-cover rounded-sm 
  transition-transform duration-300 group-hover:scale-105"
      />
      <div className="box-border absolute z-30 bottom-0 w-full px-3 py-3 flex flex-col justify-around 
bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-b-sm">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white">{product?.brand?.name}</h3>
            <h4 className="font-semibold text-white opacity-60 line-clamp-1">{product?.name}</h4>
            <p className="line-clamp-1 text-sm text-white opacity-60">{product?.short_description}</p>
          </div>

        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-red-600 line-through text-[13px]"> ₹{product?.variants[0]?.original_price}</p>
            <h3 className="text-white font-bold text-[1rem]">
              ₹{discountedPrice}
            </h3>
          </div>
          <div className="flex items-end">
            <Badge className="text-red-500 h-fit" variant="secondary">{product?.variants[0]?.discount_percent}% OFF</Badge>
          </div>

        </div>
      </div>
      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setLiked(!liked)
        }}
        className="absolute top-2 right-2 cursor-pointer rounded-full p-2 bg-white/80 backdrop-blur
      hover:scale-110 active:scale-90 transition-all duration-200"
      >
        <Heart
          className={`transition-all duration-300 ${liked
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-700"
            }`}
        />
      </Button>
    </Card>
  )
}

export default ProductCard

