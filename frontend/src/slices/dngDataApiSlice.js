// defines the API endpoints for product related actions
// Fetching data through Redux and Redux toolkit instead of axios
import { DNGDATA_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const dngDataApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({


    // Get request, dengue data
    getDngData: builder.query({
      query: () => ({
        url: DNGDATA_URL,
      }),
      providesTags: ['DengueData'],
    }),

  // Get request, dengue case data details
  getDngCaseDetails: builder.query({
    query: dngCaseId => ({
      url: `${DNGDATA_URL}/${dngCaseId}`,
    }),
    keepUnusedDataFor: 5,
    providesTags: ['DengueData'],
  }),

    // Create product, POST request
    createDngCases: builder.mutation({
      query: data => ({
        url: DNGDATA_URL,
        method: 'POST',
        body: data,

      }),
      invalidatesTags: ['DengueData'], // This will stop being cached so we have fresh data
      providesTags: ['DengueData'],
    }),

    // Update dengue cases
    updateDngCases: builder.mutation({
      query: data => ({
        url: `${DNGDATA_URL}/${data.dngCaseId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['DengueData'],
      providesTags: ['DengueData'],
    }),

        // Delete product
        deleteDngCases: builder.mutation({
          query: dngCaseId => ({
            url: `${DNGDATA_URL}/${dngCaseId}`,
            method: 'DELETE',
          }),
        }),

  
    }),

});

export const {
  useGetDngDataQuery,
  useGetDngCaseDetailsQuery,
  useUpdateDngCasesMutation,
  useCreateDngCasesMutation,
  useDeleteDngCasesMutation,
  
} = dngDataApiSlice;
