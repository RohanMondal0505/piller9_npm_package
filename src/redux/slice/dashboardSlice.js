import { createSlice } from "@reduxjs/toolkit";
import ls from "localstorage-slim";

const initialState = {
	dashboards: ls.get("Pillar9_dashboard_npm_ls") || [],
	openedDashboard: ls.get("Pillar9_openedDashboard_npm_ls") || {},
};

const dashboardSlice = createSlice({
	name: "dashboardSlice",
	initialState,
	reducers: {
		setDashboards: (state, { payload }) => {
			state.dashboards = payload;
			ls.set("Pillar9_dashboard_npm_ls", payload);
		},
		//using in multi dashboard delete api time
		removeDashboard: (state, { payload }) => {
			state.dashboards = state.dashboards.filter((dashboard) => dashboard._id !== payload);
			ls.set("Pillar9_dashboard_npm_ls", state.dashboards);
		},

		//using in add widget popup(multi dashboard)
		addDashboard: (state, { payload }) => {
			state.dashboards.unshift(payload);
			ls.set("Pillar9_dashboard_npm_ls", state.dashboards);
		},

		//using in multi dashboard , dynamic dashboard
		setOpenedDashboard: (state, { payload }) => {
			state.openedDashboard = payload;
			ls.set("Pillar9_openedDashboard_npm_ls", payload);
		},
	},
});

export const { setDashboards, setOpenedDashboard, addDashboard, removeDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
