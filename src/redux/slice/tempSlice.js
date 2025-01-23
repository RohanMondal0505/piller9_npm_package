import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	addChartPopup: false,
	existingCharts: [],
	reloadDashboardData: 0, //for fetch the updated data after adding/editing a new chart
	title: "",
	openLoadingPopup: false,
};

const tempSlice = createSlice({
	name: "tempSlice",
	initialState,
	reducers: {
		setAddChartPopup: (state, { payload }) => {
			state.addChartPopup = payload.status;
			state.existingCharts = payload.existingChart || [];
		},
		setReloadDashboardData: (state) => {
			state.reloadDashboardData = Math.random();
		},
		setTitle: (state, { payload }) => {
			state.title = payload;
		},
		setOpenLoadingPopup: (state, { payload }) => {
			state.openLoadingPopup = payload;
		},
	},
});

export const { setAddChartPopup, setTitle, setReloadDashboardData, setOpenLoadingPopup } = tempSlice.actions;

export default tempSlice.reducer;
