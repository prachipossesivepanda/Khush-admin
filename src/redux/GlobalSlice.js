import { createSlice } from "@reduxjs/toolkit";

const tokenFromStorage = localStorage.getItem("token");

const initialState = {
  loading: false,
  error: null,
  token: tokenFromStorage || null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },

    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setToken,
  clearToken,
} = globalSlice.actions;

export default globalSlice.reducer;
