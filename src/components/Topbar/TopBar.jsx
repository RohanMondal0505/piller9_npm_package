import * as React from "react";
import { CiSearch } from "react-icons/ci";
import { VscBellDot } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styles from "./TopBar.module.scss";

const TopBar = () => {
	const { pathname } = useLocation();
	const { user } = useSelector((state) => state.user);
	return (
		<div className={styles.TopBar}>
			<div className={styles.Left}>
				<h1>Dashboard</h1>
				<p>Hello , 👋 {user?.name} Welcome to Dashboard</p>
			</div>

			<div className={styles.Right}>
				<div className={styles.InputWrapper}>
					<CiSearch />
					<input type="search" name="" id="" placeholder="Search Anything" />
				</div>

				<div className={styles.Notifications}>
					<VscBellDot />
				</div>
				<div className={styles.Profile}>
					<img src={user?.profilePic} alt="" />
				</div>
			</div>
		</div>
	);
};

export default TopBar;
