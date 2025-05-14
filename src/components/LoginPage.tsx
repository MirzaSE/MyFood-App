import React, { useState } from 'react';
import { Button, TextField, FormControl, Typography, Grid, Link, Alert, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { register, login, AuthResponse } from '../api';
import { useNavigate } from 'react-router-dom';

interface UserLogin {
  username: string;
  password: string;
}

interface UserRegister extends UserLogin {
  confirmPassword: string;
}

function Login({ onSuccess }: { onSuccess: (data: AuthResponse) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<UserLogin>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: UserLogin) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login(data);
      onSuccess(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <FormControl fullWidth margin="normal">
        <TextField
          {...formRegister('username')}
          label="Username"
          error={!!errors.username}
          helperText={errors.username?.message}
          disabled={isLoading}
        />
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <TextField
          {...formRegister('password')}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isLoading}
        />
      </FormControl>
      
      <Button 
        type="submit" 
        variant="contained" 
        fullWidth
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
    </form>
  );
}

function RegistrationForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validationSchema = yup.object({
    username: yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    password: yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<UserRegister>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: UserRegister) => {
    setIsLoading(true);
    setError(null);
    try {
      await register({
        username: data.username,
        password: data.password
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <FormControl fullWidth margin="normal">
        <TextField
          {...formRegister('username')}
          label="Username"
          error={!!errors.username}
          helperText={errors.username?.message}
          disabled={isLoading}
        />
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <TextField
          {...formRegister('password')}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isLoading}
        />
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <TextField
          {...formRegister('confirmPassword')}
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          disabled={isLoading}
        />
      </FormControl>
      
      <Button 
        type="submit" 
        variant="contained" 
        fullWidth
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
    </form>
  );
}

export const LoginPage = () => {
  const [activeView, setActiveView] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleAuthSuccess = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      id: data.userId,
      username: data.username
    }));
    navigate('/dashboard');
  };

  return (
    <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', p: 2 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Food App
        </Typography>
        
        {activeView === 'login' ? (
          <Login onSuccess={handleAuthSuccess} />
        ) : (
          <RegistrationForm onSuccess={() => {
            setActiveView('login');
            navigate('/login');
          }} />
        )}
        
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {activeView === 'login' ? (
            <Link 
              component="button" 
              onClick={() => setActiveView('register')}
              underline="hover"
              sx={{ cursor: 'pointer' }}
            >
              Don't have an account? Register
            </Link>
          ) : (
            <Link 
              component="button" 
              onClick={() => setActiveView('login')}
              underline="hover"
              sx={{ cursor: 'pointer' }}
            >
              Already have an account? Login
            </Link>
          )}
        </Typography>
      </Grid>
    </Grid>
  );
};