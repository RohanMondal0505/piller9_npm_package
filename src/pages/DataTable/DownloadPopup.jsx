import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as React from "react";
import { CSVLink } from "react-csv";
import { RxCross2 } from "react-icons/rx";
import CsvIcon from "../../assets/images/CsvIcon.webp";
import DownloadButton from "../../assets/images/DownloadButton.webp";
import PdfIcon from "../../assets/images/PdfIcon.webp";
import styles from "./DownloadPopup.module.scss";
import { formatTimestamp } from "../../components/utils/HelperFunctions";

const DownloadPopup = ({ setOpenDownloadPopup, data, selectedKeys }) => {
	// const headers = [
	// 	{ label: "UniqueID", key: "UniqueID" },
	// 	{ label: "CoListAgentFullName", key: "CoListAgentFullName" },
	// 	{ label: "CoListAgentMlsId", key: "CoListAgentMlsId" },
	// 	{ label: "ListAgentFullName", key: "ListAgentFullName" },
	// 	{ label: "ListAgentMlsId", key: "ListAgentMlsId" },
	// ];
	const headers = selectedKeys.map((key) => ({
		label: key,
		key: key,
	}));

	// Generate PDF
	const handleDownloadPdf = () => {
		const doc = new jsPDF();
		const tableColumn = headers.map((header) => header.label); // Table headers from selectedKeys

		// Map over the data and handle formatting for ModifiedDate
		const tableRows = data.map((row) =>
			headers.map((header) => {
				const value = row[header.key] || "N/A"; // Default value if missing
				// If the key is 'ModifiedDate', format it
				if (header.key === "ModifiedDate") {
					return formatTimestamp(value);
				}
				return value; // Return original value
			})
		);

		// Add title to PDF
		doc.text("Data Table", 14, 15);

		const tableStartY = 20;

		// Add table to PDF
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: tableStartY, // Start table below the title
		});

		// Save the PDF
		doc.save("DataTable.pdf");
	};

	return (
		<div className={styles.DownloadPopup} onClick={() => setOpenDownloadPopup(false)}>
			<div className={styles.Wrapper} onClick={(e) => e.stopPropagation()}>
				<div className={styles.Top}>
					<h3>Download</h3>
					<RxCross2 onClick={() => setOpenDownloadPopup(false)} />
				</div>

				<div className={styles.Box} onClick={handleDownloadPdf}>
					<span>
						<img src={PdfIcon} alt="" />

						<p>Download as PDF </p>
					</span>
					<img src={DownloadButton} alt="" />
				</div>
				<div className={styles.Box}>
					<span>
						<img src={CsvIcon} alt="" />
						<p>
							<CSVLink data={data} headers={headers} filename={"DataTable.csv"}>
								Download as CSV
							</CSVLink>
						</p>
					</span>
					<img src={DownloadButton} alt="" />
				</div>
			</div>
		</div>
	);
};

export default DownloadPopup;
