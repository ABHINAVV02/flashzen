import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { List, ListItem, ListItemText, ListItemButton, IconButton, Typography, Paper, Box, Chip, Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

export default function DeckList({ decks, onSelectDeck, setDecks }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);

  const handleMenuOpen = (event, deck) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeck(deck);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDeck(null);
  };

  const handleDeleteDeck = async () => {
    if (!selectedDeck) return;
    if (!confirm('Are you sure you want to delete this deck?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/decks/${selectedDeck._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDecks(decks.filter(deck => deck._id !== selectedDeck._id));
      handleMenuClose();
      // Navigate to library after deletion
      navigate('/library');
    } catch (err) {
      console.error('Failed to delete deck:', err);
    }
  };

  const handleToggleFavourite = async () => {
    if (!selectedDeck) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `http://localhost:5000/api/decks/${selectedDeck._id}/favourite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDecks(decks.map(deck =>
        deck._id === selectedDeck._id ? res.data : deck
      ));
      handleMenuClose();
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
    }
  };

  const handleViewDeck = () => {
    if (selectedDeck) {
      navigate(`/decks/${selectedDeck._id}`);
    }
    handleMenuClose();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Your Decks
      </Typography>
      {decks.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No decks yet. Create your first deck!
        </Typography>
      ) : (
        <List>
          {decks.map(deck => (
            <Paper key={deck._id} elevation={1} sx={{ mb: 1 }}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(e) => handleMenuOpen(e, deck)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton onClick={() => onSelectDeck(deck)}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {deck.isFavourite && <BookmarkIcon color="primary" fontSize="small" />}
                        <Typography variant="subtitle1">{deck.title}</Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {deck.description}
                        </Typography>
                        {deck.tags && deck.tags.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {deck.tags.map(tag => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDeck}>View Deck</MenuItem>
        <MenuItem onClick={handleToggleFavourite}>
          {selectedDeck?.isFavourite ? (
            <>
              <BookmarkBorderIcon sx={{ mr: 1 }} />
              Remove from Bookmarks
            </>
          ) : (
            <>
              <BookmarkIcon sx={{ mr: 1 }} />
              Add to Bookmarks
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDeleteDeck} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Deck
        </MenuItem>
      </Menu>
    </Box>
  );
}
