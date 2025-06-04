import { createSlice } from '@reduxjs/toolkit';

const localUser = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: localUser ? localUser : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logoutUser(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
    setLoading(state) {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    },
    
    setError(state, action) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMessage = action.payload;
    },
  },
});

export const { setUser, logoutUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;