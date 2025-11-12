import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function EditFlashcard({ flashcard, onUpdate, onCancel }) {
  const [question, setQuestion] = useState(flashcard.question);
  const [answer, setAnswer] = useState(flashcard.answer);
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/flashcards/${flashcard._id}`,
        { question, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}>
      <TextField
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
        fullWidth
        multiline
        rows={2}
        size="small"
      />
      <TextField
        label="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        required
        fullWidth
        multiline
        rows={2}
        size="small"
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          size="small"
        >
          Save
        </Button>
        <Button
          type="button"
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={onCancel}
          size="small"
        >
          Cancel
        </Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}
