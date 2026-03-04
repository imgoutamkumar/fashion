/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type ApiResponse<T = unknown> = {
  data: T
  status: string
  message: string
}

export const brandApi = createApi({
    reducerPath: 'brandApi',
    tagTypes: ['Brand'],
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
        createBrand: builder.mutation<ApiResponse, { name: string}>({
            query: (credentials) => ({
                url: '/products/brands',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Brand'],
        }),
        getBrands: builder.query<any, void>({
            query: () => ({
                url: '/products/brand/all',
                method: 'GET',
            }),
            providesTags: ['Brand'],
        }),
        deleteBrand: builder.mutation<void, string>({
            query: (id) => ({
                url: `/products/brands/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Brand'],
        }),
        
    }),
})

export const { useCreateBrandMutation, useGetBrandsQuery, useDeleteBrandMutation } = brandApi