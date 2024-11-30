import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userLoggedIn } from '../authSlice';

const USER_API = "http://localhost:3000/api/user/"

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: 'include'
  }),
  endpoints: (builder) => ({
    signUpUser: builder.mutation({ // to post data to API
      query: (inputData) => ({
        url: "signup",
        method: "POST",
        body: inputData
      })
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }))
        } catch (error) {
          console.log("error from authAPI", error)
        }
      }
    })
  })
})

export const { useLoginUserMutation, useSignUpUserMutation } = authAPI;