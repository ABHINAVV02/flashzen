import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
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
