import React, { useEffect, useState } from "react";
import { Alert, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo"; // Import the Logo component
import { API_BASE_URL, TOKEN_NAME } from "./const";
import "./index.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(TOKEN_NAME)) {
      navigate("/dashboard");
    }
  }, []);
  const handleLogin = async () => {
    setMessage("");
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    let bodyContent = JSON.stringify({ email: username, password: password });
    let response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    let encodedData = await response.text();
    const data: any = JSON.parse(atob(encodedData));
    if (data.statusCode === 200) {
      localStorage.setItem(TOKEN_NAME, data.token);
      navigate("/dashboard");
    } else {
      setMessage(data.message.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Logo />

      <div>
        <Typography variant="h4"></Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          style={{ marginTop: "20px" }}
        >
          Login
        </Button>
        <div className="toast-message">
          {message && <Alert severity="error">{message}</Alert>}
        </div>
      </div>
    </Container>
  );
};

export default Login;
