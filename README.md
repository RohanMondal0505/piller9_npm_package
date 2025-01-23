# Demo variables

```
const token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDA3ZjQxYmM4YzIxZmY3MDFiYTNiYiIsImV4cCI6MTc2OTE1MzgxMiwiaWF0IjoxNzM3NjE3ODEyfQ.S9yHmZD0q9JLANRoQ1fQN0qWtffHTXCr7oyC20bFzDw";
const user = {
	profilePic:
		"https://firebasestorage.googleapis.com/v0/b/file-upload-demo-213de.appspot.com/o/defaultAvatar.jpg?alt=media&token=56f59056-fc87-47cb-9f42-98f8406f892a",
	_id: "67407f41bc8c21ff701ba3bb",
	name: "Test User",
	email: "user@gmail.com",
	password: "$2a$08$KpFEw.oUYKvZp/v8Rr0HNeQv/QujkWpLHDKQcFZSvw1RK4fuNIWe.",
	isActive: true,
	isDeleted: false,
	createdAt: "2024-11-22T12:55:29.345Z",
	updatedAt: "2024-11-22T13:05:38.716Z",
	__v: 0,
	userName: "user191283",
};

const X_API_KEY = "tOKMV0hOEK3B8vrsjVk9B2TWpRgOKTyT2f7C6qT0";
const API_BASE_URL = "https://pilar9-backend.vercel.app";
```

```
import ls from "localstorage-slim"; // import this

<!--  login time set this value -->
ls.set("Pilar9_Token_npm_ls", token);
ls.set("Pillar9_user_npm_ls", user);
ls.set("X_API_KEY", X_API_KEY);
ls.set("API_BASE_URL", API_BASE_URL);

```

# Import like this & use

```
import { App } from "piller9_npm_user";

const Component = () => {

	return (
		<App token={token} user={user} X_API_KEY={X_API_KEY} API_BASE_URL={API_BASE_URL} />
	);
};

export default Component;

```

# Use this dependencies & devDependencies in your react vite code 
```
"dependencies": {
		"react": "^18.3.1",
		"react-dom": "^18.3.1",
		"react-router-dom": "^6.24.0",
		"@reduxjs/toolkit": "^2.2.6",
		"@vitejs/plugin-react-swc": "^3.7.1",
		"axios": "^1.7.8",
		"html2canvas": "^1.4.1",
		"jspdf": "^2.5.2",
		"jspdf-autotable": "^3.8.4",
		"localstorage-slim": "^2.7.1",
		"react-csv": "^2.2.2",
		"react-grid-layout": "^1.5.0",
		"react-icons": "^5.3.0",
		"react-loader-spinner": "^6.1.6",
		"react-redux": "^9.1.2",
		"react-toastify": "^10.0.5",
		"sass": "^1.77.6",
		"sweetalert2": "^11.14.5",
		"vite-plugin-svgr": "^4.3.0"
	},
	"devDependencies": {
		"@types/react": "^18.3.3",
		"@types/react-dom": "^18.3.0",
		"@vitejs/plugin-react": "^4.3.1",
		"eslint": "^8.57.0",
		"eslint-plugin-react": "^7.34.2",
		"eslint-plugin-react-hooks": "^4.6.2",
		"eslint-plugin-react-refresh": "^0.4.7",
		"vite": "^5.3.1"
	}
```
