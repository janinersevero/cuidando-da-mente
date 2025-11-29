import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // Estado atual do jogo
  element: null,
  progress: 0,
  sessionTime: 120, // 120 segundos total
  timeRemaining: 120,
  calm: false,
  hits: 0,
  misses: 0,
  gestureIntensity: 0,
  breathingRhythm: 0,
  isGameActive: false,
  gameStartTime: null,

  // Actions
  setElement: (element) => set({ element }),
  
  updateProgress: (delta) => set((state) => ({
    progress: Math.max(0, Math.min(100, state.progress + delta))
  })),
  
  setProgress: (progress) => set({ progress: Math.max(0, Math.min(100, progress)) }),
  
  setCalmState: (calm) => set({ calm }),
  
  incrementHits: () => set((state) => ({ hits: state.hits + 1 })),
  
  incrementMisses: () => set((state) => ({ misses: state.misses + 1 })),
  
  setGestureIntensity: (intensity) => set({ gestureIntensity: intensity }),
  
  setBreathingRhythm: (rhythm) => set({ breathingRhythm: rhythm }),
  
  startGame: () => set({
    isGameActive: true,
    gameStartTime: Date.now(),
    timeRemaining: 120,
    progress: 0,
    hits: 0,
    misses: 0,
    calm: false,
    gestureIntensity: 0,
    breathingRhythm: 0
  }),
  
  endGame: () => set({
    isGameActive: false,
    gameStartTime: null
  }),
  
  updateTimeRemaining: () => set((state) => {
    if (!state.isGameActive || !state.gameStartTime) return state;
    
    const elapsed = (Date.now() - state.gameStartTime) / 1000;
    const remaining = Math.max(0, state.sessionTime - elapsed);
    
    if (remaining === 0) {
      return {
        ...state,
        timeRemaining: 0,
        isGameActive: false
      };
    }
    
    return { timeRemaining: remaining };
  }),
  
  resetGame: () => set({
    element: null,
    progress: 0,
    timeRemaining: 120,
    calm: false,
    hits: 0,
    misses: 0,
    gestureIntensity: 0,
    breathingRhythm: 0,
    isGameActive: false,
    gameStartTime: null
  }),
  
  // Getters computados
  getSuccessRate: () => {
    const state = get();
    const total = state.hits + state.misses;
    return total > 0 ? (state.hits / total) * 100 : 0;
  },
  
  getTimeElapsed: () => {
    const state = get();
    return state.sessionTime - state.timeRemaining;
  }
}));

export default useGameStore;
