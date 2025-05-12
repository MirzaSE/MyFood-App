import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  Typography,
  Grid,
  Link,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser, loginUser } from "../services/ApiService";
import { useNavigate } from "react-router-dom";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

function RegistrationForm() {
  const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerUser(data);
      alert("Registration successful! You can now log in.");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("username")}
          label="Username"
          error={!!errors.username}
          helperText={errors.username?.message}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("email")}
          label="Email"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("password")}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("confirmPassword")}
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
      </FormControl>
      <Grid container justifyContent="center">
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Register
        </Button>
      </Grid>
    </form>
  );
}

function Login() {
  const loginSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LoginData) => {
    try {
      const result = await loginUser(data);
      localStorage.setItem("token", result.token);
      console.log("Login successful!", result);
      navigate("/foods");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("email")}
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("password")}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </FormControl>
      <Grid container justifyContent="center">
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </Grid>
    </form>
  );
}

function AuthPage() {
  const [activeView, setActiveView] = useState("login");

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2, width: 350 }}>
        <Typography variant="h5" color="primary" align="center" gutterBottom>
          Welcome to Food App
        </Typography>
        {activeView === "login" ? <Login /> : <RegistrationForm />}
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() =>
              handleViewChange(activeView === "login" ? "register" : "login")
            }
          >
            {activeView === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Log in"}
          </Link>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default AuthPage;
