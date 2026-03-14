import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { extraReducersBuilder } from "./apiReducer";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // read token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// -------------------- RESPONSE INTERCEPTOR FOR REFRESH TOKEN --------------------

axios.interceptors.response.use(
  (response) => {
    console.log("[Axios] Response success:", response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(
      "[Axios] Response error:",
      originalRequest.url,
      error.response?.status,
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      console.log(
        "[Axios] 401 detected. Attempting refresh for:",
        originalRequest.url,
      );
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.log("[Axios] No refresh token found. Cannot refresh.");
        return Promise.reject(error);
      }

      try {
        const refreshInstance = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_URL,
          withCredentials: true,
          headers: {
            Authorization: "",
          },
        });

        const refreshToken = localStorage.getItem("accessToken");
        const { data } = await refreshInstance.post("auth/refresh", {
          withCredentials: true,
        });

        // Save new token if received
        if (data.accessToken) {
          Cookies.set("token", data.accessToken, { expires: 7 });
          localStorage.setItem("accessToken", data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        console.log("[Axios] Refresh API response:", data);

        const newToken = data.accessToken;
        Cookies.set("token", newToken, { expires: 7 });
        localStorage.setItem("accessToken", newToken);
        if (data.refreshToken)
          localStorage.setItem("refreshToken", data.refreshToken);

        // Retry original request
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        console.log("[Axios] Retrying original request:", originalRequest.url);
        return axios(originalRequest);
      } catch (err) {
        console.error("[Axios] Refresh API failed:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

const initialState: any = {
  user: null,
};

export const initializeAuth = createAsyncThunk(
  "/auth/initialize",
  (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token") || null;
      let user = null;
      let profile = null;

      const storedUser = localStorage.getItem("user");
      const storedProfile = localStorage.getItem("profile");

      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch (e) {
          console.warn("Failed to parse user from localStorage", e);
        }
      }
      if (storedProfile) {
        try {
          profile = JSON.parse(storedProfile);
        } catch (e) {
          console.warn("Failed to parse profile from localStorage", e);
        }
      }

      return { token, user, profile };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to initialize auth");
    }
  },
);

export const signUp = createAsyncThunk(
  "/auth/signUp",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/register`, bodyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const signIn = createAsyncThunk(
  "/auth/signIn",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/register`, bodyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getUser = createAsyncThunk(
  "/get/user",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`auth/profile`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const logout = createAsyncThunk(
  "/user/logout",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/logout`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const refreshToken = createAsyncThunk(
  "/auth/refreshToken",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/refresh`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const newsLetter = createAsyncThunk(
  "/newsletter",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`newsletter`, bodyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const apiSlice = createSlice({
  name: "api",
  initialState: { ...initialState },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        initializeAuth.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.user = action.payload.user;
          axios.defaults.headers.common["Authorization"] = action.payload.token
            ? `Bearer ${action.payload.token}`
            : "";
        },
      )
      .addCase(initializeAuth.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong during auth init";
      });
    extraReducersBuilder(builder); // Keep this if you're using shared extra reducers
  },
});

export const { setUser } = apiSlice.actions;

export const apiReducer = apiSlice.reducer;
