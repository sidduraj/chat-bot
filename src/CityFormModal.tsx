import React, { useEffect, useState } from "react";
import {
  Modal,
  Paper,
  TextField,
  Button,
  FormControl,
  Tooltip,
  IconButton,
  styled,
  ButtonProps,
  Alert,
} from "@mui/material";
import { API_BASE_URL, TOKEN_NAME } from "./const";

import { amber } from "@mui/material/colors";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";

interface CityFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (city: string, region: string, file: File | null) => void;
}

const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const paperStyle = {
  width: "33%",
  minWidth: "250px",
  maxWidth: "300px",
};
const uploadButtonStyle = {
  display: "flex",
  alignItems: "center",
  padding: "2em", // Add padding as needed
  border: "1px dashed #ccc", // Add a dotted border
  borderRadius: "4px", // Add border radius as needed
};
const formFieldStyle = {
  marginTop: "10px",
};

const CityFormModal: React.FC<CityFormModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [message, setMessage] = useState<string>("");
  const [isSucess, setIsSuccess] = useState<boolean>(false);
  const [tabValue, setTabValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const MESSAGE_TIMEOUT = 2000;

  const handleSubmit = async (type: string) => {
    try {
      if (type === "single") {
      const bearerToken = localStorage.getItem(TOKEN_NAME);
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        };

        let bodyContent = JSON.stringify({ city, region });

        let response = await fetch(
          `${API_BASE_URL}/users/addSingleCity`,
          {
            method: "POST",
            body: bodyContent,
            headers: headersList,
          }
        );

        let dataEncoded = await response.text();
        const data: any = JSON.parse(atob(dataEncoded));
        setMessage(data.message);
        if (data.statusCode === 200) {
          setIsSuccess(true);
        }
      } else {
        handleUpload();
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Please try again later");
    }

    // onClose();
  };

  useEffect(() => {
    if (message) {
      const timer1 =  setTimeout(() => {
        setMessage("");
        if(isSucess){
          window.location.reload();
        }
      }, MESSAGE_TIMEOUT);

      return () => {
        clearTimeout(timer1);
      };
    }
  }, [message, isSucess]);

  const handleCapture = ({ target }: any) => {
    setSelectedFile(target.files[0]);
  };

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(amber[500]),
    backgroundColor: amber[500],
    "&:hover": {
      backgroundColor: amber[700],
    },
  }));

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("cityList", selectedFile);
      const bearerToken = localStorage.getItem(TOKEN_NAME);
      const headers = new Headers({
        Authorization: `Bearer ${bearerToken}`,
      });
      fetch(`${API_BASE_URL}/users/addCity`, {
        method: "POST",
        body: formData,
        headers: headers,
      })
        .then((response) => response.text())
        .then((encodedData) => {
          const data = JSON.parse(atob(encodedData));
          if (data.statusCode === 200) {
            setMessage(data.message);
            setIsSuccess(true);
          } else {
            console.log(data.message);
            setMessage(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsSuccess(false);
          setMessage("There was some issue please try after some time");
        });
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} style={modalStyle}>
        <Paper style={paperStyle}>
          <div style={{ padding: "0 20px 0" }}>
            <h2>Fill in the details</h2>
          </div>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Single" value="1" />
                <Tab label="Bulk" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <form>
                <TextField
                  label="City"
                  fullWidth
                  style={formFieldStyle}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />

                <TextField
                  label="Region"
                  fullWidth
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={formFieldStyle}
                />

                <ColorButton
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleSubmit("single")}
                  style={formFieldStyle}
                >
                  Submit
                </ColorButton>
              </form>
            </TabPanel>
            <TabPanel value="2">
              <form>
                <FormControl fullWidth style={formFieldStyle}>
                  <input
                    accept=".csv"
                    id="faceImage"
                    style={{ visibility: "hidden", height: "0" }}
                    type="file"
                    onChange={handleCapture}
                  />
                  <Tooltip title="UPLOAD CSV">
                    <label htmlFor="faceImage">
                      <IconButton
                        style={uploadButtonStyle}
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                      >
                        <UploadFileIcon fontSize="large" />
                      </IconButton>
                    </label>
                  </Tooltip>
                </FormControl>

                <ColorButton
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleSubmit("bulk")}
                  style={formFieldStyle}
                >
                  Submit
                </ColorButton>
              </form>
            </TabPanel>
          </TabContext>
        </Paper>
      </Modal>
      {message && (
        <Alert
          style={{
            position: "fixed",
            bottom: "10px",
            // width: "116px",
            left:'50%',
            transform: "translate(-50%)",
            zIndex: 1301
          }}
          severity={isSucess ? "success" : "error"}
        >
          {message}
        </Alert>
      )}
    </>
  );
};

export default CityFormModal;
