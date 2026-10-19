import { useState, useCallback } from 'react';

const INITIAL_STATE = {
  evidence: null,
  eustachyPunished: null,
  pastodiSpared: null,
  truthKnown: false,
  checkedHead: false,
  checkedChest: false,
  checkedAbdomen: false,
  checkedHands: false,
  checkedGenitals: false,
  foundEustachy: false,
  checkedCarpenter: false,
  checkedLane: false
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