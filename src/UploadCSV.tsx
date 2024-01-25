// src/components/UploadCSV.tsx
import React, { useState } from "react";
import { Alert, Button, Container, Typography } from "@mui/material";
import Logo from "./Logo"; // Import the Logo component
import { API_BASE_URL, TOKEN_NAME } from "./const";
import './index.css'

const UploadCSV: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isSucess, setIsSuccess] = useState<boolean>(false);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('otpList', selectedFile);
      const bearerToken = localStorage.getItem(TOKEN_NAME)
      const headers = new Headers({
        'Authorization': `Bearer ${bearerToken}`,
      });
      fetch(`${API_BASE_URL}/users/addOTP`, {
        method: 'POST',
        body: formData,
        headers: headers, 

      })
        .then((response) => response.json())
        .then((encodedData) => {
          const data = JSON.parse(atob(encodedData));
          if(data.statusCode === 200){
            setMessage(data.message);
            setIsSuccess(true)
          } else {
           setMessage(data.message);
           }
        })
        .catch((error) => {
          console.error('Error:', error);
          setMessage('There was some issue please try after some time');
        });

    }
  };

  return (
    <Container maxWidth="sm">
    <Logo /> 
      <div>
        <Typography variant="h4">Upload CSV File</Typography>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ marginTop: "20px" }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
          style={{ marginTop: "20px" }}
        >
          Upload
        </Button>
        <div className="toast-message">

        {message &&  <Alert severity={isSucess?"success": "error"}>{message}</Alert>}
        </div>
      </div>
    </Container>
  );
};

export default UploadCSV;
