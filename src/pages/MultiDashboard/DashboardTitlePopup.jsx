import * as React from "react";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./DashboardTitlePopup.module.scss";

const DashboardTitlePopup = ({ setOpenTitlePopup, setOpenAddWidgetPopup, title, setTitle }) => {
	const { savedWidgetDashboards } = useSelector((state) => state.widget);
	const handleNext = () => {
		if (title === "") return toast.warn("Title Should not be empty");

		const matched = savedWidgetDashboards?.filter((item) => item?.title === title);
		if (matched?.length > 0) {
			return toast.warn("Dashboard already exists with this title..");
		}

		setOpenTitlePopup(false);
		setOpenAddWidgetPopup(true);
	};
	return (
		<div className={styles.DashboardTitlePopup} onClick={() => setOpenTitlePopup(false)}>
			<div className={styles.Wrapper} onClick={(e) => e.stopPropagation()}>
				<h2>Dashboard Title</h2>
				<p>Please add the title of Dashboard</p>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Title of the dashboard"
				/>
				<button onClick={handleNext} className={styles.NextButton}>
					next
				</button>

				<div className={styles.ButtonWrapper}>
					<button onClick={() => setOpenTitlePopup(false)}>
						<RxCross2 size={"2rem"} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default DashboardTitlePopup;
