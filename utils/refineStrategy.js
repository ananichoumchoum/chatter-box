const refineStrategy = (basicStrategy, trueCount, countDecision, newHighClump, newLowClump, runningCount) => {
    // Adjust strategy and betting based on shuffle tracking results
    let betAdjustment = 0;
    if (newHighClump.length > newLowClump.length) {
      console.log('High clump detected. Consider increasing your bet.');
      betAdjustment = 1; // Increase bet
    } else if (newLowClump.length > newHighClump.length) {
      console.log('Low clump detected. Consider decreasing your bet.');
      betAdjustment = -1; // Decrease bet
    } else {
      console.log('Balanced clumps. Continue with normal bet.');
      betAdjustment = 0; // Normal bet
    }
  
    // Refined strategy combining all elements
    const refinedStrategy = {
      strategy: basicStrategy,
      countDecision,
      betAdjustment,
      trueCount,
      runningCount
    };
  
    return refinedStrategy;
  };
  
  export default refineStrategy;
  