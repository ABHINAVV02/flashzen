import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, useThemeContext, lightTheme, darkTheme } from './ThemeContext'
import './index.css'
import App from './App.jsx'

function AppWithTheme() {
  const { mode } = useThemeContext();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  </StrictMode>,
)
