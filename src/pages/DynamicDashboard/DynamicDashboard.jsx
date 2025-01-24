import * as React from "react";
import { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../components/Hooks/axios";
import { setOpenedDashboard } from "../../redux/slice/dashboardSlice";
import EditWidgetPopup from "../MultiDashboard/EditWidgetPopup";
import styles from "./DynamicDashboard.module.scss";
import Widgets from "./Widgets";

const DynamicDashboard = () => {
	const dispatch = useDispatch();
	const { openedDashboard } = useSelector((state) => state.dashboard);
	const [openEditPopup, setOpenEditPopup] = useState(false);
	const [showUpdateButton, setShowUpdateButton] = useState(false); //for show save layout button
	const navigate = useNavigate();

	const [dashboardData, setDashboardData] = useState(openedDashboard);
	//grid
	const [gridWidth, setGridWidth] = useState(window.innerWidth * 0.8);

	useEffect(() => {
		const updateGridWidth = () => {
			setGridWidth(window.innerWidth * 0.8);
		};

		updateGridWidth();

		window.addEventListener("resize", updateGridWidth);
		return () => window.removeEventListener("resize", updateGridWidth);
	}, []);

	const defaultLayout = [
		{ i: "box1", x: 0, y: 0, w: 12, h: 8, isDraggable: true, isResizable: true },
		{ i: "box2", x: 0, y: 8, w: 6, h: 8, isDraggable: true, isResizable: true },
		{ i: "box3", x: 6, y: 8, w: 6, h: 8, isDraggable: true, isResizable: true },
		{ i: "box4", x: 0, y: 16, w: 8, h: 8, isDraggable: true, isResizable: true },
		{ i: "box5", x: 8, y: 16, w: 4, h: 8, isDraggable: true, isResizable: true },
	];

	const [layout, setLayout] = useState(() => {
		const savedLayout = openedDashboard?.layout;
		return savedLayout ? savedLayout : defaultLayout;
	});

	const handleLayoutChange = (newLayout) => {
		setLayout(newLayout);
		setDashboardData((prev) => ({
			...prev,
			layout: newLayout,
		}));
		setShowUpdateButton(true);
	};

	const handleWidgetStateChange = (index, key, value) => {
		setDashboardData((prev) => {
			const updatedWidgets = prev.widgets.map((widget, i) => (i === index ? { ...widget, [key]: value } : { ...widget }));

			// Update layout immediately based on `isLocked`
			const updatedLayout = layout.map((item, i) => {
				if (i === index && key === "isLocked") {
					return {
						...item,
						isDraggable: !value, // Lock = not draggable
						isResizable: !value, // Lock = not resizable
					};
				}
				if (i === index && key === "isCollapsed") {
					return {
						...item,
						isResizable: !value,
						h: value ? 1 : 8,
					};
				}
				return item;
			});

			setLayout(updatedLayout);

			return { ...prev, widgets: updatedWidgets };
		});
	};

	const [updatingLayout, setUpdatingLayout] = useState(false);
	const handleSaveLayout = () => {
		setUpdatingLayout(true);
		axios
			.put(`/dashboard/update/${dashboardData?._id}`, {
				title: dashboardData?.title,
				widgets: dashboardData?.widgets,
				layout: dashboardData?.layout,
			})
			.then(({ data }) => {
				toast.success(data?.message || "Dashboard Updated Successfully...");
				dispatch(setOpenedDashboard(data?.data));
				setShowUpdateButton(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message || "Error Updating Dashboard layout..");
			})
			.finally(() => setUpdatingLayout(false));
	};

	useEffect(() => {
		setDashboardData(openedDashboard);
		setLayout(openedDashboard?.layout);
		setShowUpdateButton(false);
	}, [openedDashboard]);

	return (
		<>
			{openEditPopup && <EditWidgetPopup {...{ setOpenEditPopup }} />}

			<div className={styles.DynamicDashboard}>
				<div className={styles.Top}>
					<h1>Title : {dashboardData?.title}</h1>

					<div className={styles.Buttons}>
						<button
							onClick={() => {
								navigate("/user/multi-dashboard");
								dispatch(setOpenedDashboard({}));
							}}>
							Back
						</button>
						<button onClick={() => setOpenEditPopup(true)}>Manage Widgets</button>
						{showUpdateButton && (
							<>
								{updatingLayout ? (
									<button>Updating ....</button>
								) : (
									<button onClick={handleSaveLayout}>Save Layout</button>
								)}
							</>
						)}
					</div>
				</div>

				<div className={styles.Widgets}>
					<GridLayout
						className="layout"
						layout={layout}
						cols={12}
						rowHeight={40}
						width={gridWidth}
						draggableHandle=".dragHandle"
						onLayoutChange={handleLayoutChange}>
						{dashboardData?.widgets?.map((widget, i) => (
							<div
								key={`box${i + 1}`}
								className={styles.gridItem}
								data-grid={{
									...layout[i],
									isDraggable: layout[i]?.isDraggable ?? true, // Default to true
									isResizable: layout[i]?.isResizable ?? true, // Default to true
									static: !layout[i]?.isDraggable && !layout[i]?.isResizable,
								}}>
								<Widgets item={widget} index={i} onWidgetStateChange={handleWidgetStateChange} />
							</div>
						))}
					</GridLayout>
				</div>
			</div>
		</>
	);
};

export default DynamicDashboard;
