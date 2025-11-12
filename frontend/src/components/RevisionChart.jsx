import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Typography, Box, useTheme } from '@mui/material';

const COLORS = ['#4caf50', '#f44336'];

export default function RevisionChart() {
  const theme = useTheme();
  const [data, setData] = useState([
    { name: 'Correct', value: 0 },
    { name: 'Incorrect', value: 0 }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/revision', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const correctCount = res.data.filter(stat => stat.correct).length;
        const incorrectCount = res.data.length - correctCount;
        setData([
          { name: 'Correct', value: correctCount },
          { name: 'Incorrect', value: incorrectCount }
        ]);
      } catch (err) {
        console.error('Error fetching revision stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Revision Performance
      </Typography>
      {data[0].value === 0 && data[1].value === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No revision data available yet. Start revising flashcards to see your performance!
        </Typography>
      ) : (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} reviews`, 'Count']} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      )}
    </Box>
  );
}
