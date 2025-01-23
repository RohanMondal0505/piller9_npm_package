import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "../../components/Hooks/axios";
import Loading from "../../components/Loading/Loading";
import { timeAgo } from "../../components/utils/HelperFunctions";
import { setOpenLoadingPopup } from "../../redux/slice/tempSlice";
import styles from "./RequestWidget.module.scss";

const RequestWidget = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const [email, setEmail] = useState(user?.email);
	const [widgetType, setWidgetType] = useState("");
	const [message, setMessage] = useState("");

	// State to store submitted requests, initialized with initial requests
	const [requests, setRequests] = useState([]);

	// State to track expanded requests
	const [expandedRequests, setExpandedRequests] = useState(Object.fromEntries(requests.map((_, index) => [index, false])));

	// Handle form submission
	const [uploading, setUploading] = useState(false);
	const [reload, setReload] = useState(0);
	const handleSubmit = (e) => {
		e.preventDefault();

		setUploading(true);
		axios
			.post(`/requestWidget`, { email, type: widgetType, details: message })
			.then(({ data }) => {
				setEmail("");
				setWidgetType("");
				setMessage("");
				setReload(Math.random());
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message || "Error making widget request...");
			})
			.finally(() => setUploading(false));
	};

	// Toggle Read More / Read Less
	const toggleReadMore = (index) => {
		setExpandedRequests((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	useEffect(() => {
		dispatch(setOpenLoadingPopup(true));
		axios
			.get("/requestWidgets")
			.then(({ data }) => {
				setRequests(data?.requests);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message || err?.res?.data?.msg || "Error fetching requests..");
			})
			.finally(() => dispatch(setOpenLoadingPopup(false)));
	}, [reload]);

	return (
		<div className={styles.RequestWidget}>
			{/* Form Section */}
			<div className={styles.FormContainer}>
				<h2>Request Widget</h2>
				<p>Lorem ipsum dolor sit amet consectetur. Tellus risus ut massa quis vitae viverra aet.</p>
				<form className={styles.Form} onSubmit={handleSubmit}>
					<input
						type="email"
						placeholder="Your Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={styles.Input}
						required
						readOnly
					/>
					<input
						type="text"
						placeholder="Type of Widget"
						value={widgetType}
						onChange={(e) => setWidgetType(e.target.value)}
						className={styles.Input}
						required
					/>
					<textarea
						placeholder="Write Something"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className={styles.Textarea}
						required></textarea>

					{uploading ? (
						<button className={styles.SubmitButton}>
							<Loading color="#fff" />
						</button>
					) : (
						<button type="submit" className={styles.SubmitButton}>
							Submit
						</button>
					)}
				</form>
			</div>

			{/* Submitted Requests Section */}
			<div className={styles.SubmittedRequestsContainer}>
				<h3>Submitted Requests</h3>
				<div className={styles.RequestList}>
					{requests.map((request, index) => (
						<div key={index} className={styles.RequestCard}>
							<div className={styles.Left}>
								<div className={styles.RequestHeader}>
									<h4>{request?.type}</h4>
									<span>{timeAgo(request?.createdAt)}</span>
								</div>
								<p>
									{expandedRequests[index] ? request.details : `${request.details.slice(0, 100)}`}
									{/* Conditionally show "Read More" if message is longer than 100 characters */}
									{request.details.length > 100 && (
										<span className={styles.ReadMore} onClick={() => toggleReadMore(index)}>
											{expandedRequests[index] ? " Show Less" : " ...Read More"}
										</span>
									)}
								</p>
							</div>
							<div className={styles.Status}>
								<span className={styles.StatusIndicator}></span>
								{request.status}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RequestWidget;
