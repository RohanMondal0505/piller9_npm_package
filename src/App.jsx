// import * as React from "react";
import ls from "localstorage-slim";
import React, { lazy, Suspense, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./assets/scss/Styles.module.scss";
import "./assets/scss/index.scss";
import ScrollToTop from "./components/Hooks/ScrollToTop.jsx";
import axios from "./components/Hooks/axios.jsx";
import LoadingPopup from "./components/Loading/LoadingPopup.jsx";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/Topbar/TopBar.jsx";
import DataTable from "./pages/DataTable/DataTable.jsx";
import FullScreenPopup from "./pages/DynamicDashboard/FullScreenPopup.jsx";
import { fetchUserFromLocal } from "./redux/slice/userSlice.js";
import store from "./redux/store";

const DashboardNew = lazy(() => import("./pages/Dashboard/Dashboard.jsx"));
const MultiDashboard = lazy(() => import("./pages/MultiDashboard/MultiDashboard.jsx"));
const RequestWidget = lazy(() => import("./pages/RequestWidget/RequestWidget.jsx"));
const DynamicDashboard = lazy(() => import("./pages/DynamicDashboard/DynamicDashboard.jsx"));

const App = ({ token, user, X_API_KEY, API_BASE_URL }) => {
	// const location = useLocation();

	useEffect(() => {
		if (!token) {
			toast.warn("Token is Required...");
			return;
		}
		ls.set("Pilar9_Token_npm_ls", token);
		ls.set("Pillar9_user_npm_ls", user);
		ls.set("X_API_KEY", X_API_KEY);
		ls.set("API_BASE_URL", API_BASE_URL);
		axios.defaults.headers.Authorization = token;
	}, [token, user, ls.get("Pilar9_Token_npm_ls")]);

	if (ls.get("Pilar9_Token_npm_ls"))
		return (
			<Provider store={store}>
				<ScrollToTop />

				<ToastContainer
					position="top-center"
					autoClose={3000}
					limit={4}
					hideProgressBar={false}
					newestOnTop={false}
					rtl={false}
					pauseOnFocusLoss={false}
					draggable={false}
					pauseOnHover
				/>

				<Routes>
					{/* <Route path="/" element={<Login />} /> */}
					<Route path="/" element={<Navigate to="/user/dashboard" />} />
					<Route path="/user" element={<Wrapper />}>
						<Route path="dashboard" element={<DashboardNew />} />
						<Route path="multi-dashboard" element={<MultiDashboard />} />
						<Route path="data-table" element={<DataTable />} />
						<Route path="request-widget" element={<RequestWidget />} />
						<Route path="dynamic-dashboard" element={<DynamicDashboard />} />
					</Route>
				</Routes>
			</Provider>
		);
};

export { App };

const Wrapper = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { openWidgetInFullScreen } = useSelector((state) => state.widget);
	const { openLoadingPopup } = useSelector((state) => state.temp);

	useEffect(() => {
		dispatch(fetchUserFromLocal());
	}, []);

	useEffect(() => {
		if (!ls.get("Pilar9_Token_npm_ls")) navigate("/");
	}, []);
	return (
		<div className={styles.Wrapper}>
			{openLoadingPopup && <LoadingPopup />}
			{openWidgetInFullScreen && <FullScreenPopup />}
			<Suspense fallback={<LoadingIndicator />}>
				<Sidebar />

				<div className={styles.MainWrapper}>
					<TopBar />
					<Outlet />
				</div>
			</Suspense>
		</div>
	);
};
