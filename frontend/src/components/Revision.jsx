import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Box, Typography, Button, Paper } from '@mui/material';

export default function Revision({ flashcards }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const total = flashcards.length;

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      handleAutoFlip();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          handleFlip();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'c':
        case 'C':
          event.preventDefault();
          recordReview(true);
          break;
        case 'i':
        case 'I':
          event.preventDefault();
          recordReview(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, flipped]);

  useEffect(() => {
    const fetchTimerSetting = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const timerDuration = res.data.settings?.timerDuration || 30;
        setTimer(timerDuration);
      } catch (err) {
        console.error('Failed to fetch timer setting:', err);
        setTimer(30);
      }
    };
    fetchTimerSetting();
  }, []);

  if (total === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No flashcards available to revise.
      </Typography>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped) {
      setIsTimerActive(true);
    }
  };

  const handleAutoFlip = () => {
    setFlipped(true);
    setIsTimerActive(false);
  };

  const handleNext = () => {
    setFlipped(false);
    setIsTimerActive(false);
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
      resetTimer();
    } else {
      // Revision completed - navigate to stats page
      navigate('/revision-stats');
    }
  };

  const handlePrev = () => {
    setFlipped(false);
    setIsTimerActive(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetTimer();
    }
  };

  const resetTimer = () => {
    const fetchTimerSetting = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimer(res.data.settings?.timerDuration || 30);
      } catch (err) {
        setTimer(30);
      }
    };
    fetchTimerSetting();
  };

  const recordReview = async (correct) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/revision',
        {
          flashcardId: currentCard._id,
          deckId: currentCard.deck,
          correct,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleNext();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Revision Mode
      </Typography>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Box
          onClick={handleFlip}
          sx={{
            width: '100%',
            height: 300,
            perspective: '1000px',
            cursor: 'pointer',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'none',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                bgcolor: 'background.paper',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                boxShadow: 3,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" component="div">
                <strong>Question:</strong>
                <br />
                {currentCard.question}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" component="div">
                <strong>Answer:</strong>
                <br />
                {currentCard.answer}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click the card to flip between question and answer
        </Typography>

        {isTimerActive && timer > 0 && (
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Auto-flip in: {timer}s
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Button variant="outlined" onClick={handlePrev} disabled={currentIndex === 0}>
            Previous
          </Button>
          <Button variant="contained" color="success" onClick={() => recordReview(true)}>
            ✓ Correct
          </Button>
          <Button variant="contained" color="error" onClick={() => recordReview(false)}>
            ✗ Incorrect
          </Button>
          <Button variant="outlined" onClick={handleNext} disabled={currentIndex === total - 1}>
            Next
          </Button>
        </Box>

        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Card {currentIndex + 1} of {total}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Keyboard shortcuts: Space/Enter (flip), Arrows (navigate), C/I (correct/incorrect)
        </Typography>
      </Paper>
    </Box>
  );
}
