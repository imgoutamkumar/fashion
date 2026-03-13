/* eslint-disable @typescript-eslint/no-explicit-any */
// import { setToken } from '@/redux/authSlice'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type ApiResponse<T = any> = {
  data: T
  status: string
  message: string
}

type AuthResponse = ApiResponse<null> & {
  token: string
}

type LoginResponse = {
  status: string
  token: string
  message: string
  data: {
    role: string
    id: string
    email: string
  } | null
}

export const authApi = createApi({
    reducerPath: 'authApi',
    tagTypes: ['User'],
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
        register: builder.mutation<ApiResponse, { username: string; fullname: string, email: string; password: string }>({
            query: (credentials) => ({
                url: '/users/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        login: builder.mutation<LoginResponse, { email: string; password: string }>({
            query: (credentials) => ({
                url: '/users/login',
                method: 'POST',
                body: credentials,
            }),
            // async onQueryStarted(_, { dispatch, queryFulfilled }) {
            //     try {
            //         const { data } = await queryFulfilled
            //         console.log('Login data', data);
            //         dispatch(setToken(data.token))
            //     } catch (error) {
            //         console.error('Login failed:', error);
            //     }
            // },
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),
        getUser: builder.query<ApiResponse, string>({
            query: (id) => `/users/${id}`, 
            providesTags: ['User'],
        }),
    }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
} = authApi