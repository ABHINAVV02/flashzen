import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Typography, Grid, Paper, Box, Button, Dialog, DialogTitle, DialogContent, Card, CardContent, CardActions, Chip, TextField, InputAdornment, Tabs, Tab, Menu, MenuItem, IconButton, Switch, FormControlLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AddDeck from '../components/AddDeck';
import EditDeck from '../components/EditDeck';
import AddFlashcard from '../components/AddFlashcard';
import FlashcardList from '../components/FlashcardList';
import EditFlashcard from '../components/EditFlashcard';

export default function Library() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [filteredDecks, setFilteredDecks] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [viewMode, setViewMode] = useState('decks'); // 'decks' or 'flashcards'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [showAddFlashcard, setShowAddFlashcard] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [decks, flashcards, searchTerm, selectedTags, showFavouritesOnly, viewMode]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      const [decksRes, flashcardsRes] = await Promise.all([
        api.get('/decks', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/flashcards/user', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setDecks(decksRes.data);
      setFlashcards(flashcardsRes.data);
    } catch (err) {
      console.error('Failed to fetch library data:', err);
    }
  };

  const filterData = () => {
    let filtered = [];

    if (viewMode === 'decks') {
      filtered = decks.filter(deck => {
        const matchesSearch = deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            deck.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => deck.tags?.includes(tag));
        const matchesFavourite = !showFavouritesOnly || deck.isFavourite;
        return matchesSearch && matchesTags && matchesFavourite;
      });
      setFilteredDecks(filtered);
    } else {
      filtered = flashcards.filter(card => {
        const matchesSearch = card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            card.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => card.tags?.includes(tag));
        return matchesSearch && matchesTags;
      });
      setFilteredFlashcards(filtered);
    }
  };

  const handleAddDeck = (newDeck) => {
    setDecks(prev => [...prev, newDeck]);
    setShowAddDeck(false);
  };

  const handleUpdateDeck = (updatedDeck) => {
    setDecks(prev => prev.map(d => d._id === updatedDeck._id ? updatedDeck : d));
    setEditingDeck(null);
  };

  const handleDeleteDeck = async (deckId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/decks/${deckId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDecks(prev => prev.filter(d => d._id !== deckId));
    } catch (err) {
      console.error('Failed to delete deck:', err);
    }
  };

  const handleToggleFavourite = async (deckId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.patch(`/decks/${deckId}/favourite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDecks(prev => prev.map(d => d._id === res.data._id ? res.data : d));
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
    }
  };

  const handleAddFlashcard = (newCard) => {
    setFlashcards(prev => [...prev, newCard]);
    setShowAddFlashcard(false);
  };

  const handleUpdateFlashcard = (updatedCard) => {
    setFlashcards(prev => prev.map(c => c._id === updatedCard._id ? updatedCard : c));
    setEditingFlashcard(null);
  };

  const handleDeleteFlashcard = async (cardId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/flashcards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFlashcards(prev => prev.filter(c => c._id !== cardId));
    } catch (err) {
      console.error('Failed to delete flashcard:', err);
    }
  };

  const handleViewDeck = (deck) => {
    navigate(`/decks/${deck._id}`);
  };

  const handleMenuOpen = (event, deck) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeck(deck);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDeck(null);
  };

  const allTags = [...new Set([
    ...decks.flatMap(deck => deck.tags || []),
    ...flashcards.flatMap(card => card.tags || [])
  ])];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" component="h1">
          My Library
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => setAnchorEl(document.getElementById('add-menu-anchor'))}
            id="add-menu-anchor"
          >
            Add New
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl && anchorEl.id === 'add-menu-anchor')}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { setShowAddDeck(true); handleMenuClose(); }}>
              Add Deck
            </MenuItem>
            <MenuItem onClick={() => { setShowAddFlashcard(true); handleMenuClose(); }}>
              Add Flashcard
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {allTags.slice(0, 5).map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  clickable
                  color={selectedTags.includes(tag) ? 'primary' : 'default'}
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  size="small"
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {viewMode === 'decks' && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={showFavouritesOnly}
                      onChange={(e) => setShowFavouritesOnly(e.target.checked)}
                    />
                  }
                  label="Bookmarks only"
                />
              )}
              <Tabs value={viewMode} onChange={(e, newValue) => setViewMode(newValue)}>
                <Tab label="Decks" value="decks" />
                <Tab label="Flashcards" value="flashcards" />
              </Tabs>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {viewMode === 'decks' ? (
        <Grid container spacing={3}>
          {filteredDecks.map(deck => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={deck._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ flexGrow: 1, mr: 1 }}>
                      {deck.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavourite(deck._id);
                      }}
                    >
                      {deck.isFavourite ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Box>
                  {deck.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {deck.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    {deck.tags?.slice(0, 3).map(tag => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(deck.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleViewDeck(deck)}>
                    View
                  </Button>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, deck)}>
                    <MoreVertIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3 }}>
          <FlashcardList
            flashcards={filteredFlashcards}
            setFlashcards={setFlashcards}
            onEdit={setEditingFlashcard}
            showDeckInfo={true}
          />
        </Paper>
      )}

      {filteredDecks.length === 0 && viewMode === 'decks' && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No decks found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first deck to get started!
          </Typography>
          <Button variant="contained" onClick={() => setShowAddDeck(true)}>
            Create Deck
          </Button>
        </Paper>
      )}

      {filteredFlashcards.length === 0 && viewMode === 'flashcards' && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No flashcards found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add some flashcards to your library!
          </Typography>
          <Button variant="contained" onClick={() => setShowAddFlashcard(true)}>
            Add Flashcard
          </Button>
        </Paper>
      )}

      {/* Deck Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl && selectedDeck)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleViewDeck(selectedDeck); handleMenuClose(); }}>
          View Deck
        </MenuItem>
        <MenuItem onClick={() => { setEditingDeck(selectedDeck); handleMenuClose(); }}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => { handleDeleteDeck(selectedDeck._id); handleMenuClose(); }}>
          Delete
        </MenuItem>
      </Menu>

      {/* Add Deck Dialog */}
      <Dialog open={showAddDeck} onClose={() => setShowAddDeck(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Deck</DialogTitle>
        <DialogContent>
          <AddDeck onDeckAdded={handleAddDeck} />
        </DialogContent>
      </Dialog>

      {/* Edit Deck Dialog */}
      <Dialog open={!!editingDeck} onClose={() => setEditingDeck(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Deck</DialogTitle>
        <DialogContent>
          {editingDeck && (
            <EditDeck
              deck={editingDeck}
              onUpdate={handleUpdateDeck}
              onCancel={() => setEditingDeck(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Flashcard Dialog */}
      <Dialog open={showAddFlashcard} onClose={() => setShowAddFlashcard(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Flashcard</DialogTitle>
        <DialogContent>
          <AddFlashcard onFlashcardAdded={handleAddFlashcard} />
        </DialogContent>
      </Dialog>

      {/* Edit Flashcard Dialog */}
      <Dialog open={!!editingFlashcard} onClose={() => setEditingFlashcard(null)} maxWidth="md" fullWidth>
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
