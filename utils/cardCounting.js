let runningCount = 0;
const updateRunningCount = (card) => {
    if (card.value === 2 || card.value === 3 || card.value === 7) {
      runningCount += 1;
    } else if (card.value === 4 || card.value === 5 || card.value === 6) {
      runningCount += 2;
    } else if (card.value === 10 || card.value === 11 || card.value === 1) {
      runningCount -= 2;
    }
  };

const calculateTrueCount = (numberOfDecks) => {
  return runningCount / numberOfDecks;
};

const makeDecisionBasedOnTrueCount = (trueCount) => {
  if (trueCount >= 3) {
    return 'Consider increasing your bet significantly.';
  } else if (trueCount >= 1) {
    return 'Consider increasing your bet slightly.';
  } else if (trueCount <= -1) {
    return 'Consider decreasing your bet.';
  } else {
    return 'Continue with normal bet.';
  }
};

export { updateRunningCount, calculateTrueCount, makeDecisionBasedOnTrueCount, runningCount };
