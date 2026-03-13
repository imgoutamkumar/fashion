/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductPagination from "@/components/admin/pagination";
import ReorderImagesModal from "@/components/admin/popups/ReorderImagesModal";
import ProductTable from "@/components/admin/productTable"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetAllProductsForAdminQuery, useGetProductsQuery } from "@/redux/services/productApi";
import { ChevronDown, ChevronRight, CirclePlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
    const [selectedImages, setSelectedImages] = useState<any[]>([])
    const [selectedProductId, setSelectedProductId] = useState<string>("")
    const navigate = useNavigate();
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(25)
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState({
        brands: [],
        price: [0, 5000],
        discount: 0
    })
    const { data, isLoading, isFetching } = useGetAllProductsForAdminQuery({
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
    const columns = [
        {
            id: "expander",
            header: "",
            cell: ({ row }: any) => (
                row.getCanExpand() ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={row.getToggleExpandedHandler()}
                    >
                        {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </Button>
                ) : null
            )
        },
        {
            accessorKey: "id",
            header: "Product ID",
        },
        {
            accessorKey: "name",
            header: "Product Name",
        },
        // {
        //     accessorKey: "images",
        //     header: "Product Images",
        //     cell: ({ row }: any) => {
        //         const images = row.original.images
        //         const productId = row.original.id
        //         return (
        //             <AvatarGroup
        //             className="cursor-pointer"
        //              onClick={() => {
        //                 setIsImageDialogOpen(true)
        //                 setSelectedImages(images)
        //                 setSelectedProductId(productId)
        //                 setIsImageDialogOpen(true)
        //             }}>
        //                 {images.slice(0, 3).map((img: any, i: number) => (
        //                     <Avatar key={i}>
        //                         <AvatarImage src={img?.url} />
        //                         <AvatarFallback>P</AvatarFallback>
        //                     </Avatar>
        //                 ))}

        //                 {images.length > 3 && (
        //                     <AvatarGroupCount>
        //                         +{images.length - 3}
        //                     </AvatarGroupCount>
        //                 )}
        //             </AvatarGroup>
        //         )
        //     },
        // },
        {
            accessorKey: "brand.name",
            header: "Brand Name",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "base_price",
            header: "Base Price",
        },
    ];

    return (
        <div className="w-full p-4">
            <div className="flex flex-col w-full">
                <Button className="w-fit mb-4 cursor-pointer" onClick={() => navigate('/admin/product/new')}> <CirclePlus className="mr-2" />Add New Product</Button>
                {/* producttable */}
                <ProductTable columns={columns} data={products} isFetching={isFetching} />
                {/* <ReorderImagesModal
                    open={isImageDialogOpen}
                    setOpen={setIsImageDialogOpen}
                    images={selectedImages}
                    productId={selectedProductId}
                /> */}
                <div className="mt-4">
                    <ProductPagination page={page}
                        limit={limit}
                        total={data?.total || 0}
                        setPage={setPage}
                        setLimit={setLimit} />
                </div>
            </div>

        </div>
    )
}

export default Products
