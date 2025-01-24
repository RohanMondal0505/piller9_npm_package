import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LineAsset } from "../../assets/svg/SvgIndex";
import styles from "./Sidebar.module.scss";

const Header = ({ logoutUrl, logoutFunction }) => {
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const sidebarItems = [
		{
			name: "Dashboard",
			Url: "/user/dashboard",
			icon: "https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/Pilar9%2FMenuWhite.webp?alt=media&token=0d415c29-9d8f-4e3d-a299-8b281a69865d",
			activeIcon:
				"https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/Pilar9%2FMenuYellow.webp?alt=media&token=2ed68c35-97d7-493d-add9-22e705fd64ba",
		},
		{
			name: "Multi Dashboard",
			Url: "/user/multi-dashboard",
			icon: "https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/Pilar9%2FMenuWhite.webp?alt=media&token=0d415c29-9d8f-4e3d-a299-8b281a69865d",
			activeIcon:
				"https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/Pilar9%2FMenuYellow.webp?alt=media&token=2ed68c35-97d7-493d-add9-22e705fd64ba",
		},
		{
			name: "Request Widget",
			Url: "/user/request-widget",
			icon: "https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/Pilar9%2FWidgetWhite.webp?alt=media&token=ef331593-caeb-4125-9422-465819b27a49",
			activeIcon:
				"https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/Pilar9%2FWidgetYellow.webp?alt=media&token=9745bd71-0535-49cd-afb1-627caad6aace",
		},
		{
			name: "Logout",
			Url: logoutUrl,
			icon: "https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/Pilar9%2FLogoutWhite.webp?alt=media&token=3ae7fa36-bfdd-4af0-becc-fe0959e019cb",
			activeIcon:
				"https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/Pilar9%2FLogoutYellow.webp?alt=media&token=0a7cf45f-d633-49e0-89cd-9b061d099865",
			onClick: () => {
				logoutFunction();
			},
		},
	];

	return (
		<div className={styles.Sidebar}>
			<div className={styles.Logo}>
				<img
					src={
						"https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/Pilar9%2FLogo.png?alt=media&token=df265a10-e2bb-4352-b9d8-a5dbf3ce5aa7"
					}
					alt="Logo"
					title="Logo"
					height={"100%"}
					width={"100%"}
					loading="eager"
				/>
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
					<span>{pathname === `${item?.Url}` ? <img src={item?.activeIcon} alt="" /> : <img src={item?.icon} alt="" />}</span>
					{item?.name}
				</a>
			))}
		</div>
	);
};

export default Header;
