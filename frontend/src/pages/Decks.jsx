import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Grid, Paper, Box, Button, Dialog, DialogTitle, DialogContent, Card, CardContent, CardActions } from '@mui/material';
import AddDeck from '../components/AddDeck';
import EditDeck from '../components/EditDeck';

export default function Decks() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [showAddDeck, setShowAddDeck] = useState(false);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/decks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDecks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDecks();
  }, []);

  const addDeckToList = (newDeck) => {
    setDecks((prev) => [...prev, newDeck]);
    setShowAddDeck(false);
  };

  const handleDeckUpdate = (updatedDeck) => {
    setDecks(decks.map(d => (d._id === updatedDeck._id ? updatedDeck : d)));
    setSelectedDeck(updatedDeck);
    setIsEditingDeck(false);
  };

  const handleViewDeck = (deck) => {
    navigate(`/decks/${deck._id}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" component="h1">
          My Decks
        </Typography>
        <Button variant="contained" onClick={() => setShowAddDeck(true)}>
          Add New Deck
        </Button>
      </Box>

      <Grid container spacing={3}>
        {decks.map(deck => (
          <Grid item xs={12} sm={6} md={4} key={deck._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {deck.title}
                </Typography>
                {deck.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {deck.description}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  Created {new Date(deck.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleViewDeck(deck)}>
                  View Deck
                </Button>
                <Button size="small" onClick={() => {
                  setSelectedDeck(deck);
                  setIsEditingDeck(true);
                }}>
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {decks.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No decks yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first deck to start learning!
          </Typography>
          <Button variant="contained" onClick={() => setShowAddDeck(true)}>
            Create Deck
          </Button>
        </Paper>
      )}

      {/* Add Deck Dialog */}
      <Dialog open={showAddDeck} onClose={() => setShowAddDeck(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Deck</DialogTitle>
        <DialogContent>
          <AddDeck onDeckAdded={addDeckToList} />
        </DialogContent>
      </Dialog>

      {/* Edit Deck Dialog */}
      <Dialog open={isEditingDeck} onClose={() => setIsEditingDeck(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Deck</DialogTitle>
        <DialogContent>
          {selectedDeck && (
            <EditDeck
              deck={selectedDeck}
              onUpdate={handleDeckUpdate}
              onCancel={() => setIsEditingDeck(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
