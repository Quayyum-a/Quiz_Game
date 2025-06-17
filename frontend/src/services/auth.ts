import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../types";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => {
        console.log("RTK Query login request:", credentials);
        return {
          url: "auth/login",
          method: "POST",
          body: credentials,
        };
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => {
        console.log("RTK Query register request:", userData);
        return {
          url: "auth/register",
          method: "POST",
          body: userData,
        };
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
