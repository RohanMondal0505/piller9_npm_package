function timeAgo(timestamp) {
	const now = new Date();
	const time = new Date(timestamp);
	const diffInMs = now - time;
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInMinutes < 1) {
		return "Just Now";
	} else if (diffInMinutes < 60) {
		return `${diffInMinutes} Min Ago`;
	} else if (diffInHours < 24) {
		return `${diffInHours} Hr Ago`;
	} else {
		return `${diffInDays} Days Ago`;
	}
}


function formatTimestamp(timestamp) {
	const date = new Date(timestamp);

	// Extract date components
	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear();

	// Extract time components
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const amPm = hours >= 12 ? "pm" : "am";

	// Convert to 12-hour format
	hours = hours % 12 || 12;

	// Format the final string
	const formattedDate = `${day} ${month} ${year}`;
	const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}${amPm}`;

	return `${formattedDate}, ${formattedTime}`;
}

export { formatTimestamp, timeAgo };

