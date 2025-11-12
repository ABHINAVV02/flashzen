import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Typography, Box, Button, FormControl, InputLabel, Select, MenuItem, Paper, Alert } from '@mui/material';
import Revision from '../components/Revision';

export default function RevisionPage() {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isRevisionMode, setIsRevisionMode] = useState(false);

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
      } catch (err) {
        console.error(err);
      }
    };
    fetchFlashcards();
  }, [selectedDeck]);

  const startRevision = () => {
    if (flashcards.length > 0) {
      setIsRevisionMode(true);
    }
  };

  const exitRevision = () => {
    setIsRevisionMode(false);
  };

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom>
        Revision Mode
      </Typography>

      {!isRevisionMode ? (
        <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Select a deck to start revising
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
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
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary">
                {flashcards.length} flashcards available
              </Typography>
            </Box>
          )}

          {selectedDeck && flashcards.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              This deck has no flashcards yet. Add some flashcards first.
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={startRevision}
            disabled={!selectedDeck || flashcards.length === 0}
            fullWidth
          >
            Start Revision
          </Button>
        </Paper>
      ) : (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={exitRevision}>
              Exit Revision
            </Button>
          </Box>
          <Revision flashcards={flashcards} />
        </Box>
      )}
    </Box>
  );
}
