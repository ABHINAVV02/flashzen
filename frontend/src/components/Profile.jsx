import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Typography, List, ListItem, ListItemText, Paper, Box, Divider, Grid, Card, CardContent, Avatar, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, Chip, Stack, Alert, DialogContentText } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    streak: 0,
    badges: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setUserStats({
          points: res.data.points || 0,
          level: res.data.level || 1,
          streak: res.data.streak || 0,
          badges: res.data.badges || []
        });
        setEditForm({
          name: res.data.name || '',
          email: res.data.email || ''
        });
      } catch (err) {
        console.error(err);
      }
    };

    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/activity', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivities(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserProfile();
    fetchActivities();
  }, []);

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.put('/auth/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await api.delete('/auth/delete-account', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteMessage(res.data.message);
      // Clear local storage and redirect after successful deletion
      localStorage.removeItem('token');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Failed to delete account:', err);
      setDeleteMessage('Failed to delete account. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getLevelProgress = () => {
    const pointsForNextLevel = userStats.level * 100;
    const currentLevelPoints = (userStats.level - 1) * 100;
    const progress = ((userStats.points - currentLevelPoints) / (pointsForNextLevel - currentLevelPoints)) * 100;
    return Math.min(progress, 100);
  };

  const getLevelColor = (level) => {
    if (level >= 10) return '#FFD700'; // Gold
    if (level >= 5) return '#C0C0C0'; // Silver
    return '#CD7F32'; // Bronze
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '4px solid rgba(255,255,255,0.3)'
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {user.name || user.username}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
              {user.email}
            </Typography>
            <Chip
              label={`Level ${userStats.level}`}
              sx={{
                bgcolor: getLevelColor(userStats.level),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 2,
                py: 1
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                  <CardContent>
                    <StarIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                    <Typography variant="h3" fontWeight="bold">
                      {userStats.points}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Total Points
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                  <CardContent>
                    <TrendingUpIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                    <Typography variant="h3" fontWeight="bold">
                      {userStats.streak}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Day Streak
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                  <CardContent>
                    <EmojiEventsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                    <Typography variant="h3" fontWeight="bold">
                      {userStats.badges.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Badges
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Level Progress */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Level Progress
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {userStats.points - ((userStats.level - 1) * 100)} / {userStats.level * 100} XP
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getLevelProgress()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                    borderRadius: 4
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                Account Information
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Username:</Typography>
                  <Typography variant="body2" fontWeight="medium">{user.username}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body2" fontWeight="medium">{user.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Member Since:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForeverIcon />}
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <EmojiEventsIcon sx={{ mr: 1, color: 'warning.main' }} />
                Achievements
              </Typography>
              {userStats.badges.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No badges earned yet. Keep learning to unlock achievements!
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {userStats.badges.map((badge, index) => (
                    <Chip
                      key={index}
                      label={badge}
                      sx={{
                        bgcolor: 'warning.main',
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: 'warning.dark' }
                      }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HistoryIcon sx={{ mr: 1, color: 'info.main' }} />
            Recent Activity
          </Typography>
          {activities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No activity yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start using the app to see your activity here!
              </Typography>
            </Box>
          ) : (
            <List sx={{ py: 0 }}>
              {activities.slice(0, 10).map((activity, index) => (
                <Box key={activity._id}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="600" sx={{ textTransform: 'capitalize' }}>
                          {activity.type.replace(/_/g, ' ')}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(activity.timestamp).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < activities.slice(0, 10).length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Display Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
            helperText="This will be shown as your display name"
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            helperText="Your email address for notifications"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
          <DeleteForeverIcon sx={{ mr: 1 }} />
          Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to delete your account? This action cannot be undone and will permanently remove:
          </DialogContentText>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>All your flashcard decks and cards</li>
            <li>Your revision statistics and progress</li>
            <li>Your profile information and settings</li>
            <li>All activity logs and achievements</li>
          </Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action is immediate and cannot be undone. Your account will be permanently deleted.
          </Alert>
          {deleteMessage && (
            <Alert severity={deleteMessage.includes('Failed') ? 'error' : 'success'} sx={{ mt: 2 }}>
              {deleteMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            startIcon={deleteLoading ? null : <DeleteForeverIcon />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
