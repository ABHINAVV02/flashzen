import { useState } from 'react';
import api from '../utils/api';
import { TextField, Button, Box, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function EditDeck({ deck, onUpdate, onCancel }) {
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description || '');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await api.put(
        `/decks/${deck._id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <TextField
        label="Deck Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        size="small"
      />
      <TextField
        label="Deck Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
