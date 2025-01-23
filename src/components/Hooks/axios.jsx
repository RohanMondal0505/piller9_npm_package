import axios from "axios";
import ls from "localstorage-slim";

let token = ls.get("Pilar9_Token_npm_ls");

const Instance = axios.create({
	baseURL: `${ls.get("API_BASE_URL")}/api`,
	headers: {
		Authorization: token,
	},
});

export default Instance;
