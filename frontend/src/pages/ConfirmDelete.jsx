import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Paper, Typography, Button, Alert, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function ConfirmDelete() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmDeletion = async () => {
      try {
        await axios.delete(`https://flashzenserver.onrender.com/api/auth/confirm-delete/${token}`);
        setStatus('success');
        setMessage('Your account has been successfully deleted.');
        // Clear local storage after successful deletion
        localStorage.removeItem('token');
        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Failed to delete account. The link may be invalid or expired.');
      }
    };

    if (token) {
      confirmDeletion();
    }
  }, [token, navigate]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%', textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Processing Account Deletion
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we process your account deletion request...
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 3 }} />
            <Typography variant="h5" gutterBottom color="success.main">
              Account Deleted Successfully
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              You will be redirected to the homepage in a few seconds.
            </Alert>
            <Button variant="contained" onClick={() => navigate('/')}>
              Go to Homepage
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 3 }} />
            <Typography variant="h5" gutterBottom color="error.main">
              Deletion Failed
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Alert severity="warning" sx={{ mb: 3 }}>
              If you believe this is an error, please contact support or try requesting account deletion again.
            </Alert>
            <Button variant="contained" onClick={() => navigate('/profile')}>
              Back to Profile
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
