import * as React from "react";
import ls from "localstorage-slim";
import { IoMdLogOut } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { LineAsset, Menu, RequestWidgetIcon, LogoSvg } from "../../assets/svg/SvgIndex";
import styles from "./Sidebar.module.scss";

const sidebarItems = [
	{
		name: "Dashboard",
		Url: "/user/dashboard",
		icon: Menu,
		onClick: () => console.log("clicked"),
	},
	{
		name: "Multi Dashboard",
		Url: "/user/multi-dashboard",
		icon: Menu,
	},
	{
		name: "Request Widget",
		Url: "/user/request-widget",
		icon: RequestWidgetIcon,
	},
	{
		name: "Logout",
		Url: "/",
		icon: IoMdLogOut,
		onClick: () => {
			ls.clear();
		},
	},
];

const Header = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();

	return (
		<div className={styles.Sidebar}>
			<div className={styles.Logo}>
				<img src={LogoSvg} alt="Logo" title="Logo" height={"100%"} width={"100%"} loading="eager" />
			</div>

			<div className={styles.LineAsset}>
				<img src={LineAsset} alt="" />
			</div>

			{sidebarItems?.map((item, index) => (
				<a
					onClick={() => {
						if (item?.Url) navigate(item?.Url);
						if (item?.onClick) item?.onClick();
					}}
					className={pathname === `${item?.Url}` ? styles.active : ""}
					key={index}>
					<span>
						{/* <Menu /> */}
						<img src={Menu} alt="" />
					</span>
					{item?.name}
				</a>
			))}
		</div>
	);
};

export default Header;
