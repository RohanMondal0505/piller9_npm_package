import React from "react";
import styles from "./Page404.module.scss";

const Page404 = () => {
	return (
		<>
			<div className={styles.Page404}>
				<h1>404</h1>

				<p>Oops! Page not found.</p>

				<p>
					It seems like you're lost. Let's get you <a href="/">back home</a>.
				</p>
			</div>
		</>
	);
};

export default Page404;
