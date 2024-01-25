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

interface CityTableProps {
  data: Array<{ id: number; name: string; region: string }>;
}

const CityTable: React.FC<CityTableProps> = ({ data }) => {
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

  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadData = () => {
    const csvData = "City,Region\n" + filteredData.map((row) => `${row.name},${row.region}`).join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "city_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: "10px" }}
          onClick={downloadData}
        >
          Download City Data
        </Button>
        <TextField
          label="Search City"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: "#EEEEEE", color: "black" }}>City</TableCell>
              <TableCell style={{ backgroundColor: "#EEEEEE", color: "black" }}>Region</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell style={{ padding: "8px", paddingLeft: "16px", paddingRight: "16px" }}>
                    {row.name}
                  </TableCell>
                  <TableCell style={{ padding: "8px", paddingLeft: "16px", paddingRight: "16px" }}>
                    {row.region}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default CityTable;
