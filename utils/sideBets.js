// sidebets.js

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

// Initialize the deck (simplified version)
const initializeDeck = (numberOfDecks) => {
  let deck = [];
  for (let i = 0; i < numberOfDecks; i++) {
    suits.forEach(suit => {
      for (let value = 1; value <= 13; value++) {
        deck.push({ value, suit });
      }
    });
  }
  return deck;
};

// Function to remove a card from the deck
const removeCardFromDeck = (deck, card) => {
  const index = deck.findIndex(c => c.value === card.value && c.suit === card.suit);
  if (index > -1) {
    deck.splice(index, 1);
  }
  return deck;
};

// Calculate probability of a side bet
const calculateProbability = (condition, deck) => {
  const favorableOutcomes = deck.filter(condition);
  return favorableOutcomes.length / deck.length;
};

// Function for each side bet
const analyzePoke = (playerCards, dealerCard, deck) => {
  // Calculate the probability for the 21+3 side bet
  const condition = card => {
    // Check for Straight, Flush, Three of a Kind
    // Simplified example for Flush
    return playerCards.some(c => c.suit === card.suit) && dealerCard.suit === card.suit;
  };
  return calculateProbability(condition, deck);
};

const analyzeThePerfectPear = (playerCards, deck) => {
  // Calculate the probability for Perfect Pairs
  const condition = card => playerCards.some(c => c.value === card.value);
  return calculateProbability(condition, deck);
};

const analyzeAceCafe = (dealerCard, deck) => {
  // Calculate the probability for Insurance
  const condition = card => card.value === 10 || card.value === 11;
  return calculateProbability(condition, deck);
};

const analyzeBurgerKing = (playerCards, deck) => {
  // Calculate the probability for Royal Match
  const condition = card => playerCards[0].suit === playerCards[1].suit;
  return calculateProbability(condition, deck);
};

const analyzeUndergroundCafe = (playerCards, deck) => {
  // Calculate the probability for Over/Under 13
  const totalValue = playerCards.reduce((acc, card) => acc + card.value, 0);
  const conditionOver = card => totalValue + card.value > 13;
  const conditionUnder = card => totalValue + card.value < 13;
  return {
    over: calculateProbability(conditionOver, deck),
    under: calculateProbability(conditionUnder, deck)
  };
};

const analyzeDairyQueen = (playerCards, deck) => {
  // Calculate the probability for Lucky Ladies
  const condition = card => card.value + playerCards.reduce((acc, card) => acc + card.value, 0) === 20;
  return calculateProbability(condition, deck);
};

const analyzeLuckySeven = (playerCards, deck) => {
  // Calculate the probability for Super Sevens
  const condition = card => card.value === 7;
  return calculateProbability(condition, deck);
};

const analyzeHigherGround = (playerCard, dealerCard, deck) => {
  // Calculate the probability for Hi/Low
  const conditionHigh = card => playerCard.value > dealerCard.value;
  const conditionLow = card => playerCard.value < dealerCard.value;
  return {
    high: calculateProbability(conditionHigh, deck),
    low: calculateProbability(conditionLow, deck)
  };
};

const analyzeBostonPizza = (dealerCards, deck) => {
  // Calculate the probability for Dealer Bust
  const dealerTotal = dealerCards.reduce((acc, card) => acc + card.value, 0);
  const condition = card => dealerTotal + card.value > 21;
  return calculateProbability(condition, deck);
};

const analyzePizzaTop = (playerCards, dealerCard, deck) => {
  // Calculate the probability for Top 3
  const condition = card => {
    const hand = [...playerCards, dealerCard, card];
    return new Set(hand.map(c => c.value)).size <= 3; // Simplified example
  };
  return calculateProbability(condition, deck);
};

// Main function to call the appropriate analyzer
const analyzeSideBet = (sideBetCode, playerCards, dealerCard, deck) => {
  switch (sideBetCode) {
    case 'Poke':
      return analyzePoke(playerCards, dealerCard, deck);
    case 'Perfect':
      return analyzeThePerfectPear(playerCards, deck);
    case 'Ace':
      return analyzeAceCafe(dealerCard, deck);
    case 'Burger':
      return analyzeBurgerKing(playerCards, deck);
    case 'Underground':
      return analyzeUndergroundCafe(playerCards, deck);
    case 'Dairy':
      return analyzeDairyQueen(playerCards, deck);
    case 'Lucky':
      return analyzeLuckySeven(playerCards, deck);
    case 'Higher':
      return analyzeHigherGround(playerCards[0], dealerCard, deck);
    case 'Boston':
      return analyzeBostonPizza([dealerCard], deck);
    case 'Pizza':
      return analyzePizzaTop(playerCards, dealerCard, deck);
    default:
      throw new Error('Unknown side bet code');
  }
};

export default analyzeSideBet;
