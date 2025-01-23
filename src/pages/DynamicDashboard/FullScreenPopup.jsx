import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeFullScreenPopup } from "../../redux/slice/widgetSlice";
import styles from "./FullScreenPopup.module.scss";
import DataTable from "../DataTable/DataTable";

const FullScreenPopup = () => {
	const { openWidgetData } = useSelector((state) => state.widget);
	const dispatch = useDispatch();
	return (
		<div className={styles.FullScreenPopup}>
			<div className={styles.Wrapper}>
				<div className={styles.Top}>
					{openWidgetData?.name}
					<p onClick={() => dispatch(closeFullScreenPopup())}>Close Full Screen</p>
				</div>

				<div className={styles.Contents}>
					{openWidgetData?.name === "ListAgent" ? <DataTable /> : openWidgetData?.name}
				</div>
			</div>
		</div>
	);
};

export default FullScreenPopup;
