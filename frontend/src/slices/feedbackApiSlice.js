// src/slices/feedbackApiSlice.js
import { apiSlice } from './apiSlice'; // your base API slice

export const feedbackApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFeedback: builder.mutation({
      query: (formData) => ({
        url: '/api/feedback',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useCreateFeedbackMutation } = feedbackApiSlice;
