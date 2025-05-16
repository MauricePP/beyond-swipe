import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileMatch } from '../../types';
import { generateMockMatches } from '../../utils/mockData';

interface MatchesState {
  matches: ProfileMatch[];
  pendingMatches: ProfileMatch[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchesState = {
  matches: generateMockMatches(5),
  pendingMatches: [],
  isLoading: false,
  error: null
};

export const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<ProfileMatch[]>) => {
      state.matches = action.payload;
    },
    addMatch: (state, action: PayloadAction<ProfileMatch>) => {
      state.matches = [action.payload, ...state.matches];
    },
    updateMatchStage: (state, action: PayloadAction<{ matchId: string; likeStage: number }>) => {
      const { matchId, likeStage } = action.payload;
      const match = state.matches.find(m => m.id === matchId);
      if (match) {
        match.likeStage = likeStage;
        
        // If both users have reached stage 3, set the match timestamp
        if (likeStage === 3) {
          match.matchTimestamp = Date.now();
        }
      }
    },
    addPendingMatch: (state, action: PayloadAction<ProfileMatch>) => {
      state.pendingMatches = [action.payload, ...state.pendingMatches];
    },
    removePendingMatch: (state, action: PayloadAction<string>) => {
      state.pendingMatches = state.pendingMatches.filter(m => m.id !== action.payload);
    },
    startLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { 
  setMatches, 
  addMatch, 
  updateMatchStage,
  addPendingMatch,
  removePendingMatch,
  startLoading, 
  setError 
} = matchesSlice.actions;

export default matchesSlice.reducer;
