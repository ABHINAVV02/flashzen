import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip } from '@mui/material';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/leaderboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaderboard(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <EmojiEventsIcon sx={{ color: '#FFD700' }} />;
      case 2:
        return <EmojiEventsIcon sx={{ color: '#C0C0C0' }} />;
      case 3:
        return <EmojiEventsIcon sx={{ color: '#CD7F32' }} />;
      default:
        return <Typography variant="h6" sx={{ color: 'text.secondary' }}>#{rank}</Typography>;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Leaderboard
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LeaderboardIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Top Learners
          </Typography>
        </Box>

        {leaderboard.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No users found. Be the first to start learning!
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Rank</strong></TableCell>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell align="center"><strong>Level</strong></TableCell>
                  <TableCell align="center"><strong>Points</strong></TableCell>
                  <TableCell align="center"><strong>Streak</strong></TableCell>
                  <TableCell align="center"><strong>Badges</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((user, index) => (
                  <TableRow key={user._id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getRankIcon(index + 1)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {user.name || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={<StarIcon />}
                        label={`Level ${user.level || 1}`}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="bold">
                        {user.points || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUpIcon sx={{ mr: 0.5, color: 'success.main' }} />
                        <Typography variant="body2">
                          {user.streak || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {user.badges?.length || 0}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
