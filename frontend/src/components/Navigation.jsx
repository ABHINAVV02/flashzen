import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const { token } = useContext(AuthContext);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              FlashZen
            </Link>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, justifyContent: 'flex-end' }}>
            <ThemeToggle />
            {token ? (
              <>
                <Link to="/library" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography variant="button">Library</Typography>
                </Link>
                <Link to="/revision" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography variant="button">Revision</Typography>
                </Link>
                <Link to="/leaderboard" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography variant="button">Leaderboard</Typography>
                </Link>
                <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography variant="button">Profile</Typography>
                </Link>
                <Link to="/revision-stats" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography variant="button">Stats</Typography>
                </Link>
                <Link to="/settings" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography variant="button">Settings</Typography>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography variant="button">Login</Typography>
                </Link>
                <Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography variant="button">Register</Typography>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: 'calc(100vh - 140px)' }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ bgcolor: 'background.paper', p: 2, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 FlashZen. Built with React and Material-UI.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
