import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Box,
  Pagination,
  Button, // Import Button component
} from "@mui/material";

interface CodeTableProps {
  data: Array<{ id: number; code: string; date: string; city: string }>;
}

const CodeTable: React.FC<CodeTableProps> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0); // Reset to the first page when searching
  };

  const filteredData = data.filter((row) =>
    row.code.toLowerCase().includes(searchQuery.toLowerCase()) ||  row.city.toLowerCase().includes(searchQuery.toLowerCase()) || row.date.includes(searchQuery)
  );

  const slicedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const downloadData = () => {
    // Format date values as strings (e.g., "yyyy-mm-dd") before creating the CSV data
    const formattedData = filteredData.map((row) => `${row.code},"${row.date}","${row.city}"`);
    const csvData = "Code,Date Created,City\n" + formattedData.join("\n");
  
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div style={{ paddingTop: '10px' }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: "10px" }}
          onClick={downloadData}
        >
          Download Code Data
        </Button>
        <TextField
          label="Search Code"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: "#EEEEEE", color: "black" }}>Code</TableCell>
              <TableCell style={{ backgroundColor: "#EEEEEE", color: "black" }}>Date Created</TableCell>
              <TableCell style={{ backgroundColor: "#EEEEEE", color: "black" }}>City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ padding: "8px", paddingLeft: "16px", paddingRight: "16px" }}>{row.code}</TableCell>
                <TableCell style={{ padding: "8px", paddingLeft: "16px", paddingRight: "16px" }}>{row.date}</TableCell>
                <TableCell style={{ padding: "8px", paddingLeft: "16px", paddingRight: "16px" }}>{row.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.floor(filteredData.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default CodeTable;
