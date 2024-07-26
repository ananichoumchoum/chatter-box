let runningCount = 0;
const updateRunningCount = (card) => {
    if (card.value === 2 || card.value === 3 || card.value === 7) {
        runningCount += 1;
    } else if (card.value === 4 || card.value === 5 || card.value === 6) {
        runningCount += 2;
    } else if (card.value === 8 || card.value === 9) {
        runningCount += 0;
    } else if (card.value === 10 || card.value === 11) {
        runningCount -= 2;
    } else if (card.value === 1) {
        runningCount -= 1;
    }
};

const calculateTrueCount = (numberOfDecks) => {
  return runningCount / numberOfDecks;
};

const makeDecisionBasedOnTrueCount = (trueCount) => {
  if (trueCount >= 3) {
    return ' count higher or equal to 3. Consider increasing your bet significantly.';
  } else if (trueCount >= 1) {
    return 'count higher than 1 but lower than 3. Consider increasing your bet slightly.';
  } else if (trueCount <= -1) {
    return 'count lower or equal to -1. Consider decreasing your bet.';
  } else {
    return 'Continue with normal bet.';
  }
};

export { updateRunningCount, calculateTrueCount, makeDecisionBasedOnTrueCount, runningCount };
