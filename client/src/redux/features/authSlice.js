import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const login = createAsyncThunk(
  "auth/login",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.signIn(formValue);
      toast.success("Login Successfully");
      navigate("/verfiy");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.signUp(formValue);
      console.log("register");
      toast.success("Register Successfully");
      navigate("/");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verify_otp",
  async ({ code, navigate, toast }, { rejectWithValue }) => {
    try {
      console.log(code);
      const res = await api.verfyOPT({ code });
      if (res.data) {
        toast.success("Logged In Successfully");
        navigate("/");
        return res.data;
      }
      toast.error("failed");
      throw new Error("Token not valued");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// export const googleSignIn = createAsyncThunk(
//   "auth/googleSignIn",
//   async ({ result, navigate, toast }, { rejectWithValue }) => {
//     try {
//       const response = await api.googleSignIn(result);
//       toast.success("Google Sign-in Successfully");
//       navigate("/");
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: "",
    loading: false,
    mfaEnabled: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state, action) => {
      localStorage.clear();
      state.user = null;
    },
    setVerify: (state, action) => {
      state.mfaEnabled = true;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.mfaEnabled = false;
      state.user = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [register.pending]: (state, action) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.error = action?.payload?.message;
    },
    [verifyOtp.pending]: (state, action) => {
      state.loading = true;
    },
    [verifyOtp.fulfilled]: (state, action) => {
      state.loading = false;
      console.log(action);
    },
    [verifyOtp.rejected]: (state, action) => {
      state.loading = false;
      state.error = action?.payload?.message;
    },
    //   [googleSignIn.pending]: (state, action) => {
    //     state.loading = true;
    //   },
    //   [googleSignIn.fulfilled]: (state, action) => {
    //     state.loading = false;
    //     localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
    //     state.user = action.payload;
    //   },
    //   [googleSignIn.rejected]: (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload.message;
    //   },
  },
});

export const { setUser, setLogout, setVerify } = authSlice.actions;

export default authSlice.reducer;
