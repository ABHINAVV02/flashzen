import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Typography, Grid, Paper, Box, Button, Dialog, DialogTitle, DialogContent, Alert, Chip } from '@mui/material';
import AddFlashcard from '../components/AddFlashcard';
import FlashcardList from '../components/FlashcardList';
import EditFlashcard from '../components/EditFlashcard';
import EditDeck from '../components/EditDeck';
import Revision from '../components/Revision';

export default function DeckView() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFlashcard, setShowAddFlashcard] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [isRevisionMode, setIsRevisionMode] = useState(false);

  useEffect(() => {
    const fetchDeckAndFlashcards = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch deck details
        const deckRes = await api.get(`/decks/${deckId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeck(deckRes.data);

        // Fetch flashcards
        const flashcardsRes = await api.get(`/flashcards/${deckId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlashcards(flashcardsRes.data);
      } catch (err) {
        console.error('Failed to fetch deck data:', err);
        navigate('/decks');
      } finally {
        setLoading(false);
      }
    };

    if (deckId) {
      fetchDeckAndFlashcards();
    }
  }, [deckId, navigate]);

  const addFlashcardToList = (newCard) => {
    setFlashcards((prev) => [...prev, newCard]);
    setShowAddFlashcard(false);
  };

  const handleUpdateFlashcard = (updatedCard) => {
    setFlashcards(flashcards.map(card =>
      card._id === updatedCard._id ? updatedCard : card
    ));
    setEditingFlashcard(null);
  };

  const handleDeckUpdate = (updatedDeck) => {
    setDeck(updatedDeck);
    setIsEditingDeck(false);
  };

  const startRevision = () => {
    if (flashcards.length > 0) {
      setIsRevisionMode(true);
    }
  };

  const exitRevision = () => {
    setIsRevisionMode(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!deck) {
    return <Typography>Deck not found.</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            {deck.title}
          </Typography>
          {deck.description && (
            <Typography variant="subtitle1" color="text.secondary">
              {deck.description}
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            <Chip
              label={`${flashcards.length} flashcards`}
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Chip
              label={`Created ${new Date(deck.createdAt).toLocaleDateString()}`}
              variant="outlined"
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => setIsEditingDeck(true)}>
            Edit Deck
          </Button>
          <Button
            variant="contained"
            onClick={startRevision}
            disabled={flashcards.length === 0}
          >
            Start Revision
          </Button>
        </Box>
      </Box>

      {flashcards.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          This deck has no flashcards yet. Add some flashcards to start revising!
        </Alert>
      ) : null}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Flashcards
              </Typography>
              <Button variant="contained" onClick={() => setShowAddFlashcard(true)}>
                Add Flashcard
              </Button>
            </Box>

            <FlashcardList
              flashcards={flashcards}
              setFlashcards={setFlashcards}
              onEdit={setEditingFlashcard}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Add Flashcard Dialog */}
      <Dialog open={showAddFlashcard} onClose={() => setShowAddFlashcard(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Flashcard</DialogTitle>
        <DialogContent>
          <AddFlashcard deckId={deckId} onFlashcardAdded={addFlashcardToList} />
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

      {/* Edit Deck Dialog */}
      <Dialog open={isEditingDeck} onClose={() => setIsEditingDeck(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Deck</DialogTitle>
        <DialogContent>
          <EditDeck
            deck={deck}
            onUpdate={handleDeckUpdate}
            onCancel={() => setIsEditingDeck(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Revision Mode */}
      {isRevisionMode && (
        <Dialog open={isRevisionMode} onClose={exitRevision} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ textAlign: 'center' }}>
            Revising: {deck.title}
            <Button
              onClick={exitRevision}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              Exit
            </Button>
          </DialogTitle>
          <DialogContent>
            <Revision flashcards={flashcards} />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}
