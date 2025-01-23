import * as React from "react";
import { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CrossButton, PlusButton } from "../../assets/svg/SvgIndex";
import axios from "../../components/Hooks/axios";
import { setOpenLoadingPopup } from "../../redux/slice/tempSlice";
import styles from "./Dashboard.module.scss";
import Widgets from "./Widgets";

const defaultLayout = [
	{ i: "box1", x: 0, y: 0, w: 12, h: 8, isDraggable: true, isResizable: true },
	{ i: "box2", x: 0, y: 8, w: 6, h: 8, isDraggable: true, isResizable: true },
	{ i: "box3", x: 6, y: 8, w: 6, h: 8, isDraggable: true, isResizable: true },
	{ i: "box4", x: 0, y: 16, w: 8, h: 8, isDraggable: true, isResizable: true },
	{ i: "box5", x: 8, y: 16, w: 4, h: 8, isDraggable: true, isResizable: true },
];

const Dashboard = () => {
	const dispatch = useDispatch();
	const [layout, setLayout] = useState(defaultLayout);
	const [dashboardData, setDashboardData] = useState(null);
	const [showUpdateButton, setShowUpdateButton] = useState(false); //for show save layout button
	const [reload, setReload] = useState(0);
	const [loading, setLoading] = useState(true);

	const { user } = useSelector((state) => state.user);

	const [gridWidth, setGridWidth] = useState(window.innerWidth * 0.8);
	useEffect(() => {
		const updateGridWidth = () => setGridWidth(window.innerWidth * 0.8);
		window.addEventListener("resize", updateGridWidth);
		return () => window.removeEventListener("resize", updateGridWidth);
	}, []);

	//state to revert to original state if cancel edit
	const [backupDashboardData, setBackupDashboardData] = useState(null);

	const [updatingLayout, setUpdatingLayout] = useState(false);

	const [editable, setEditable] = useState(false);
	const [selectedWidgets, setSelectedWidgets] = useState(dashboardData?.widgets || []);
	const [widgetButtons, setWidgetButtons] = useState(["ListAgent", "Dimensions", "Segments", "Time", "Filter"]);

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

	//fetch dashboard
	useEffect(() => {
		setLoading(true);
		dispatch(setOpenLoadingPopup(true));
		axios
			.get(`/main-dashboard?userId=${user._id}`)
			.then(({ data }) => {
				setDashboardData(data?.data);
				setBackupDashboardData(data?.data);
				setSelectedWidgets(data?.data?.widgets);
				setLayout(data?.data?.layout);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message || "Error getting layout..");
			})
			.finally(() => {
				setLoading(false);
				setTimeout(() => {
					setShowUpdateButton(false);
				}, 100);
				dispatch(setOpenLoadingPopup(false));
			});
	}, [reload]);

	const handleSaveLayout = () => {
		setUpdatingLayout(true);
		dispatch(setOpenLoadingPopup(true));
		axios
			.post(`/main-dashboard/create?userId=${user._id}`, {
				widgets: dashboardData?.widgets,
				layout: dashboardData?.layout,
			})
			.then(({ data }) => {
				toast.success(data?.message || "Updated Successfully...");
				setReload(Math.random());
				setEditable(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message || "Error Updating Dashboard layout..");
			})
			.finally(() => {
				setUpdatingLayout(false);
				setShowUpdateButton(false);
				dispatch(setOpenLoadingPopup(false));
			});
	};

	//manage widget
	const handleAddWidget = (widgetName) => {
		const newWidget = { name: widgetName, isLocked: false, isCollapsed: false };

		setSelectedWidgets((prev) => [...prev, newWidget]);

		setDashboardData((prev) => {
			const updatedWidgets = [...prev.widgets, newWidget];
			const newLayoutItem = {
				i: `box${updatedWidgets.length}`,
				x: 0, // Start at the first column
				y: Infinity, // Append at the end of the grid
				w: 6, // Default width
				h: 8, // Default height
				isDraggable: true,
				isResizable: true,
			};
			const updatedLayout = [...layout, newLayoutItem];

			setLayout(updatedLayout); // Update the layout state
			return { ...prev, widgets: updatedWidgets, layout: updatedLayout };
		});
	};

	// Remove widget from selectedWidgets and update dashboardData and layout
	const handleRemoveWidget = (widgetName) => {
		setSelectedWidgets((prev) => prev.filter((widget) => widget.name !== widgetName));

		setDashboardData((prev) => {
			const updatedWidgets = prev.widgets.filter((widget) => widget.name !== widgetName);
			const updatedLayout = layout.filter((item, index) => {
				const correspondingWidget = prev.widgets[index];
				return correspondingWidget?.name !== widgetName;
			});

			setLayout(updatedLayout); // Update the layout state
			return { ...prev, widgets: updatedWidgets, layout: updatedLayout };
		});
	};

	//cancel edit
	const handleCancel = () => {
		setEditable(false);
		setDashboardData(backupDashboardData);
		setSelectedWidgets(backupDashboardData?.widgets);
		setLayout(backupDashboardData?.layout);
		setTimeout(() => {
			setShowUpdateButton(false);
		}, 100);
	};

	return (
		<>
			<div className={`${styles.Dashboard} `}>
				<div className={styles.Top}>
					<h2>Create Or Manage Your Dashboard</h2>
					<div className={styles.Buttons}>
						{!editable ? (
							<button onClick={() => setEditable(true)}>Manage Widgets</button>
						) : (
							<button onClick={handleCancel}>Cancel</button>
						)}

						{showUpdateButton && (
							<>{updatingLayout ? <button>Updating ....</button> : <button onClick={handleSaveLayout}>Save Layout</button>}</>
						)}
					</div>
				</div>

				{/* Widget Buttons */}

				{loading ? (
					<></>
				) : (
					<>
						{editable && (
							<div className={styles.WidgetButtons}>
								{widgetButtons.map((item, index) => (
									<div key={index} className={styles.WidgetBtn}>
										<p>{item}</p>
										{selectedWidgets.some((widget) => widget.name === item) ? (
											<span className={styles.CrossButton} onClick={() => handleRemoveWidget(item)}>
												<img src={CrossButton} alt="Remove" title="Remove" />
											</span>
										) : (
											<span className={styles.Show} onClick={() => handleAddWidget(item)}>
												<img src={PlusButton} alt="Add" title="Add" />
											</span>
										)}
									</div>
								))}
							</div>
						)}

						<div className={styles.Widgets}>
							{!dashboardData ? (
								<h2>Please create your dashboard By manage widgets</h2>
							) : (
								<GridLayout
									className="layout"
									layout={layout}
									cols={12}
									rowHeight={40}
									width={gridWidth}
									draggableHandle=".dragHandle"
									onLayoutChange={handleLayoutChange}
								>
									{dashboardData?.widgets?.map((widget, i) => (
										<div
											key={`box${i + 1}`}
											className={styles.gridItem}
											data-grid={{
												...layout[i],
												isDraggable: layout[i]?.isDraggable ?? true, // Default to true
												isResizable: layout[i]?.isResizable ?? true, // Default to true
												static: !layout[i]?.isDraggable && !layout[i]?.isResizable,
											}}
										>
											<Widgets item={widget} index={i} onWidgetStateChange={handleWidgetStateChange} />
										</div>
									))}
								</GridLayout>
							)}
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default Dashboard;
