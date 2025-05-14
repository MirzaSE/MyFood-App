import React, { useState } from 'react';
import { Button, TextField, FormControl, Typography, Grid, Link } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const api = axios.create({
  headers: {
    'x-api-version': '1.0'
  }
});

interface UserLogin {
  username: string;
  password: string;
}

interface UserRegister {
  email: string;
  password: string;
  confirmPassword: string;
}

function RegistrationForm() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<UserRegister>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: UserRegister) => {
    try {
      await api.post('/api/account/register', {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      setSuccessMessage('Registration successful! Please login.');
      setErrorMessage('');
    } catch (error) {
      
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && <Typography color="error" gutterBottom>{errorMessage}</Typography>}
      {successMessage && <Typography color="success" gutterBottom>{successMessage}</Typography>}

      <FormControl fullWidth margin="normal">
        <TextField
          {...register('email')}
          id="email"
          label="Email"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('password')}
          id="password"
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('confirmPassword')}
          id="confirmPassword"
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
}

function Login() {
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<UserLogin>();

  const onSubmit = async (data: UserLogin) => {
    try {
      const response = await api.post('/api/account/login', {
        username: data.username,
        password: data.password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      setErrorMessage('');
    } catch (error) {
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && <Typography color="error" gutterBottom>{errorMessage}</Typography>}

      <FormControl fullWidth margin="normal">
        <TextField
          {...register('username', { required: 'Username/Email is required' })}
          id="username"
          label="Username or Email"
          error={!!errors.username}
          helperText={errors.username?.message}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('password', { required: 'Password is required' })}
          id="password"
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
}

function AuthPage() {
  const [activeView, setActiveView] = useState('login');

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', p: 2 }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Food App
        </Typography>
        {activeView === 'login' ? <Login /> : <RegistrationForm />}
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => setActiveView(activeView === 'login' ? 'register' : 'login')}
          >
            {activeView === 'login' 
              ? 'Don\'t have an account? Register now'
              : 'Already have an account? Login here'}
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AuthPage;