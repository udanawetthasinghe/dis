// defines the API endpoints for product related actions
// Fetching data through Redux and Redux toolkit instead of axios
import { WEEKLYDNGDATA_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const WeeklyDngDataApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({


    // Get request, dengue data
    getWeeklyDngData: builder.query({
      query: () => ({
        url: WEEKLYDNGDATA_URL,
      }),
      providesTags: ['WeeklyDengueData'],
    }),

  // Get request, single weekly dengue case
  getWeeklyDngCaseDetails: builder.query({
    query: dngCaseId => ({
      url: `${WEEKLYDNGDATA_URL}/${dngCaseId}`,
    }),
    keepUnusedDataFor: 5,
    providesTags: ['WeeklyDengueData'],
  }),


    // Get request, year list of dengue data
    getYears: builder.query({
      query: () => ({
        url: `${WEEKLYDNGDATA_URL}/years`,
      }),
      providesTags: ['WeeklyDengueData'],
    }),

    // Get request, weekly data according to a year
    getWeeklyByYear: builder.query({
      query: year => ({
        url: `${WEEKLYDNGDATA_URL}/weekly?year=${year}`,
      }),
      providesTags: ['WeeklyDengueData'],
    }),

    // Add data, POST request
    createWeeklyDngCases: builder.mutation({
      query: data => ({
        url: WEEKLYDNGDATA_URL,
        method: 'POST',
        body: data,

      }),
      invalidatesTags: ['WeeklyDengueData'], // This will stop being cached so we have fresh data
      providesTags: ['WeeklyDengueData'],
    }),

    // Update dengue cases
    updateWeeklyDngCases: builder.mutation({
      query: data => ({
        url: `${WEEKLYDNGDATA_URL}/${data.dngCaseId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WeeklyDengueData'],
      providesTags: ['WeeklyDengueData'],
    }),

        // Delete product
        deleteWeeklyDngCases: builder.mutation({
          query: dngCaseId => ({
            url: `${WEEKLYDNGDATA_URL}/${dngCaseId}`,
            method: 'DELETE',
          }),
        }),

  
    }),

});

export const {
  useGetWeeklyDngDataQuery,
  useGetWeeklyDngCaseDetailsQuery,
  useUpdateWeeklyDngCasesMutation,
  useCreateWeeklyDngCasesMutation,
  useDeleteWeeklyDngCasesMutation,
  useGetYearsQuery,
  useGetWeeklyByYearQuery
} = WeeklyDngDataApiSlice;
