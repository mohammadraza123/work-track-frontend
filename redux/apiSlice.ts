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
      const response = await axios.post(`auth/login`, bodyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const verifyOtp = createAsyncThunk(
  "/verify/otp",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/verify`, bodyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "/forgot/password",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/forgot`, bodyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "/reset/password",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/resetpassword`, bodyData);
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

export const checkIn = createAsyncThunk(
  "/checkIn",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`action/check-in`, bodyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const checkOut = createAsyncThunk(
  "/checkOut",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`action/check-out`, bodyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getAttendence = createAsyncThunk(
  "/checkOut",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`action/get-attendance`, bodyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const addLocation = createAsyncThunk(
  "/add-location",
  async (bodyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`action/add-location`, bodyData);
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
