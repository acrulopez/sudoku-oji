import { useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';

/** Drives the 1-second timer tick while a game is actively playing. */
export function useGameTimer() {
  const status = useGameStore((s) => s.status);
  const tick = useGameStore((s) => s.tick);
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status, tick]);
}
