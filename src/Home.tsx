import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableBody,
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
} from "@mui/material";
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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [SearchCode, setSearchCode] = React.useState("");
  const [SearchContact, setSearchContact] = React.useState("");
  const [SearchIP, setSearchIP] = React.useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

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
              </Box>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {[{ name: "Sid", phone: "123123123123" }]
                  .filter(
                    (contact) =>
                      contact.name
                        .toLowerCase()
                        .includes(SearchContact.toLowerCase()) ||
                      contact.phone.includes(SearchContact)
                  )
                  .map((contact) => {
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
                            {contact.name}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {contact.phone}
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}
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
