/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type ApiResponse<T = any> = {
    data: T
    status: string
    message: string
}

export const attributeApi = createApi({
    reducerPath: 'attributeApi',
    tagTypes: ['Attribute'],
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
        createAttribute: builder.mutation<ApiResponse, { name: string }>({
            query: (credentials) => ({
                url: '/products/attribute',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Attribute'],
        }),
        getAttributes: builder.query<ApiResponse, void>({
            query: () => ({
                url: '/products/attribute/all',
                method: 'GET',
            }),
            providesTags: ['Attribute'],
        }),
        getAttributeValueById: builder.query<ApiResponse, string>({
            query: (attributeId) => ({ url: `/products/attribute-value/${attributeId}`, method: 'GET' }),
        }),
        deleteAttribute: builder.mutation<void, string>({
            query: (id) => ({
                url: `/products/attribute/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Attribute'],
        }),

    }),
})

export const { useCreateAttributeMutation, useGetAttributesQuery, useDeleteAttributeMutation, useGetAttributeValueByIdQuery,
    useLazyGetAttributeValueByIdQuery } = attributeApi