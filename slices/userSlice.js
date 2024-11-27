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
    },
    filterUsers: (state, action) => {
      const query = action.payload.toLowerCase();
      state.filteredUsers = state.users.filter(
        (user) =>
          user.displayName?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
    },
    resetUsers: (state) => {
      state.filteredUsers = [];
    },
  },
});

export const { setUsers, filterUsers, resetUsers } = userSlice.actions;
export default userSlice.reducer;
