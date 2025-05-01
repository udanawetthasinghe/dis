import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "", // URL managed by proxy setting or manually set
  credentials: "include", // for cookie/session-based auth
}); 

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['DengueData', 'User', 'Graphs', 'UserGraphs', 'Feedback'],
  endpoints: (builder) => ({}),// extended by individual modules
});
