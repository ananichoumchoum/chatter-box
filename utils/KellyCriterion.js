const kellyCriterion = (bankroll, edge, odds, fraction = 1) => {
  const betFraction = fraction * ((edge - (1 - edge) / odds) / odds);
  return Math.max(10, Math.min(bankroll, bankroll * betFraction)); // Ensure bet is not negative and does not exceed bankroll
};

export default kellyCriterion;
