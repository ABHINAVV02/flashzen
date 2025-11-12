import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import RevisionChart from '../components/RevisionChart';

export default function RevisionStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/revision', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch revision stats:', error);
      }
    };
    fetchStats();
  }, []);

  if (stats.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No revision stats available.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Revision Statistics
      </Typography>

      {/* Revision Performance Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <RevisionChart />
      </Paper>

      {/* Detailed Stats Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BarChartIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Detailed Statistics
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Deck</strong></TableCell>
                <TableCell><strong>Question</strong></TableCell>
                <TableCell><strong>Correct</strong></TableCell>
                <TableCell><strong>Reviewed At</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.map(stat => (
                <TableRow key={stat._id}>
                  <TableCell>{stat.deck?.title || 'N/A'}</TableCell>
                  <TableCell>{stat.flashcard?.question || 'N/A'}</TableCell>
                  <TableCell>{stat.correct ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{new Date(stat.reviewedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
