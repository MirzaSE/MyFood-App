import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  Typography,
  Grid,
  Link,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  loginUser,
  registerTransformToServerData,
  registerUser,
} from "../services/ApiService";
import { useNavigate } from "react-router-dom";

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  confirmPassword: string;
  email: string;
}

const registrationSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm password is required"),
});

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegister>({
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit = async (data: UserRegister) => {
    setError(null);
    try {
      await registerUser(registerTransformToServerData(data));
      navigate("/login");
    } catch (e: any) {
      setError(e.response?.data || "Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
        Register
      </Button>
    </form>
  );
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>();

  const onSubmit = async (data: UserLogin) => {
    setError(null);
    try {
      await loginUser(data);
      navigate("/");
    } catch (e: any) {
      setError(e.response?.data || "Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormControl fullWidth margin="normal">
        <TextField
          {...register("username", { required: "Username is required" })}
          label="Username"
          error={!!errors.username}
          helperText={errors.username?.message}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          {...register("password", { required: "Password is required" })}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </FormControl>

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
        Login
      </Button>
    </form>
  );
};

const AuthPage: React.FC = () => {
  const [activeView, setActiveView] = useState<"login" | "register">("login");

  const handleToggleView = () => {
    setActiveView((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", p: 2 }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Food App
        </Typography>

        {activeView === "login" ? <LoginForm /> : <RegistrationForm />}

        <Typography textAlign="center" mt={2}>
          <Link
            component="button"
            variant="body2"
            onClick={handleToggleView}
          >
            {activeView === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AuthPage;