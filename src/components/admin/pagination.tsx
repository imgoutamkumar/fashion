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
import { Field, FieldLabel } from "../ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getPaginationRange } from "@/helper/commonFunction"

type PaginationProps = {
    page: number
    limit: number
    total: number | 0
    setPage: (page: number) => void
    setLimit: (limit: number) => void
}

const ProductPagination = ({
    page,
    limit,
    total,
    setPage,
    setLimit,
}: PaginationProps) => {
    const totalPages = Math.ceil(total / limit)
    const paginationRange = getPaginationRange(page, totalPages)

    return (
        <Pagination>
            <PaginationContent className="w-full flex items-center">
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
                <span className="flex-1"></span>
                <Field orientation="horizontal" className="w-fit">
                    <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
                    <Select value={String(limit)} defaultValue="10" onValueChange={(value) => {
                        setLimit(Number(value))
                        setPage(1)
                    }}>
                        <SelectTrigger className="w-20" id="select-rows-per-page">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start">
                            <SelectGroup>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                <PaginationItem>
                    <PaginationPrevious onClick={() => page > 1 && setPage(page - 1)} aria-disabled={page === 1} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext onClick={() => page < totalPages && setPage(page + 1)} aria-disabled={page === totalPages} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default ProductPagination