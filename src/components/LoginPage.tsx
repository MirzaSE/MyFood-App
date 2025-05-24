import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  Typography,
  Grid,
  Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface UserLogin {
  username: string;
  password: string;
}
interface UserRegister extends UserLogin {
  confirmPassword: string;
}

function RegistrationForm() {
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
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
  } = useForm<UserRegister>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: UserRegister) => {
    try {
      const { confirmPassword, ...registerData } = data;

      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }

      const result = await response.json();
      console.log("Registration successful:", result);
      setRegisterError("");
      setRegisterSuccess("Registration successful! You can now log in.");
    } catch (error) {
      console.error("Error during registration:", error);
      setRegisterError(
        error instanceof Error
          ? error.message
          : "An error occurred during registration."
      );
      setRegisterSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("username", { required: true })}
          id="username"
          label="Username"
          error={!!errors.username}
          helperText={errors.username?.message?.toString()}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("password", { required: true })}
          id="password"
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message?.toString()}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("confirmPassword", { required: true })}
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message?.toString()}
        />
      </FormControl>
      {registerError && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {registerError}
        </Typography>
      )}
      {registerSuccess && (
        <Typography color="success.main" variant="body2" sx={{ mb: 1 }}>
          {registerSuccess}
        </Typography>
      )}
      <Button type="submit" sx={{ marginBottom: "10px" }} variant="contained">
        Register
      </Button>
    </form>
  );
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>();
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data: UserLogin) => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const result = await response.json();
      console.log("Login successful:", result);
      setLoginError("");
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError(
        error instanceof Error
          ? error.message
          : "An error occurred during login."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("username", { required: true })}
          id="username"
          label="Username"
          className="login-input"
          error={!!errors.username}
          helperText={errors.username?.message?.toString() || ""}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register("password", { required: true })}
          id="password"
          label="Password"
          className="login-input"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message?.toString() || ""}
        />
      </FormControl>
      {loginError && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {loginError}
        </Typography>
      )}
      <Button type="submit" sx={{ marginBottom: "10px" }} variant="contained">
        Login
      </Button>
    </form>
  );
}
function AuthPage() {
  const [activeView, setActiveView] = useState("login"); // Initial view state

  const handleViewChange = (view: string) => {
    setActiveView(view);

    if ("login") console.log(view);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <Typography variant="h5" color="primary" align="center">
          Food App
        </Typography>
        {activeView === "login" ? <Login /> : <RegistrationForm />}
      </Grid>
      <Grid item>
        <Link
          variant="body2"
          onClick={() =>
            handleViewChange(activeView === "login" ? "register" : "login")
          }
        >
          {activeView === "login"
            ? "Still not using Food App: REGISTER"
            : "I have an account: LOG IN"}
        </Link>
      </Grid>
    </Grid>
  );
}

export default AuthPage;
