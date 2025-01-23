import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	openWidgetInFullScreen: false,
	openWidgetData: {},
};

const widgetSlice = createSlice({
	name: "widgetSlice",
	initialState,
	reducers: {
		openFullScreenPopup: (state, { payload }) => {
			state.openWidgetInFullScreen = true;
			state.openWidgetData = payload;
		},
		closeFullScreenPopup: (state) => {
			state.openWidgetInFullScreen = false;
			state.openWidgetData = {};
		},
	},
});

export const { openFullScreenPopup, closeFullScreenPopup } = widgetSlice.actions;

export default widgetSlice.reducer;
