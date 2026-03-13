/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Product = {
    id: string
    productname: string
    brandName: string
    category: string
    base_price: number
    number_of_stock: number
    discount_percent: number
    currency: string
    status: string
    is_returnable: boolean
    is_cod_available: boolean
    description: string
    short_description: string
    variants: []
    product_images: File[],
    attributes: any
}

type ApiResponse<T = any> = {
    data: T
    status: string
    message: string
}

export type PaginatedResponse<Product> = {
    data: Product[]
    total: number
    page?: number
    limit?: number
    status: string
    message: string
}

type GetProductsParams = {
    page: number
    limit: number
    searchTerm?: string
    brands: string[],
    discount: number,
    minPrice: number,
    maxPrice: number
}

export const productApi = createApi({
    reducerPath: 'productApi',
    tagTypes: ['Products'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://golang-fashion-backend.onrender.com',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: (builder) => ({
        getProducts: builder.query<PaginatedResponse<Product>, GetProductsParams>({
            query: (params) => {
                return { url: '/products/all', method: 'GET', params: params };
            },
            providesTags: (result: any) =>
                result?.data
                    ? [
                        { type: 'Products', id: 'LIST' },
                        ...result.data.map((product: any) => ({
                            type: 'Products',
                            id: product.id,
                        })),
                    ]
                    : [{ type: 'Products', id: 'LIST' }],
        }),
         getAllProductsForAdmin: builder.query<PaginatedResponse<Product>, GetProductsParams>({
            query: (params) => {
                return { url: '/products/allProducts', method: 'GET', params: params };
            },
            providesTags: (result: any) =>
                result?.data
                    ? [
                        { type: 'Products', id: 'LIST' },
                        ...result.data.map((product: any) => ({
                            type: 'Products',
                            id: product.id,
                        })),
                    ]
                    : [{ type: 'Products', id: 'LIST' }],
        }),
        getProductById: builder.query<ApiResponse, string>({
            query: (id) => ({ url: `/products/${id}`, method: 'GET' }),
            providesTags: (result, error, id) => [
                { type: 'Products', id },
            ],
        }),
        createProduct: builder.mutation<ApiResponse, FormData>({
            query: (formData) => ({
                url: '/products/create',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [{ type: 'Products', id: 'LIST' }],
        }),
        updateProduct: builder.mutation<ApiResponse, { id: string; name?: string; price?: number; description?: string }>({
            query: ({ id, ...updates }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Products', id },
            ],
        }),
        deleteProduct: builder.mutation<ApiResponse, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Products', id },
                { type: 'Products', id: 'LIST' },
            ],
        }),
        // filters metadata
        getFilters: builder.query({
            query: () => "/products/filters"
        }),
        reorderProductImages: builder.mutation<ApiResponse,
            {
                product_id: string
                images: { id: string; sort_order: number }[]
            }>({
            query: (body) => ({
                url: "/products/reorder-images",
                method: "PATCH",                   
                body: body,
            }),

            invalidatesTags: (result, error, { product_id }) => [
                { type: "Products", id: product_id },
                { type: "Products", id: "LIST" },
            ],
        }),

    }),
});

export const {
    useGetProductsQuery,
    useGetAllProductsForAdminQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetFiltersQuery,
    useReorderProductImagesMutation
} = productApi