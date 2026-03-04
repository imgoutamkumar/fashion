/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type ApiResponse<T = unknown> = {
  data: T
  status: string
  message: string
}

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    tagTypes: ['Category'],
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
        createCategory: builder.mutation<ApiResponse, { name: string}>({
            query: (credentials) => ({
                url: '/products/categories',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Category'],
        }),
        getCategories: builder.query<void, void>({
            query: () => ({
                url: '/products/categories',
                method: 'GET',
            }),
            providesTags: ['Category'],
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/products/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
        
    }),
})

export const { useCreateCategoryMutation, useGetCategoriesQuery, useDeleteCategoryMutation } = categoryApi