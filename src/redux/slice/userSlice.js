import { createSlice } from "@reduxjs/toolkit";
import ls from "localstorage-slim";

const initialState = {
	user: ls.get("Pillar9_user_npm_ls") || {},
};

const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {
		setUser: (state, { payload }) => {
			state.user = payload || {};
			ls.set("Pillar9_user_npm_ls", payload);
		},
		fetchUserFromLocal: (state, { payload }) => {
			state.user = ls.get("Pillar9_user_npm_ls") || {};
		},
	},
});

export const { setUser, fetchUserFromLocal } = userSlice.actions;

export default userSlice.reducer;
