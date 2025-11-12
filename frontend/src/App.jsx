import React from 'react';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Navigate } from 'react-router-dom';

import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';

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

      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
