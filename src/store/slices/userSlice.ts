import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_PRODUCTION;
const FRONTEND_BASE_URL = "http://localhost:8080"
export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  isPro: boolean;
  isMaxPro: boolean;
  subscriptionStatus?: "active" | "cancelled" | "expired";
  subscriptionExpiry?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  showLoginModal: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  showLoginModal: false,
};

// Configure axios globally for cookies
axios.defaults.withCredentials = true;

// Async thunks
export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (googleToken: string, { rejectWithValue }) => {
    try {
      console.log("Logging in with Google token:", googleToken);
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/google`,
        { token: googleToken },
        { withCredentials: true }
      );

      const { user } = response.data;
      return { user };
    } catch (error: any) {
      const message = error.response?.data?.error?.message || "Login failed";
      return rejectWithValue(message);
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        withCredentials: true,
      });

      return response.data.user;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to fetch user";
      return rejectWithValue(message);
    }
  },
);

export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );

      return response.data.user;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Token refresh failed";
      return rejectWithValue(message);
    }
  },
);
//logut call also
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      return;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || "Logout failed";
      return rejectWithValue(message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setShowLoginModal: (state, action: PayloadAction<boolean>) => {
      state.showLoginModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.payload as string;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const {  clearError, updateUser, setShowLoginModal } =
  userSlice.actions;
export default userSlice.reducer;
