import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  role : string  | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role')
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
        console.log('Setting token in slice:', action.payload);
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload
      localStorage.setItem('role', action.payload)
    },
    logout: (state) => {
      state.token = null
      localStorage.removeItem('token')
    },
  },
})

export const { setToken, setRole, logout } = authSlice.actions
export default authSlice.reducer
