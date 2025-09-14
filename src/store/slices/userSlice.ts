import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  showLoginModal: boolean;
}

const initialState: UserState = {
  user: null,
  token: localStorage.getItem("online-tool-token"),
  isLoading: false,
  error: null,
  isAuthenticated: false,
  showLoginModal: false,
};

// Async thunks
export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (googleToken: string, { rejectWithValue }) => {
    try {
      console.log("Logging in with Google token:", googleToken);
      const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        token: googleToken,
      });

      const { token, user } = response.data;
      localStorage.setItem("online-tool-token", token);

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { token, user };
    } catch (error: any) {
      const message = error.response?.data?.error?.message || "Login failed";
      return rejectWithValue(message);
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;

      if (!token) {
        throw new Error("No token available");
      }

      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
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
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;

      if (!token) {
        throw new Error("No token available");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const { token: newToken, user } = response.data;
      localStorage.setItem("online-tool-token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { token: newToken, user };
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Token refresh failed";
      return rejectWithValue(message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("online-tool-token");
      delete axios.defaults.headers.common["Authorization"];
    },
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
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
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
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Don't set isAuthenticated to false here as token might still be valid
      })

      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("online-tool-token");
        delete axios.defaults.headers.common["Authorization"];
      });
  },
});

export const { logout, clearError, updateUser,setShowLoginModal } = userSlice.actions;
export default userSlice.reducer;
