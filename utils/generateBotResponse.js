import parseMessage from './parseMessage'; 

const generateBotResponse = (message) => {
  const parsedData = parseMessage(message);
  if (parsedData) {
    return `Ok, be there at ${parsedData.numberOfPlayers} pm. Sure ${parsedData.numberOfDecks} total is fine. See you at ${parsedData.sideBets}. Dont forget to bring ${parsedData.minBet} rolls`;
  }
  return null;
};

export default generateBotResponse;
