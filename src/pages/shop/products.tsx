import ProductShopPagination from "@/components/shop/pagination";
import ProductCard from "@/components/shop/productCard";
import SidebarFilter from "@/components/shop/sidebarFilter";

import { useGetProductsQuery } from "@/redux/services/productApi";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(25)

  const [filters, setFilters] = useState({
    brands: [],
    price: [0, 5000],
    discount: 0
  })

  const handleProductCardClick = (productId: string, variantId: string) => {
    console.log("handleProductCardClick clicked")
    if (productId && variantId) {
      navigate(`/shop/product/${productId}?v=${variantId}`)
    }
  }
  // memoize params so RTK Query doesn't refetch unnecessarily

  // const params = useMemo(
  //   () => ({ page, limit, search, category, status }),
  //   [page, limit, search, category, status]
  // );

  // fetch products

  const { data, isLoading, isFetching } = useGetProductsQuery({
    page,
    limit,
    searchTerm,
    brands: filters.brands,
    discount: filters.discount,
    minPrice: filters.price[0],
    maxPrice: filters.price[1]
  })

  if (!isLoading) {
    console.log(data)
  }
  const products = data?.data ?? []

  return (
    <div className="flex">
      {/* filter options */}
      <SidebarFilter filters={filters} setFilters={setFilters} />
      <div></div>
      {/* products grid */}
      <div className="flex flex-col min-h-screen justify-between gap-y-1 p-4">
        <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center sm:gap-6">
          {products.map((product: any) => {
            return <ProductCard key={product?.id} product={product} handleCardClick={() =>  handleProductCardClick(product?.id ,product?.variants[0]?.id)} />
          })}

        </div>
        <div className="py-6 px-2">
          <ProductShopPagination page={page}
            limit={limit}
            total={data?.total || 0}
            setPage={setPage}
            setLimit={setLimit} />
        </div>

      </div>

    </div>
  )
}

export default AllProducts
