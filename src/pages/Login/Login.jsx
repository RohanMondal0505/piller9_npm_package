import ls from "localstorage-slim";
import { useEffect, useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginAsset } from "../../assets/assetsIndex.jsx";
import { LogoSvg } from "../../assets/svg/SvgIndex";
import axios from "../../components/Hooks/axios";
import Loading from "../../components/Loading/Loading";
import { setUser } from "../../redux/slice/userSlice";
import styles from "./Login.module.scss";

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("user@gmail.com");
	const [password, setPassword] = useState("user@123");

	const handlePasswordToggle = () => {
		setShowPassword(!showPassword);
	};

	const [loading, setLoading] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		axios
			.post(`/user/login`, { email, password })
			.then(({ data }) => {
				console.log(data);
				ls.set("Pilar9_Token_npm_ls", data?.data?.token);
				dispatch(setUser(data?.data?.user));
				axios.defaults.headers.Authorization = data?.data?.token;
				navigate("/user/dashboard");
				toast.success("Login Successfully...");
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message || err?.response?.data?.msg || "Failed to Login...");
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (ls.get("Pilar9_Token_npm_ls")) navigate("/user/dashboard");
	}, []);

	return (
		<div className={styles.Login}>
			<div className={styles.BG}>
				<img src={LoginAsset} alt="Background" width="100%" height="100%" loading="eager" />
			</div>

			<div className={styles.Left}>
				<h1>Welcome To</h1>
				<img src={LogoSvg} alt="Logo" width="100%" height="100%" loading="eager" />
			</div>

			{/* Form Section */}
			<form onSubmit={handleSubmit} className={styles.Form}>
				<h2>Sign In</h2>
				<p>Please fill your detail to Sign In your account.</p>
				<div className={styles.InputWrapper}>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="example@gmail.com"
						required
					/>
				</div>

				<div className={styles.InputWrapper}>
					<label htmlFor="password">Password</label>
					<div className={styles.PasswordField}>
						<input
							type={showPassword ? "text" : "password"}
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
						/>
						<span onClick={handlePasswordToggle} className={styles.Icon}>
							{showPassword ? <FaRegEyeSlash /> : <FaEye />}
						</span>
					</div>
				</div>

				<div className={styles.RememberMe}>
					<label>
						<input type="checkbox" /> Remember me
					</label>
					<a href="/forgot-password" className={styles.ForgotPassword}>
						Forgot Password?
					</a>
				</div>

				{loading ? (
					<button className={styles.SubmitButton}>
						<Loading color="#fff" />
					</button>
				) : (
					<button type="submit" className={styles.SubmitButton}>
						Sign In
					</button>
				)}
			</form>
		</div>
	);
};

export default Login;
