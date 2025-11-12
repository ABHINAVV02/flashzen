import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Typography, Grid, Paper, Box, Button, Dialog, DialogTitle, DialogContent, TextField, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddFlashcard from '../components/AddFlashcard';
import FlashcardList from '../components/FlashcardList';
import EditFlashcard from '../components/EditFlashcard';

export default function Flashcards() {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [showAddFlashcard, setShowAddFlashcard] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/decks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDecks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDecks();
  }, []);

  useEffect(() => {
    if (!selectedDeck) {
      setFlashcards([]);
      setFilteredFlashcards([]);
      return;
    }

    const fetchFlashcards = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(
          `/flashcards/${selectedDeck}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFlashcards(res.data);
        setFilteredFlashcards(res.data);

        // Extract unique tags
        const tags = [...new Set(res.data.flatMap(card => card.tags || []))];
        setAvailableTags(tags);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFlashcards();
  }, [selectedDeck]);

  useEffect(() => {
    let filtered = flashcards;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(card =>
        selectedTags.every(tag => card.tags?.includes(tag))
      );
    }

    setFilteredFlashcards(filtered);
  }, [flashcards, searchTerm, selectedTags]);

  const addFlashcardToList = (newCard) => {
    setFlashcards((prev) => [...prev, newCard]);
    setShowAddFlashcard(false);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleEditFlashcard = (flashcard) => {
    setEditingFlashcard(flashcard);
  };

  const handleUpdateFlashcard = (updatedCard) => {
    setFlashcards(flashcards.map(card =>
      card._id === updatedCard._id ? updatedCard : card
    ));
    setEditingFlashcard(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" component="h1">
          My Flashcards
        </Typography>
        <Button
          variant="contained"
          onClick={() => setShowAddFlashcard(true)}
          disabled={!selectedDeck}
        >
          Add New Flashcard
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Deck</InputLabel>
              <Select
                value={selectedDeck}
                onChange={(e) => setSelectedDeck(e.target.value)}
                label="Select Deck"
              >
                {decks.map(deck => (
                  <MenuItem key={deck._id} value={deck._id}>
                    {deck.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedDeck && (
              <>
                <TextField
                  fullWidth
                  label="Search flashcards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ mb: 2 }}
                />

                {availableTags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Filter by tags:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {availableTags.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          onClick={() => handleTagToggle(tag)}
                          color={selectedTags.includes(tag) ? 'primary' : 'default'}
                          variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Paper>

          {selectedDeck && (
            <Paper sx={{ p: 3 }}>
              <FlashcardList
                flashcards={filteredFlashcards}
                setFlashcards={setFlashcards}
                onEdit={handleEditFlashcard}
              />
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Add Flashcard Dialog */}
      <Dialog open={showAddFlashcard} onClose={() => setShowAddFlashcard(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Flashcard</DialogTitle>
        <DialogContent>
          <AddFlashcard deckId={selectedDeck} onFlashcardAdded={addFlashcardToList} />
        </DialogContent>
      </Dialog>

      {/* Edit Flashcard Dialog */}
      <Dialog open={!!editingFlashcard} onClose={() => setEditingFlashcard(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Flashcard</DialogTitle>
        <DialogContent>
          {editingFlashcard && (
            <EditFlashcard
              flashcard={editingFlashcard}
              onUpdate={handleUpdateFlashcard}
              onCancel={() => setEditingFlashcard(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
