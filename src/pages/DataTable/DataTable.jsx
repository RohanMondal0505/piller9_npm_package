import * as React from "react";
import axios from "axios";
import ls from "localstorage-slim";
import { useEffect, useState } from "react";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft, FaArrowRight, FaSearch, FaSort } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
import styles from "./DataTable.module.scss";
import "./DataTable.scss";
import DownloadPopup from "./DownloadPopup";

const DataTable = ({ id = "RMAWANIR", pagination }) => {
	const [listings, setListings] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [reload, setReload] = useState(0);
	const rowsPerPage = 10;

	const defaultFields = ["UniqueID", "StandardStatus", "PropertyType", "UnparsedAddress", "City", "ListAgentMlsId"];

	const [selectedKeys, setSelectedKeys] = useState(defaultFields);
	const [isSwitchedOn, setIsSwitchedOn] = useState(false);

	useEffect(() => {
		const fetchListings = () => {
			setLoading(true);
			axios
				.get(`https://paz9f27r6h.execute-api.ca-central-1.amazonaws.com/staging/agent/${id}/myListings`, {
					headers: {
						"X-API-KEY": ls.get("X_API_KEY"),
					},
				})
				.then(({ data }) => {
					setListings(data);
					setFilteredData(data);
				})
				.catch((err) => {
					toast.error("Error loading list agent data ..");
				})
				.finally(() => setLoading(false));
		};

		fetchListings();
	}, [id, reload]);

	// Filter listings based on search query
	useEffect(() => {
		const filtered = listings?.filter((row) =>
			selectedKeys.some((key) => row[key]?.toString().toLowerCase().includes(search.toLowerCase()))
		);
		setFilteredData(filtered);
		setCurrentPage(1);
	}, [search, listings, selectedKeys]);

	// Paginate filtered data
	const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

	const handleSwitchChange = () => {
		setIsSwitchedOn(!isSwitchedOn);
	};

	// Toggle a field in selected keys
	const toggleField = (field) => {
		setSelectedKeys((prevSelected) =>
			prevSelected.includes(field) ? prevSelected.filter((key) => key !== field) : [...prevSelected, field]
		);
	};

	const availableFields = Object.keys(listings[0] || {});

	//download popup
	const [openDownloadPopup, setOpenDownloadPopup] = useState(false);

	if (error) return <p>Error: {error}</p>;

	return (
		<>
			{openDownloadPopup && <DownloadPopup {...{ setOpenDownloadPopup, data: listings }} />}

			<div className={`${styles.container} ${pagination === "hide" ? styles.AutoHeight : ""}`}>
				<div className={styles.SelectField}>
					<select onChange={(e) => toggleField(e.target.value)}>
						<option value="">Manage Fields</option>
						{availableFields.map((field) => (
							<option key={field} value={field} disabled={selectedKeys.includes(field)}>
								{field}
							</option>
						))}
					</select>

					{pagination !== "hide" && (
						<button className={styles.Actions}>
							<BsThreeDotsVertical size={"1.2rem"} onClick={() => setOpenDownloadPopup(true)} />
						</button>
					)}
				</div>

				<div className={styles.KeysToShow}>
					<div className={styles.Left}>
						{selectedKeys.map((item) => (
							<div key={item} className={styles.selectedKey}>
								{item}{" "}
								<span onClick={() => toggleField(item)}>
									<RxCross2 color="#999" size={"1rem"} />
								</span>
							</div>
						))}
					</div>
					<div className={styles.Right}>
						<div className={styles.search}>
							<input
								type="text"
								placeholder="Search..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<FaSearch className={styles.searchIcon} />
						</div>
						<span className={styles.Refresh} onClick={() => setReload(Math.random())}>
							<MdRefresh size={"1.3rem"} />
						</span>
					</div>
				</div>

				<div className={`${styles.TableBox} `}>
					{loading ? (
						<div style={{ marginTop: "5rem" }}>
							<Loading color="#000" />
						</div>
					) : (
						<table className={styles.table}>
							<thead>
								<tr>
									<th>More</th>
									{selectedKeys.map((key) => (
										<th key={key}>
											{key} <FaSort />
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{paginatedData.map((row, index) => (
									<tr key={index}>
										<td>
											<BsThreeDots />
										</td>
										{selectedKeys.map((key) => (
											<td key={key} className={`Key_${key}`}>
												<span className={row[key] === "A" ? "Active" : ""}>{row[key] ?? "N/A"}</span>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>

				<div className={styles.pagination}>
					<div className={styles.Top}>
						<span>
							Showing rows {(currentPage - 1) * rowsPerPage + 1} to{" "}
							{Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}
						</span>
						<div className={styles.SwitchContainer}>
							<div className={styles.SwitchLabel}>Brokerage Listings</div>
							<label className={styles.Switch}>
								<input type="checkbox" checked={isSwitchedOn} onChange={handleSwitchChange} />
								<span className={styles.Slider}></span>
							</label>
						</div>
					</div>

					<div className={styles.pageNumbers}>
						<div
							className={styles.Arrow}
							onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
							style={{ marginRight: "1rem" }}>
							<FaArrowLeft color="#e6d366" size={"1.2rem"} />
						</div>
						{[...Array(Math.ceil(filteredData.length / rowsPerPage)).keys()].map((page) => (
							<button
								key={page}
								className={currentPage === page + 1 ? styles.activePage : ""}
								onClick={() => setCurrentPage(page + 1)}>
								{page + 1}
							</button>
						))}
						<div
							className={styles.Arrow}
							onClick={() =>
								setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredData.length / rowsPerPage)))
							}
							style={{ marginLeft: "1rem" }}>
							<FaArrowRight color="#e6d366" size={"1.2rem"} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DataTable;
