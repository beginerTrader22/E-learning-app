import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const buildApi = createApi({
  reducerPath: 'buildApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/pc',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.user?.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Builds'],
  endpoints: (builder) => ({
    getBuilds: builder.query({
      query: () => '/builds',
      providesTags: ['Builds'],
    }),
    createBuild: builder.mutation({
      query: (data) => ({
        url: '/builds',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Builds'],
    }),
    deleteBuild: builder.mutation({
      query: (id) => ({
        url: `/builds/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Builds'],
    }),
    updateBuild: builder.mutation({
      query: ({ id, data }) => ({
        url: `/builds/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Builds'],
    }),
  }),
});

export const {
  useGetBuildsQuery,
  useCreateBuildMutation,
  useDeleteBuildMutation,
  useUpdateBuildMutation
} = buildApi;
