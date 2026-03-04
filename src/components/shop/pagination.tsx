/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { getPaginationRange } from "@/helper/commonFunction"

type PaginationProps = {
    page: number
    limit: number
    total: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
}

const ProductShopPagination = ({
    page,
    limit,
    total,
    setPage,
}: PaginationProps) => {
    const totalPages = Math.ceil(total / limit)
    const paginationRange = getPaginationRange(page, totalPages)

    return (
        <Pagination>
            <PaginationContent className="w-full flex items-center justify-center">
                <PaginationItem>
                    <PaginationPrevious onClick={() => page > 1 && setPage(page - 1)} aria-disabled={page === 1} />
                </PaginationItem>
                {/* Page Numbers */}
                {paginationRange.map((item, index) => {
                    if (item === "dots") {
                        return (
                            <PaginationItem key={`dots-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={item}>
                            <PaginationLink
                                href="#"
                                isActive={item === page}
                                onClick={() => setPage(item)}
                            >
                                {item}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext onClick={() => page < totalPages && setPage(page + 1)} aria-disabled={page === totalPages} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default ProductShopPagination