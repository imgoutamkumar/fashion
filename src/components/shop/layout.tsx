import { Outlet } from "react-router-dom";

const ShopLayout = () => {
  return (
    <div className="min-h-screen w-full">
      <Outlet />
    </div>
  )
}

export default ShopLayout
