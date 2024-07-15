import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ResetPasswordRequest,
  login,
  LoginRequest,
  signUp,
  SignUpRequest,
  resetPassword,
  verifySecurityCode,
  SecurityCodePayload,
  NewPasswordData,
  setNewPassword,
} from '@app/api/auth.api';
import { setUser } from '@app/store/slices/userSlice';
import { deleteToken, deleteUser, persistToken, readToken } from '@app/services/localStorage.service';
import { notificationController } from '@app/controllers/notificationController';
import { createSignedMessage } from '@app/hooks/useSigner';

// Define the initial state for the auth slice
export interface AuthSlice {
  token: string | null;
}

const initialState: AuthSlice = {
  token: readToken(),
};

interface SignedLoginRequest extends LoginRequest {
  signedMessage: {
    messageHash: string;
    signature: string;
  };
}

export const doLogin = createAsyncThunk(
  'auth/doLogin',
  async (loginPayload: LoginRequest, { dispatch, rejectWithValue }) => {
    try {
      const encodedKey = ''; // Replace with your actual encoded key
      const signedMessage = createSignedMessage(JSON.stringify(loginPayload), encodedKey);

      const signedLoginPayload: SignedLoginRequest = { ...loginPayload, signedMessage };

      console.log('The signed login payload', signedLoginPayload);

      const response = await login(signedLoginPayload);
      console.log('The response', response);
      dispatch(setUser(response.user));
      persistToken(response.token);
      return response.token;
    } catch (error: any) {
      notificationController.error({ message: error.message });
      return rejectWithValue(error.message);
    }
  },
);

// Define async thunk for sign-up
export const doSignUp = createAsyncThunk('auth/doSignUp', async (signUpPayload: SignUpRequest, { rejectWithValue }) => {
  try {
    await signUp(signUpPayload);
    notificationController.success({
      message: 'Sign-up successful',
      description: 'You have successfully signed up!',
    });
  } catch (error: any) {
    notificationController.error({ message: error.message });
    return rejectWithValue(error.message);
  }
});

// Define async thunk for reset password
export const doResetPassword = createAsyncThunk(
  'auth/doResetPassword',
  async (resetPassPayload: ResetPasswordRequest) => resetPassword(resetPassPayload),
);

// Define async thunk for verifying security code
export const doVerifySecurityCode = createAsyncThunk(
  'auth/doVerifySecurityCode',
  async (securityCodePayload: SecurityCodePayload) => verifySecurityCode(securityCodePayload),
);

// Define async thunk for setting a new password
export const doSetNewPassword = createAsyncThunk('auth/doSetNewPassword', async (newPasswordData: NewPasswordData) =>
  setNewPassword(newPasswordData),
);

// Define async thunk for logout
export const doLogout = createAsyncThunk('auth/doLogout', (payload, { dispatch }) => {
  deleteToken();
  deleteUser();
  dispatch(setUser(null));
  console.log('Token deleted');
});

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, (state, action) => {
      console.log('Login successful, token:', action.payload);
      state.token = action.payload;
    });
    builder.addCase(doLogout.fulfilled, (state) => {
      console.log('Logout successful, clearing token');
      state.token = null;
    });
    builder.addCase(doSignUp.fulfilled, (state) => {
      // Optionally handle state changes after sign-up
    });
    builder.addCase(doSignUp.rejected, (state, action) => {
      // Optionally handle state changes on sign-up failure
    });
  },
});

export default authSlice.reducer;
