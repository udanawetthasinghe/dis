import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "", // proxy in package.json or specify full URL
  credentials: "include", // if you need cookies
}); // we get proxy for get server url

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['DengueData', 'User', 'Graphs', 'UserGraphs'],
  endpoints: (builder) => ({}),
});
