import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Box, Typography, Chip } from '@mui/material';

export default function AddDeck({ onDeckAdded }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddDeck = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/decks',
        { title, description, tags, isFavourite },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onDeckAdded(res.data);
      // Navigate to the newly created deck
      navigate(`/decks/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add deck');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleAddDeck} sx={{ maxWidth: 500 }}>
      <Typography variant="h6" gutterBottom>
        Add New Deck
      </Typography>

      <TextField
        fullWidth
        label="Deck Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Add Tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleKeyPress}
          helperText="Press Enter to add a tag"
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              size="small"
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <input
          type="checkbox"
          id="favourite"
          checked={isFavourite}
          onChange={(e) => setIsFavourite(e.target.checked)}
          style={{ marginRight: 8 }}
        />
        <label htmlFor="favourite">Mark as favourite</label>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading || !title.trim()}
      >
        {loading ? 'Creating...' : 'Create Deck'}
      </Button>
    </Box>
  );
}
