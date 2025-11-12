import { useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Typography, Box, Chip, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function FlashcardList({ flashcards, setFlashcards }) {
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://flashzenserver.onrender.com/api/flashcards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlashcards(flashcards.filter(card => card._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (card) => {
    setEditingId(card._id);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
    setEditTags(card.tags || []);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `https://flashzenserver.onrender.com/api/flashcards/${editingId}`,
        {
          question: editQuestion,
          answer: editAnswer,
          tags: editTags
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFlashcards(flashcards.map(card =>
        card._id === editingId ? res.data : card
      ));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuestion('');
    setEditAnswer('');
    setEditTags([]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editTags.includes(tagInput.trim())) {
      setEditTags([...editTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagFilter = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 ||
                       selectedTags.some(tag => card.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = [...new Set(flashcards.flatMap(card => card.tags || []))];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Flashcards ({filteredFlashcards.length})
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search flashcards"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ mr: 2, width: 250 }}
        />
        <Box sx={{ mt: 1 }}>
          {allTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagFilter(tag)}
              color={selectedTags.includes(tag) ? 'primary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
      </Box>

      <List>
        {filteredFlashcards.map((card) => (
          <ListItem key={card._id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
            {editingId === card._id ? (
              <Box sx={{ width: '100%' }}>
                <TextField
                  label="Question"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
                <TextField
                  label="Answer"
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
                <Box sx={{ mt: 1, mb: 1 }}>
                  <TextField
                    label="Add Tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    size="small"
                    sx={{ mr: 1, width: 150 }}
                  />
                  <Button variant="outlined" onClick={handleAddTag} size="small">
                    Add
                  </Button>
                </Box>
                <Box sx={{ mb: 1 }}>
                  {editTags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Box>
                  <Button onClick={handleSaveEdit} variant="contained" size="small" sx={{ mr: 1 }}>
                    Save
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outlined" size="small">
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Q: {card.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        A: {card.answer}
                      </Typography>
                      {card.tags && card.tags.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {card.tags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" sx={{ mr: 1 }} />
                          ))}
                        </Box>
                      )}
                    </Box>
                  }
                />
                <Box>
                  <IconButton onClick={() => handleEdit(card)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(card._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
