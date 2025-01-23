import { configureStore } from "@reduxjs/toolkit";
import tempSlice from "./slice/tempSlice";
import widgetSlice from "./slice/widgetSlice";
import userSlice from "./slice/userSlice";
import dashboardSlice from "./slice/dashboardSlice";

const store = configureStore({
	reducer: {
		temp: tempSlice,
		widget: widgetSlice,
		user: userSlice,
		dashboard:dashboardSlice
	},
});

export default store;
