import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


    // User login
    // @ POST api/users/auth
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`, //api/users/auth
        method: "POST",
        body: data,
      }),
    }),

    // logout user from server side
    // @ POST api/users/logout
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    // Register a user
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    // user profile UPDATE by user
    //@ PUT api/users/profile
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    ////***   get users list for admin   */ get users list for admin


  // Get user data by id
  //@ GET api/users/:id

  getUserData: builder.query({
    query: userId => ({
      url: `${USERS_URL}/${userId}`,
    }),
    providesTags: ["Users"], // to remove cache data
    keepUnusedDataFor: 5,
  }),

    // GET user by user state
    //@ GET api/users/:userState

    getUsersByState: builder.query({
      query: userState => ({
        url: `${USERS_URL}/by-state/${userState}`,
      }),
    }),

    // GET all users by Admin
    //@ GET api/users
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["Users"], // to remove cache data
      keepUnusedDataFor: 5,

    }),

    // user profile UPDATE by admin
    //@ PUT api/users/admin/update
    updateUserData: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      providesTags: ["Users"], // to remove cache data
      invalidatesTags: ["Users"],
    }),



    // Register a new user by admin
    //@route POST api/users
    registerUserByAdmin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/admin`,
        method: "POST",
        body: data,
      }),
    }),


    // Delete a users by Admin
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      providesTags: ["Users"], // to remove cache data
    }),
  }),
});

// Pass all methods

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,

  useGetUsersQuery,
  useGetUsersByStateQuery,
  useGetUserDataQuery,

  useUpdateUserDataMutation,

  useRegisterUserByAdminMutation,

  useDeleteUserMutation,
} = userApiSlice;
