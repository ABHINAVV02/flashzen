import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Grid
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Settings() {
  const [settings, setSettings] = useState({
    timerDuration: 30,
    theme: 'light',
    keyboardShortcuts: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSettings(res.data.settings || settings);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/settings',
        { settings },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Preferences
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Timer Duration (seconds)"
              type="number"
              value={settings.timerDuration}
              onChange={(e) => setSettings({ ...settings, timerDuration: parseInt(e.target.value) })}
              fullWidth
              inputProps={{ min: 5, max: 300 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.keyboardShortcuts}
                  onChange={(e) => setSettings({ ...settings, keyboardShortcuts: e.target.checked })}
                />
              }
              label="Enable Keyboard Shortcuts"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
