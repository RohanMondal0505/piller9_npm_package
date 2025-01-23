import * as React from "react";
import { useEffect, useState } from "react";
import Property1 from "../../assets/images/Property1.png";
import Property2 from "../../assets/images/Property2.png";
import Property3 from "../../assets/images/Property3.png";
import Property4 from "../../assets/images/Property4.png";
import Property5 from "../../assets/images/Property5.png";
import Property6 from "../../assets/images/Property6.png";
import Property7 from "../../assets/images/Property7.png";
import styles from "./LoadingPopup.module.scss";

const LoadingPopup = () => {
	const [currentImage, setCurrentImage] = useState(0);
	const images = [Property1, Property2, Property3, Property4, Property5, Property6, Property7];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage((prevImage) => (prevImage + 1) % images.length);
		}, 400);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={styles.LoadingPopup}>
			<img src={images[currentImage]} alt="Loading" height={"100%"} width={"100%"} />
		</div>
	);
};

export default LoadingPopup;
