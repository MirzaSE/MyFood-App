import React, { useState } from "react";
import { Button, TextField, Grid, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { loginUser, registerUser } from "../services/ApiService";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData extends LoginFormData {
  fullName: string;
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (isLogin) {
        await loginUser({ email: data.email, password: data.password });
        navigate("/");
      } else {
        await registerUser(data);
        setIsLogin(true);
        alert("Registration successful! Please login.");
      }
    } catch (error) {
      alert(
        isLogin
          ? "Login failed. Please check your credentials."
          : "Registration failed. The email might be already registered."
      );
      console.error(error);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={10} sm={6} md={4}>
        <Typography variant="h4" align="center" gutterBottom>
          {isLogin ? "Login" : "Register"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <TextField
              {...register("fullName", { required: !isLogin })}
              label="Full Name"
              fullWidth
              margin="normal"
              required={!isLogin}
              error={!!errors.fullName}
              helperText={errors.fullName && "Full name is required"}
            />
          )}
          <TextField
            {...register("email", { required: true })}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email && "Email is required"}
          />
          <TextField
            {...register("password", { required: true })}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            error={!!errors.password}
            helperText={errors.password && "Password is required"}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{ marginTop: 16 }}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>
        <Link
          component="button"
          variant="body2"
          onClick={() => setIsLogin(!isLogin)}
          style={{ display: "block", textAlign: "center", marginTop: 16 }}
        >
          {isLogin ? "Need to register?" : "Already have an account?"}
        </Link>
      </Grid>
    </Grid>
  );
}
