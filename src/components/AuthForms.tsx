import React, { useState } from 'react';
import { Button, TextField, FormControl, Typography, Grid, Link } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerUser, loginUser } from '../services/ApiService';

interface UserLogin {
  email: string;
  password: string;
}
interface UserRegister extends UserLogin {
  confirmPassword: string;
}

function RegistrationForm() {
  const validationSchema = yup.object({
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<UserRegister>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: UserRegister) => {
    try {
      await registerUser(data);
      alert('Registration successful! You can now log in.');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('email')}
          id="email"
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message?.toString()}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('password')}
          id="password"
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message?.toString()}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('confirmPassword')}
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message?.toString()}
        />
      </FormControl>
      <Button type="submit" sx={{ marginBottom: '10px' }} variant="contained">
        Register
      </Button>
    </form>
  );
}

function Login({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<UserLogin>();
  const navigate = useNavigate();

  const onSubmit = async (data: UserLogin) => {
    try {
      const result = await loginUser(data);
      localStorage.setItem('token', result.token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('email', { required: true })}
          id="email"
          label="Email"
          className="login-input"
          error={!!errors.email}
          helperText={errors.email?.message?.toString() || ''}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('password', { required: true })}
          id="password"
          label="Password"
          className="login-input"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message?.toString() || ''}
        />
      </FormControl>
      <Button type="submit" sx={{ marginBottom: '10px' }} variant="contained">
        Login
      </Button>
    </form>
  );
}

function AuthPage({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) {
  const [activeView, setActiveView] = useState('login');

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
      sx={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <Typography variant="h5" color="primary" align="center">
          Food App
        </Typography>
        {activeView === 'login' ? (
          <Login setIsAuthenticated={setIsAuthenticated} />
        ) : (
          <RegistrationForm />
        )}
      </Grid>
      <Grid item>
        <Link variant="body2" onClick={() => handleViewChange(activeView === 'login' ? 'register' : 'login')}>
          {activeView === 'login'
            ? 'Your first time on Food App: REGISTER'
            : 'You already have an account: LOG IN'}
        </Link>
      </Grid>
    </Grid>
  );
}

export default AuthPage;
