import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();         
    navigate('/login');
  };

  return (
    <Button
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
      color="error"
      variant="outlined"
    >
      Logout
    </Button>
  );
}
