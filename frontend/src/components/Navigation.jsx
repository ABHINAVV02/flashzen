import React, { useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = token ? [
    { to: '/library', label: 'Library' },
    { to: '/revision', label: 'Revision' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/profile', label: 'Profile' },
    { to: '/revision-stats', label: 'Stats' },
    { to: '/settings', label: 'Settings' },
  ] : [
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              FlashZen
            </Link>
          </Typography>
          {isMobile ? (
            <>
              <ThemeToggle />
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {menuItems.map((item) => (
                  <MenuItem key={item.to} onClick={handleMenuClose}>
                    <Link to={item.to} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {item.label}
                    </Link>
                  </MenuItem>
                ))}
                {token && (
                  <MenuItem onClick={handleMenuClose}>
                    <LogoutButton />
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 }, minHeight: 'calc(100vh - 140px)' }}>
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
