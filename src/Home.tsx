import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableFooter,
  TablePagination,
  TextField,
  TableCell,
  TableHead,
  Button,
  TableRow,
  Card,
  CardContent,
  Box,
  Typography,
  Tab,
  Tabs,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Container,
  Pagination,
  IconButton,
  useTheme
} from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Logo from "./Logo";
import { API_BASE_URL, TOKEN_NAME } from "./const";
import { useNavigate } from "react-router-dom";
import API from "./api";

const contentStyle = {
  marginLeft: "200px", // Should match the width of the side drawer
  width: "calc(100vw - 250px)",
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}


interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}


 interface phoneRow {
  unicodes: string;
  wintypes: string;
  upi: string;
  trump: string;
  dateTime: string;

}
export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [SearchCode, setSearchCode] = React.useState("");
  const [SearchContact, setSearchContact] = React.useState("");
  const [SearchIP, setSearchIP] = React.useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState<phoneRow[]>([])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const block = (ip: string) => {
    alert("block called" + ip);
  };

  const unBlock = (ip: string) => {
    alert("un-block called" + ip);
  };

  const filteredIPData = [
    { address: "127.12.234.23" },
    { address: "1.0.0.0" },
    { address: "0.0.0.0" },
  ].filter((item) => item.address.includes(SearchIP));

  useEffect(() => {
    API.createUser();
  }, []);

  return (
    <div className="App">
      <Drawer open={drawerOpen} variant="persistent">
        {/*<Logo height={50} />*/}
        <List>
          <div
            key={"logout"}
            style={{
              position: "fixed",
              left: "2em",
              bottom: "2em",
              cursor: "pointer",
            }}
          >
            <div
              onClick={() => {
                localStorage.removeItem(TOKEN_NAME);
                navigate("/");
              }}
            >
              Log out
            </div>
          </div>
        </List>
        {/* Add your Drawer content here */}
        <Paper
          style={{ backgroundColor: "#003CB0", height: "100%", width: "200px" }}
        >
          <Logo height={50} />
          <List>
            <Box display="flex" justifyContent="center" mb={2}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
                onClick={(e) => handleTabChange(e, 0)}
              >
                Phone Number
              </Button>
            </Box>

            <Box display="flex" justifyContent="center" mb={2}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
                onClick={(e) => handleTabChange(e, 1)}
              >
                Unique Code
              </Button>
            </Box>
            <Box display="flex" justifyContent="center" mb={2}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
                onClick={(e) => handleTabChange(e, 2)}
              >
                IP Address
              </Button>
            </Box>

            <div
              key={"logout"}
              style={{
                position: "fixed",
                left: "2em",
                bottom: "2em",
                cursor: "pointer",
              }}
            >
              <div
                onClick={() => {
                  localStorage.removeItem(TOKEN_NAME);
                  navigate("/");
                }}
              >
                Log out
              </div>
            </div>
          </List>
        </Paper>
      </Drawer>
      <Container style={contentStyle}>
        {tabValue === 0 && (
          <>
            <div>
              <Box
                display="flex"
                justifyContent="flex-start"
                mb={2}
                sx={{ paddingTop: 2 }}
              >
                <TextField
                  id="outlined-controlled"
                  label="Search Contact"
                  value={SearchContact}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchContact(event.target.value);
                  }}
                />
                <Button variant="contained" onClick={()=> {
                  setRows([{ unicodes: "Sid", wintypes: "123123123123", upi:"asdf",trump:"asdfa",dateTime:"asdfa" }])
                }}>Contained</Button>
              </Box>


              <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>unicodes</TableCell>
            <TableCell align="right">Win Types</TableCell>
            <TableCell align="right">upi</TableCell>
            <TableCell align="right">trump</TableCell>
            <TableCell align="right">date and time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
                  rows.map((row) => (
            <TableRow
              key={row.unicodes}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.unicodes}
              </TableCell>
              <TableCell align="right">{row.wintypes}</TableCell>
              <TableCell align="right">{row.upi}</TableCell>
              <TableCell align="right">{row.trump}</TableCell>
              <TableCell align="right">{row.dateTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >

              </div>
            </div>
          </>
        )}
        {tabValue === 1 && (
          <>
            <div>
              <Box display="flex" mb={2} sx={{ paddingTop: 2 }}>
                <TextField
                  id="outlined-controlled"
                  label="Search Code"
                  value={SearchCode}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchCode(event.target.value);
                  }}
                />
              </Box>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { code: "SDFDF12A", dateCreated: "12/12/2024" },
                  { code: "TYUDF12A", dateCreated: "12/12/2024" },
                  { code: "FGJAS12A", dateCreated: "12/12/2024" },
                  { code: "AASDF12A", dateCreated: "12/12/2024" },
                ]
                  .filter((codeItem) => codeItem.code.includes(SearchCode))
                  .map((codeItem) => {
                    return (
                      <Card
                        variant="outlined"
                        style={{
                          margin: "0 1rem 1rem 0",
                          padding: "1rem",
                          minWidth: "20rem",
                        }}
                      >
                        <CardContent>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            Code: {codeItem.code}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Date Created: {codeItem.dateCreated}
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </>
        )}
        {tabValue === 2 && (
          <>
            <div>
              <Box display="flex" mb={2} sx={{ paddingTop: 2 }}>
                <TextField
                  label="Search IP"
                  value={SearchIP}
                  onChange={(e) => setSearchIP(e.target.value)}
                  variant="outlined"
                />
              </Box>

              <TableContainer
                component={Paper}
                sx={{ justifyContent: "center" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{ backgroundColor: "#EEEEEE", color: "black" }}
                      >
                        Random
                      </TableCell>
                      <TableCell
                        style={{ backgroundColor: "#EEEEEE", color: "black" }}
                      >
                        IP
                      </TableCell>
                      <TableCell
                        style={{ backgroundColor: "#EEEEEE", color: "black" }}
                      ></TableCell>
                      <TableCell
                        style={{ backgroundColor: "#EEEEEE", color: "black" }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredIPData
                      //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index: unknown) => (
                        <TableRow key={row.address}>
                          <TableCell
                            style={{
                              padding: "8px",
                              paddingLeft: "16px",
                              paddingRight: "16px",
                            }}
                          >
                            1213
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "8px",
                              paddingLeft: "16px",
                              paddingRight: "16px",
                            }}
                          >
                            {row.address}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => block(row.address)}
                            >
                              Block
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => unBlock(row.address)}
                            >
                              Un-Block
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
