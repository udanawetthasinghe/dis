// src/slices/userGraphsApiSlice.js
import { apiSlice } from './apiSlice';
import { USERGRAPHS_URL } from '../constants'; 
// Suppose USERGRAPHS_URL = '/api/usergraphs'

export const userGraphsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserGraphs: builder.query({
      query: () => ({
        url: USERGRAPHS_URL,
        method: 'GET',
      }),
      providesTags: ['UserGraphs'],
    }),
    getUserGraphById: builder.query({
      query: (id) => ({
        url: `${USERGRAPHS_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'UserGraphs', id }],
    }),
    createUserGraph: builder.mutation({
      query: (data) => ({
        url: USERGRAPHS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UserGraphs'],
    }),
    updateUserGraph: builder.mutation({
      query: (data) => ({
        url: `${USERGRAPHS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'UserGraphs', id }],
    }),
    deleteUserGraph: builder.mutation({
      query: (id) => ({
        url: `${USERGRAPHS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserGraphs'],
    }),
  }),
});

export const {
  useGetUserGraphsQuery,
  useGetUserGraphByIdQuery,
  useCreateUserGraphMutation,
  useUpdateUserGraphMutation,
  useDeleteUserGraphMutation,
} = userGraphsApiSlice;
