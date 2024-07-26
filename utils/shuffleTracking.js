const shuffleDeck = (deck) => {
    // Simulate a complex shuffle: multiple riffles and interleaves
    const shuffle = (deck) => {
      const mid = Math.floor(deck.length / 2);
      const left = deck.slice(0, mid);
      const right = deck.slice(mid);
  
      const shuffledDeck = [];
      while (left.length || right.length) {
        if (Math.random() > 0.5 && left.length) {
          shuffledDeck.push(left.shift());
        } else if (right.length) {
          shuffledDeck.push(right.shift());
        }
      }
      return shuffledDeck;
    };
  
    // Perform multiple riffles
    let shuffledDeck = deck;
    for (let i = 0; i < 5; i++) {
      shuffledDeck = shuffle(shuffledDeck);
    }
  
    // Perform cuts
    const cutPoint = Math.floor(Math.random() * shuffledDeck.length);
    const leftCut = shuffledDeck.slice(0, cutPoint);
    const rightCut = shuffledDeck.slice(cutPoint);
  
    return [...rightCut, ...leftCut];
  };
  
  const trackShuffledDeck = (deck) => {
    // Identify clumps of high or low cards
    const highCards = ['10', 'J', 'Q', 'K', 'A'];
    const lowCards = ['2', '3', '4', '5', '6'];
  
    const highClump = [];
    const lowClump = [];
  
    for (let i = 0; i < deck.length; i++) {
      if (highCards.includes(deck[i])) highClump.push(i);
      if (lowCards.includes(deck[i])) lowClump.push(i);
    }
  
    // Track these clumps through a complex shuffle
    const shuffledDeck = shuffleDeck(deck);
  
    const newHighClump = highClump.map(index => shuffledDeck[index]);
    const newLowClump = lowClump.map(index => shuffledDeck[index]);
  
    return { shuffledDeck, newHighClump, newLowClump };
  };
  
  export { trackShuffledDeck };
  