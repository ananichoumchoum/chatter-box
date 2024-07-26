const getBasicStrategy = (playerHand, dealerUpCard) => {
    const total = playerHand.reduce((acc, card) => acc + card.value, 0);
    const dealerCard = dealerUpCard.value;
  
    // Check for pairs
    if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value) {
        const pairValue = playerHand[0].value;
        switch (pairValue) {
        case 2:
        case 3:
            return dealerCard >= 2 && dealerCard <= 7 ? 'Split' : 'Hit';
        case 4:
            return dealerCard === 5 || dealerCard === 6 ? 'Split' : 'Hit';
        case 5:
            return dealerCard >= 2 && dealerCard <= 9 ? 'Double Down' : 'Hit';
        case 6:
            return dealerCard >= 2 && dealerCard <= 6 ? 'Split' : 'Hit';
        case 7:
            return dealerCard >= 2 && dealerCard <= 7 ? 'Split' : 'Hit';
        case 8:
            return 'Split';
        case 9:
            return dealerCard >= 2 && dealerCard <= 6 || dealerCard === 8 || dealerCard === 9 ? 'Split' : 'Stand';
        case 10:
            return 'Stand';
        case 11:
            return 'Split';
        default:
            return 'Hit';
        }
    }
    // Check for soft totals (hands with an ace counted as 11)
    const hasAce = playerHand.some(card => card.value === 11);
    if (hasAce) {
      const softTotal = total - 10;
      if (softTotal <= 17) {
        return 'Hit';
      } else if (softTotal >= 18) {
        return dealerCard >= 9 ? 'Hit' : 'Stand';
      } else if (softTotal === 19) {
        return dealerCard === 6 ? 'Double Down' : 'Stand';
      }
    }
     // Hard totals
    if (total <= 8) {
        return 'Hit';
    } else if (total === 9) {
        return dealerCard >= 3 && dealerCard <= 6 ? 'Double Down' : 'Hit';
    } else if (total === 10) {
        return dealerCard >= 2 && dealerCard <= 9 ? 'Double Down' : 'Hit';
    } else if (total === 11) {
        return dealerCard >= 2 && dealerCard <= 10 ? 'Double Down' : 'Hit';
    } else if (total === 12) {
        return dealerCard >= 4 && dealerCard <= 6 ? 'Stand' : 'Hit';
    } else if (total >= 13 && total <= 16) {
        return dealerCard >= 2 && dealerCard <= 6 ? 'Stand' : 'Hit';
    } else {
        return 'Stand';
    }
};

  
  export { getBasicStrategy };
  