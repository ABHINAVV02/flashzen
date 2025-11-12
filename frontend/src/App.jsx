import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
  Link,
  Navigate,
} from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library';
import DeckView from './pages/DeckView';
import RevisionPage from './pages/RevisionPage';
import Profile from './components/Profile';
import RevisionStats from './pages/RevisionStats';
import Settings from './pages/Settings';
import Leaderboard from './pages/Leaderboard';
import ConfirmDelete from './pages/ConfirmDelete';
import LogoutButton from './components/LogoutButton';
import ThemeToggle from './components/ThemeToggle';

function Navigation() {
  const token = localStorage.getItem('token');

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

// Private route wrapper checks for token and redirects if not found
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navigation />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route
        path="library"
        element={
          <PrivateRoute>
            <Library />
          </PrivateRoute>
        }
      />
      <Route
        path="decks/:deckId"
        element={
          <PrivateRoute>
            <DeckView />
          </PrivateRoute>
        }
      />
      <Route
        path="revision"
        element={
          <PrivateRoute>
            <RevisionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="leaderboard"
        element={
          <PrivateRoute>
            <Leaderboard />
          </PrivateRoute>
        }
      />
      <Route
        path="profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="revision-stats"
        element={
          <PrivateRoute>
            <RevisionStats />
          </PrivateRoute>
        }
      />
      <Route
        path="settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route path="confirm-delete/:token" element={<ConfirmDelete />} />
      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
