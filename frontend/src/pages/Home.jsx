import { Typography, Box, Button, Grid, Paper, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (token) {
    navigate('/profile');
    return null;
  }

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Interactive Revision',
      description: 'Flip cards with smooth animations, keyboard shortcuts, and configurable timers.'
    },
    {
      icon: <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Progress Tracking',
      description: 'Visual analytics, gamification with badges, levels, and streak tracking.'
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Customizable Settings',
      description: 'Adjust timer duration, theme, and keyboard shortcuts to your preference.'
    },
    {
      icon: <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'User Profiles',
      description: 'Track your activity, view achievements, and manage your learning journey.'
    }
  ];

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Welcome to FlashZen
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
        Your modern flashcard learning companion
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/register')}
          sx={{ mr: 2, px: 4, py: 1.5 }}
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/login')}
          sx={{ px: 4, py: 1.5 }}
        >
          Sign In
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 6, p: 4, backgroundColor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom>
          Start Learning Today
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Create decks, add flashcards with tags, and revise with interactive features.
          Track your progress and earn achievements as you learn.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/register')}
          sx={{ px: 4, py: 1.5 }}
        >
          Create Account
        </Button>
      </Paper>
    </Box>
  );
}
