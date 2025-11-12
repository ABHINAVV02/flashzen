import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { TextField, Button, Box, Chip, Typography } from '@mui/material';

export default function AddFlashcard({ deckId, onFlashcardAdded }) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/flashcards',
        {
          deck: deckId,
          question: question.trim(),
          answer: answer.trim(),
          tags
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onFlashcardAdded(res.data);
      setQuestion('');
      setAnswer('');
      setTags([]);
      setTagInput('');
      // Navigate to flashcards view or show success message
      navigate(`/decks/${deckId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add New Flashcard
      </Typography>
      <TextField
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        fullWidth
        margin="normal"
        required
        multiline
        rows={2}
      />
      <TextField
        label="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        fullWidth
        margin="normal"
        required
        multiline
        rows={2}
      />
      <Box sx={{ mt: 2, mb: 1 }}>
        <TextField
          label="Add Tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          sx={{ mr: 1, width: 200 }}
        />
        <Button variant="outlined" onClick={handleAddTag} size="small">
          Add Tag
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleRemoveTag(tag)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>
      <Button type="submit" variant="contained" sx={{ mt: 1 }} disabled={loading}>
        {loading ? 'Adding...' : 'Add Flashcard'}
      </Button>
    </Box>
  );
}
