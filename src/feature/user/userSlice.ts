import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SessionUser } from "@/types/auth";

/**
 * Who is signed in, as told by the server (`/api/auth/session`). No tokens here: they live in httpOnly
 * cookies the browser's JavaScript cannot read. Nothing is persisted to localStorage.
 */
export type UserProfile = SessionUser;

interface UserState {
  user: SessionUser | null;
  /** `unknown` until the first session check finishes. */
  status: "unknown" | "authenticated" | "anonymous";
  /** The API said the session ended (refresh token expired or revoked): show the session-expired dialog. */
  expired: boolean;
}

const initialState: UserState = { user: null, status: "unknown", expired: false };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionUser | null>) => {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "anonymous";
      if (action.payload) state.expired = false;
    },
    sessionExpired: (state) => {
      if (state.user) state.expired = true;
      state.user = null;
      state.status = "anonymous";
    },
    logout: (state) => {
      state.user = null;
      state.status = "anonymous";
      state.expired = false;
    },
  },
});

export const { setSession, sessionExpired, logout } = userSlice.actions;
export default userSlice.reducer;
