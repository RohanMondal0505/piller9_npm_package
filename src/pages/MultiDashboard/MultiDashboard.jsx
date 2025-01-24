import * as React from "react";
import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardDemo from "../../assets/images/DashboardDemo.png";
import axios from "../../components/Hooks/axios";
import { useDeleteAlert } from "../../components/Hooks/UseDeleteAlert";
import { formatTimestamp } from "../../components/utils/HelperFunctions";
import { removeDashboard, setDashboards, setOpenedDashboard } from "../../redux/slice/dashboardSlice";
import { setOpenLoadingPopup } from "../../redux/slice/tempSlice";
import AddWidgetPopup from "./AddWidgetPopup";
import DashboardTitlePopup from "./DashboardTitlePopup";
import styles from "./MultiDashboard.module.scss";

const MultiDashboard = () => {
	const dispatch = useDispatch();
	const [openTitlePopup, setOpenTitlePopup] = useState(false);
	const [title, setTitle] = useState("");
	const [openAddWidgetPopup, setOpenAddWidgetPopup] = useState(false);

	const { user } = useSelector((state) => state.user);

	const navigate = useNavigate();

	const handleOpenView = (data) => {
		navigate("/user/dynamic-dashboard");
		dispatch(setOpenedDashboard(data)); //saving state in redux for opened dashboard for view and edit
	};

	//get all dashboards of user
	const { dashboards } = useSelector((state) => state.dashboard);
	useEffect(() => {
		dispatch(setOpenLoadingPopup(true));
		axios
			.get(`/dashboard/user/${user._id}`)
			.then(({ data }) => {
				dispatch(setDashboards(data?.data));
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message || "Error fetching dashboard data");
			})
			.finally(() => dispatch(setOpenLoadingPopup(false)));
	}, []);
	//delete dashboard

	const handleDelete = async (id) => {
		let isConfirmed = await useDeleteAlert();
		if (!isConfirmed) return;

		dispatch(setOpenLoadingPopup(true));

		axios
			.delete(`dashboard/delete/${id}`)
			.then(({ data }) => {
				toast.success(data?.message || "Dashboard removed successfully...");
				dispatch(removeDashboard(id));
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message || "Error deleing dashboard....");
			})
			.finally(() => dispatch(setOpenLoadingPopup(false)));
	};

	return (
		<>
			{openTitlePopup && <DashboardTitlePopup {...{ setOpenTitlePopup, setOpenAddWidgetPopup, title, setTitle }} />}
			{openAddWidgetPopup && <AddWidgetPopup {...{ setOpenAddWidgetPopup, title, setTitle }} />}

			<div className={styles.MultiDashboardNew}>
				<div className={styles.Top}>
					<div className={styles.Left}>
						<h2>Build Your Dashboard</h2>
						<p>
							Lorem ipsum dolor sit amet consectetur. Tellus risus ut massa quis vitae viverra aenean. Sapien in amet amet velit
							congue. Interdum id in libero placerat malesuada. Vel aliquam scelerisque ut .
						</p>
					</div>
					<button onClick={() => setOpenTitlePopup(true)}>Create Your Dashboard</button>
				</div>

				<div className={styles.Bottom}>
					<div className={styles.SavedDashboards}>
						{dashboards?.map((item, index) => (
							<div className={styles.DashboardCard} key={index}>
								<div className={styles.TopSection}>
									<div className={styles.Left}>
										<h3>{item?.title}</h3>
										<p>{formatTimestamp(item?.createdAt)}</p>
									</div>
									<span onClick={() => handleDelete(item?._id)} style={{ cursor: "pointer" }}>
										<MdDeleteForever size={"1.25rem"} color="red" />
									</span>
									<button onClick={() => handleOpenView(item)}>View</button>
								</div>
								<div className={styles.Image}>
									<img
										src={
											"https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/Pilar9%2FDashboardDemo.png?alt=media&token=842d2a46-7d24-4ddb-9b9b-0623a0814fd9"
										}
										alt=""
										height={"100%"}
										width={"100%"}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default MultiDashboard;
