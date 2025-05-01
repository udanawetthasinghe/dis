// src/slices/graphsApiSlice.js
import { apiSlice } from './apiSlice';
import { GRAPHS_URL } from '../constants';


// Sample GRAPHS_URL = '/api/graphs'

export const graphsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGraphs: builder.query({
      query: () => ({
        url: GRAPHS_URL,
        method: 'GET',
      }),
      providesTags: ['Graphs'],
    }),
    getGraphById: builder.query({
      query: (id) => ({
        url: `${GRAPHS_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Graphs', id }],
    }),
    createGraph: builder.mutation({
      query: (data) => ({
        url: GRAPHS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Graphs'],
    }),
    updateGraph: builder.mutation({
      query: (data) => ({
        url: `${GRAPHS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Graphs', id }],
    }),
    deleteGraph: builder.mutation({
      query: (id) => ({
        url: `${GRAPHS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Graphs'],
    }),
  }),
});

export const {
  useGetGraphsQuery,
  useGetGraphByIdQuery,
  useCreateGraphMutation,
  useUpdateGraphMutation,
  useDeleteGraphMutation,
} = graphsApiSlice;
