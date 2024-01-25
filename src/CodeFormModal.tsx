import React, { useEffect, useState } from "react";
import {
  Modal,
  Paper,
  TextField,
  Button,
  FormControl,
  Tooltip,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  styled,
  ButtonProps,
  Alert,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
  const [date, setDate] = useState<any>("");
  const [pesCode, setPesCode] = useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  // const [selectedCity, setCity] = useState<string>("");
  const [city, setCity] = useState("");

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
        const dateValue = new Date(date);
        const dateString = `${dateValue.getFullYear()}-${String(
          dateValue.getMonth() + 1
        ).padStart(2, "0")}-${dateValue.getDate()}`;
        let bodyContent = JSON.stringify({
          city: city,
          code: pesCode,
          date: dateString,
        });

        let response = await fetch(
          `${API_BASE_URL}/users/addSingleOTP`,
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

        // onSubmit(city, region, selectedFile);
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
      formData.append("otpList", selectedFile);
      const bearerToken = localStorage.getItem(TOKEN_NAME);
      const headers = new Headers({
        Authorization: `Bearer ${bearerToken}`,
      });
      fetch(`${API_BASE_URL}/users/addOTP`, {
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Date"
                      value={date}
                      onChange={(newValue: any) => setDate(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <TextField
                  label="PES CODE"
                  fullWidth
                  value={pesCode}
                  style={formFieldStyle}
                  onChange={(e) => setPesCode(e.target.value)}
                />
                <TextField
                  label="City"
                  fullWidth
                  value={city}
                  style={formFieldStyle}
                  onChange={(e) => setCity(e.target.value)}
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
            left: "50%",
            transform: "translate(-50%)",
            zIndex: 1301,
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
