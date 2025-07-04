import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name: string;
  vehiclesCount?: number;
  requestsCount?: number;
}

export interface UserState {
  value: User;
}

const initialState: UserState = {
  value: {
    id: '',
    email: '',
    name: '',
    vehiclesCount: 0,
    requestsCount: 0,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
