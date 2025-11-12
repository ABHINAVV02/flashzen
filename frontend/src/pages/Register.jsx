import React, { useState, useContext } from 'react';
import api from '../utils/api';
import { TextField, Button, Paper, Typography, Alert, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!validateEmail(e.target.value) ? 'Please enter a valid email address' : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { username, email, password });
      login(response.data.token); // update auth state
      navigate('/library'); // redirect after register
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">Register</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} required fullWidth disabled={isLoading} />
          <TextField label="Email" type="email" value={email} onChange={handleEmailChange} error={!!emailError} helperText={emailError} required fullWidth disabled={isLoading} />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} helperText="Password must be at least 6 characters long" required fullWidth disabled={isLoading} />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading || !!emailError} sx={{ mt: 1 }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Creating Account...
              </Box>
            ) : ('Register')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
