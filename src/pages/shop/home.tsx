import CustomCarousel from "@/components/shop/CustomCarousel";
import FreeShippingPromoBanner from "@/components/shop/FreeShippingPromoBanner";

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      <CustomCarousel/>
      <FreeShippingPromoBanner/>
    </div>
  )
}

export default Home


