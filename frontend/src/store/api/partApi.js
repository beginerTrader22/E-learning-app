// api/partApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const partApi = createApi({
  reducerPath: 'partApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/pc',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.user?.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getParts: builder.query({
      query: () => '/parts',
    }),
  }),
});

export const { useGetPartsQuery } = partApi;