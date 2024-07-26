import { getBasicStrategy } from './getBasicStrategy';
import { readParsedData } from './saveParsedData';
import { updateRunningCount, calculateTrueCount, makeDecisionBasedOnTrueCount, runningCount } from './cardCounting';
import { trackShuffledDeck } from './shuffleTracking';
import refineStrategy from './refineStrategy';
import kellyCriterion from './KellyCriterion';

const playBlackjack = async (playerHand, dealerUpCard, otherPlayersHands, bankroll) => {
  const parsedData = await readParsedData();
  if (parsedData.length === 0) {
    console.log('No saved data available.');
    return;
  }

  const { numberOfPlayers, numberOfDecks, minBet } = parsedData[0];

  console.log(`Number of Players: ${numberOfPlayers}`);
  console.log(`Number of Decks: ${numberOfDecks}`);
  console.log(`Minimum Bet: ${minBet}`);

  // Update running count with current hands
  playerHand.forEach(card => updateRunningCount(card));
  updateRunningCount(dealerUpCard);

  // Update running count with other players' hands
  otherPlayersHands.forEach(hand => hand.forEach(card => updateRunningCount(card)));

  // Calculate true count
  const trueCount = calculateTrueCount(numberOfDecks);

  console.log(`Running Count: ${runningCount} `);
  console.log(`True Count: ${trueCount} Running Count divided by the number of decks remaining`);

  // Use basic strategy to get recommendation
  const basicStrategy = getBasicStrategy(playerHand, dealerUpCard);
  console.log(`Basic recommended action: ${basicStrategy}`);

  // Make decision based on true count
  const countDecision = makeDecisionBasedOnTrueCount(trueCount);
  console.log(`Count-based decision adjusted with the true count: ${countDecision}`);

  // Track the shuffle to analyze clumps of high and low cards
  const deck = [...playerHand, dealerUpCard, ...otherPlayersHands.flat()].map(card => card.value);
  const { shuffledDeck, newHighClump, newLowClump } = trackShuffledDeck(deck);

  console.log('Shuffled Deck:', shuffledDeck);
  console.log('New High Clump Positions:', newHighClump);
  console.log('New Low Clump Positions:', newLowClump);

  // Refine strategy based on all factors
  const refinedStrategy = refineStrategy(basicStrategy, trueCount, countDecision, newHighClump, newLowClump, runningCount);
  console.log('Refined Strategy of combined data:', refinedStrategy);

  // Calculate bet using Kelly Criterion
  const edge = trueCount / numberOfDecks; // Simplified edge calculation
  const bet = edge > 0 ? kellyCriterion(bankroll, edge, 1) : minBet; // Only bet if the edge is positive

  console.log('Recommended Bet:', bet, `Based on Kelly Criterion, betting in proportion to your edge`);

  return { refinedStrategy, bet };
};

export default playBlackjack;
