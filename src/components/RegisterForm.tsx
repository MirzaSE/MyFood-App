// src/components/RegisterForm.tsx
import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { register } from "../services/authService"; // Import the register function

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register(username, password); // Call register API from authService
      setSuccess("User created successfully!");
      setError("");
    } catch (err) {
      setError("User creation failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4">Register</Typography>
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
      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleRegister}
      >
        Register
      </Button>
    </Container>
  );
};

export default RegisterForm;
