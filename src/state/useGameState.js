import { useState, useCallback } from 'react';

const INITIAL_STATE = {
  reputation: 0,
  hasSilverSword: false,
  metSorceress: false,
  trustLevel: 0,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState(INITIAL_STATE);

  const applyEffects = useCallback((effects) => {
    if (!effects) return;
    setGameState((prevState) => ({
      ...prevState,
      ...effects,
    }));
  }, []);

  const resetState = useCallback(() => {
    setGameState(INITIAL_STATE);
  }, []);

  return { gameState, applyEffects, resetState };
};