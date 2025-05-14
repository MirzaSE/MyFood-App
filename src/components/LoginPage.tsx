import React, { useState } from 'react';
import { Button, TextField, FormControl, Typography, Grid, Link } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

interface UserLogin {
  username: string;
  password: string;
}

interface UserRegister extends UserLogin {
  confirmPassword: string;
}

function RegistrationForm({ setActiveView }: { setActiveView: (view: string) => void }) {
  const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<UserRegister>({
    resolver: yupResolver(validationSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: UserRegister) => {
    setLoading(true);
    try {
      await axios.post('https://localhost:27813/api/account/register', data);
      alert('Registration successful!');
      setActiveView('login');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('username', { required: true })}
          id="username"
          label="Username"
          error={!!errors.username}
          helperText={errors.username?.message?.toString()}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('password', { required: true })}
          id="password"
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message?.toString()}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('confirmPassword', { required: true })}
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message?.toString()}
        />
      </FormControl>
      <Button type="submit" sx={{ marginBottom: '10px' }} variant="contained" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
}

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<UserLogin>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: UserLogin) => {
    setLoading(true);
    try {
      const response = await axios.post('https://localhost:27813/api/account/login', data);
      localStorage.setItem('token', response.data.token);
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('username', { required: true })}
          id="username"
          label="Username"
          className="login-input"
          error={!!errors.username}
          helperText={errors.username?.message?.toString() || ''}
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
      <Button type="submit" sx={{ marginBottom: '10px' }} variant="contained" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}

function AuthPage() {
  const [activeView, setActiveView] = useState('login'); // Initial view state

  const handleViewChange = (view: string) => {
    setActiveView(view);
    console.log('Switched to:', view);
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
          <Login />
        ) : (
          <RegistrationForm setActiveView={setActiveView} />
        )}
      </Grid>
      <Grid item>
        <Link variant="body2" onClick={() => handleViewChange(activeView === 'login' ? 'register' : 'login')}>
          {activeView === 'login' ? 'Still not using Food App: REGISTER' : 'I have an account: LOG IN'}
        </Link>
      </Grid>
    </Grid>
  );
}

export default AuthPage;
