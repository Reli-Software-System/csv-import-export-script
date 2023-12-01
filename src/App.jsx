import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

const App = () => {
	const [csvData, setCsvData] = useState([]);

	const handleImport = async (event) => {
		const file = event.target.files[0];
		if (file) {
			try {
				const text = await readFile(file);
				const parsedData = parseCSV(text);
				setCsvData(parsedData);
			} catch (error) {
				console.error("Error reading or parsing the CSV file:", error);
			}
		}
	};

	const readFile = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => resolve(event.target.result);
			reader.onerror = (error) => reject(error);
			reader.readAsText(file);
		});
	};

	const parseCSV = (text) => {
		const lines = text.split("\n");
		const headers = lines[0].split(",").map((header) => header.trim());
		const data = [];
		for (let i = 1; i < lines.length; i++) {
			const values = lines[i].split(",").map((value) => value.trim());
			if (values.length === headers.length) {
				const entry = {};
				for (let j = 0; j < headers.length; j++) {
					entry[headers[j]] = values[j];
				}
				data.push(entry);
			}
		}

		return data;
	};

	const handleExport = () => {
		if (csvData) {
			const csvContent = generateCsvContent(csvData);
			const blob = new Blob([csvContent], {
				type: "text/csv;charset=utf-8;",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = "window-pricing.csv";
			link.click();
		}
	};

	const generateCsvContent = (data) => {
		const headers = Object.keys(data[0]).join(",");
		const rows = data
			.map((entry) => Object.values(entry).join(","))
			.join("\n");
		return `${headers}\n${rows}`;
	};

	return (
		<section className="container">
			<div className="row justify-end">
				<div className="row">
					<button onClick={handleExport}>Export</button>
					<input type="file" onChange={handleImport} label="Import" />
				</div>
			</div>
			<DataGrid
				autoHeight
				rows={csvData.map((row, id) => ({
					...row,
					id,
				}))}
				columns={[
					{
						field: "Color",
						headerName: "Color",
						width: 150,
					},
					{
						field: "Grid",
						headerName: "Grid",
						width: 150,
					},
					{
						field: "Dimension Class",
						headerName: "Dimension Class",
						width: 150,
					},
					{
						field: "Job Type",
						headerName: "Job Type",
						width: 150,
					},
					{
						field: "Is Stack",
						headerName: "Is Stack",
						width: 150,
					},
					{
						field: "Opening Type",
						headerName: "Opening Type",
						width: 150,
					},
					{
						field: "Tempered",
						headerName: "Tempered",
						width: 150,
					},
					{
						field: "Privacy",
						headerName: "Privacy",
						width: 150,
					},
					{
						field: "PPUI",
						headerName: "PPUI",
						width: 150,
					},
				]}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 25,
						},
					},
				}}
				pageSizeOptions={[10, 25, 50, 100]}
			/>
		</section>
	);
};

export default App;
