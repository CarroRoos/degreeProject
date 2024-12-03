import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    filteredUsers: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      state.filteredUsers = action.payload;
    },
    filterUsers: (state, action) => {
      state.filteredUsers = action.payload;
    },
    resetUsers: (state) => {
      state.filteredUsers = state.users;
    },
  },
});

export const { setUsers, filterUsers, resetUsers } = userSlice.actions;
export default userSlice.reducer;
