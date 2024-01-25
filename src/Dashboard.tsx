import React, { useState, useEffect } from "react";
import {
  Container,
  Tab,
  Tabs,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";

import CityTable from "./CityTable";
import CodeTable from "./CodeTable";
import { Add } from "@mui/icons-material";
import CityFormModal from "./CityFormModal";
import CodeFormModal from "./CodeFormModal";
import Logo from "./Logo";
import { API_BASE_URL, TOKEN_NAME } from "./const";
import {useNavigate} from "react-router-dom"

const contentStyle = {
  marginLeft: "200px", // Should match the width of the side drawer
  width: "calc(100vw - 250px)",
};

function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [cityFormModalOpen, setCityFormModalOpen] = useState(false);
  const [codeFormModalOpen, setCodeFormModalOpen] = useState(false);
  const [cityData, setCityData] = useState<any[]>([]);
  const [codeData, setCodeData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCity();
    fetchCodes();
  }, []);

  const fetchCity = async () => {
    const bearerToken = localStorage.getItem(TOKEN_NAME);
    let headersList = {
      Accept: "*/*",
      Authorization:
        `Bearer ${bearerToken}`,
    };
    let response = await fetch(
      `${API_BASE_URL}/users/getCity`,
      {
        method: "POST",
        headers: headersList,
      }
    );

    let encodedData = await response.text();
    const data = JSON.parse(atob(encodedData));
    setCityData(data.data);
  };

  const fetchCodes = async () => {
    const bearerToken = localStorage.getItem(TOKEN_NAME);
    let headersList = {
      Accept: "*/*",
      Authorization:
        `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    };

    // Define your body content
    // let bodyContent = JSON.stringify({
    //   date: "2023-08-08",
    // });

    let response = await fetch(
      `${API_BASE_URL}/users/getOTP`,
      {
        method: "POST",
        headers: headersList,
        //
        // body: bodyContent,
        // Set the body content here
      }
    );

    let encodedData = await response.text();
    const data = JSON.parse(atob(encodedData));
    setCodeData(data.data);
  };
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenCityFormModal = () => {
    setCityFormModalOpen(true);
  };

  const handleCloseCityFormModal = () => {
    setCityFormModalOpen(false);
  };

  const handleOpenCodeFormModal = () => {
    setCodeFormModalOpen(true);
  };

  const handleCloseCodeFormModal = () => {
    setCodeFormModalOpen(false);
  };

  const handleCitySubmitModal = (
    city: string,
    region: string,
    file: File | null
  ) => {
    // Handle the form submission here
    console.log("City:", city);
    console.log("Region:", region);
    console.log("File:", file);
    // You can add logic to send the data to your backend or perform other actions.
  };

  const handleCodeSubmitModal = (
    date: string,
    pesCode: string,
    file: File | null
  ) => {
    // Handle the form submission here
    console.log("date:", date);
    console.log("pesCode:", pesCode);
    console.log("File:", file);
    // You can add logic to send the data to your backend or perform other actions.
  };

  return (
    <div className="App">
      <Drawer open={drawerOpen} variant="persistent">
        <Logo height={50} />
        <List>
          <ListItem key={"ADD CITY"} disablePadding>
            <ListItemButton onClick={handleOpenCityFormModal}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary={"ADD CITY"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"ADD PES CODE"} disablePadding>
            <ListItemButton onClick={handleOpenCodeFormModal}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary={"ADD PES CODE"} />
            </ListItemButton>
          </ListItem>
          <div key={"logout"} style={{position: 'fixed', left: '2em', bottom: '2em', cursor:'pointer'}}>
            <div
              onClick={() => {
                localStorage.removeItem(TOKEN_NAME);
                navigate('/');

              }}
            >Log out
            </div>
          </div>
        </List>
      </Drawer>
      <Container style={contentStyle}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="CITIES" />
          <Tab label="PES CODES" />
        </Tabs>
        {tabValue === 0 && <CityTable data={cityData} />}
        {tabValue === 1 && <CodeTable data={codeData} />}
      </Container>
      <CityFormModal
        open={cityFormModalOpen}
        onClose={handleCloseCityFormModal}
        onSubmit={handleCitySubmitModal}
      />
      <CodeFormModal
        open={codeFormModalOpen}
        onClose={handleCloseCodeFormModal}
        onSubmit={handleCodeSubmitModal}
      />
    </div>
  );
}

export default Dashboard;
