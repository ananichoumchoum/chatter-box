import { saveParsedData, readParsedData } from './saveParsedData'; // Ensure this path is correct
import playBlackjack from './play';

const parseMessage = (message) => {
  console.log('parseMessage called with message:', message); // Add logging
  // regex to capture the required pattern
  const regex = /(\d+).*?(\d+).*?\.([^?]*)\?.*?(\d+)/;
  const match = message.match(regex);

  if (match && match.length >= 4) {
    const parsedData = {
      numberOfPlayers: parseInt(match[1], 10),
      numberOfDecks: parseInt(match[2], 10),
      sideBets: match[3].trim(),
      minBet:  parseInt(match[4], 10),
    };

    if (!isNaN(parsedData.numberOfPlayers) && !isNaN(parsedData.numberOfDecks) && !isNaN(parsedData.minBet) && parsedData.sideBets) {
      saveParsedData([parsedData.numberOfPlayers, parsedData.numberOfDecks, parsedData.sideBets, parsedData.minBet])
        .then(() => {
          // Example hands and bankroll for testing purposes
          const playerHand = [{ value: 5 }, { value: 6 }]; // Example hand
          const dealerUpCard = { value: 10 }; // Example dealer upcard
          const otherPlayersHands = [
            [{ value: 10 }, { value: 4 }], // Other player's hand
            [{ value: 8 }, { value: 2 }] // Another player's hand
          ];
          const bankroll = 200; // Example bankroll

          playBlackjack(playerHand, dealerUpCard, otherPlayersHands, bankroll)
            .then(({ refinedStrategy, bet }) => {
              console.log('Final Decision:', refinedStrategy, 'Bet:', bet);
            })
            .catch(error => {
              console.error('Error playing Blackjack:', error);
            });
        })
        .catch(error => {
          console.error('Error saving parsed data:', error);
        });

      return parsedData;
    }
  }

  return null;
};

export default parseMessage;
