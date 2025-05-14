// src/components/LoginForm.tsx
import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { login } from "../services/authService"; // Import the login function

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const loginData = { username, password };

    try {
      const response = await login(username, password); // Call login API from authService
      localStorage.setItem("jwt_token", response.token); // Store JWT token
      window.location.href = "/dashboard"; // Redirect to dashboard (or any protected route)
    } catch (err) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4">Login</Typography>
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
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleLogin}
      >
        Login
      </Button>
    </Container>
  );
};

export default LoginForm;
