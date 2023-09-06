import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const [cards, setCards] = useState([]);
  const [flippedCard, setFlippedCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Initialize cards
    const cards = [
      { id: 1, value: '🐶' },
      { id: 2, value: '🐶' },
      { id: 3, value: '🐱' },
      { id: 4, value: '🐱' },
      { id: 5, value: '🐻' },
      { id: 6, value: '🐻' },
      { id: 7, value: '🦁' },
      { id: 8, value: '🦁' },
    ];
    setCards(shuffle(cards));
  }, []);

  const flipCard = (card) => {
    // Check if card is already flipped or matched or game is over
    if (flippedCard === card.id || secondCard === card.id || matchedCards.includes(card.id) || gameOver) {
      return;
    }

    // Flip card
    if (flippedCard === null) {
      setFlippedCard(card.id);
      setMoves(moves+1);
    } else {
      setSecondCard(card.id);
      // Check if match
      if (card.value === cards.find(c => c.id === flippedCard).value) {
        setScore(score + 1);
        setMatchedCards([...matchedCards, flippedCard, card.id]);
        setFlippedCard(null);
        setSecondCard(null);
      } else {
        // No match, wait and flip cards back
        setTimeout(() => {
          setFlippedCard(null);
          setSecondCard(null);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    // Check if game is over
    if (score === cards.length / 2) {
      setGameOver(true);
    }
  }, [score]);

  const resetGame = () => {
    setCards(shuffle(cards));
    setFlippedCard(null);
    setSecondCard(null);
    setMatchedCards([]);
    setScore(0);
    setGameOver(false);
    setGamesPlayed(gamesPlayed+1);
    setMoves(0);
  };

  const shuffle = (array) => {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Match</Text>
      {/* <Text style={styles.score}>Score: {score}</Text> */}
      {gamesPlayed != 0 && <Text style={styles.score}>Moves: {moves}</Text>}
      <View style={styles.cards}>
        {cards.map(card => (
          <TouchableOpacity key={card.id} style={[styles.card]} onPress={() => flipCard(card)}>
            <Text style={styles.cardText}>{flippedCard === card.id || secondCard === card.id || matchedCards.includes(card.id) ? card.value : '?'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {gameOver && (
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          {gamesPlayed == 0 && <Text style={styles.buttonText}>Play</Text>}
          {gamesPlayed != 0 && <Text style={styles.buttonText}>Play Again</Text>}
        </TouchableOpacity>
      )}
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  score: {
    fontSize: 24,
    marginBottom: 24,
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotateY: '180deg' }],
  },
  cardFlipped: {
    transform: [{ rotateY: '0deg' }],
  },
  cardText: {
    fontSize: 32,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});