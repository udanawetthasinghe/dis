// src/slices/feedbackApiSlice.js
import { apiSlice } from './apiSlice'; // base API slice

export const feedbackApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


        // New endpoint: Get all feedback records (for admin use)
        getAllFeedback: builder.query({
          query: () => '/api/feedback',
          providesTags: ['Feedback'],
        }),


    createFeedback: builder.mutation({
      query: (formData) => ({
        url: '/api/feedback',
        method: 'POST',
        body: formData,
      }),
    }),



    // New endpoint: Fetch feedback submissions for a given week
    getFeedbackByWeek: builder.query({
      query: (week) => `/api/feedback/week?week=${week}`,
      providesTags: ['Feedback'],
    }),



    deleteFeedback: builder.mutation({
      query: (id) => ({
        url: `/api/feedback/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Feedback'],
    }),

  }),

});

export const {
  useCreateFeedbackMutation,
  useGetFeedbackByWeekQuery,
  useGetAllFeedbackQuery,
  useDeleteFeedbackMutation,
} = feedbackApiSlice;
