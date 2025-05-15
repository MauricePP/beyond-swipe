import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateProposal } from '../../types';
import { generateMockDateProposals } from '../../utils/mockData';

interface DatesState {
  dateProposals: DateProposal[];
  upcomingDates: DateProposal[];
  pastDates: DateProposal[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DatesState = {
  dateProposals: generateMockDateProposals(3),
  upcomingDates: [],
  pastDates: [],
  isLoading: false,
  error: null
};

export const datesSlice = createSlice({
  name: 'dates',
  initialState,
  reducers: {
    setDateProposals: (state, action: PayloadAction<DateProposal[]>) => {
      state.dateProposals = action.payload;
    },
    addDateProposal: (state, action: PayloadAction<DateProposal>) => {
      state.dateProposals = [action.payload, ...state.dateProposals];
    },
    updateDateProposal: (state, action: PayloadAction<{ id: string; data: Partial<DateProposal> }>) => {
      const { id, data } = action.payload;
      const index = state.dateProposals.findIndex(proposal => proposal.id === id);
      
      if (index !== -1) {
        state.dateProposals[index] = {
          ...state.dateProposals[index],
          ...data
        };
        
        // If the date is accepted, move it to upcoming dates
        if (data.status === 'accepted') {
          const acceptedDate = state.dateProposals[index];
          state.upcomingDates = [acceptedDate, ...state.upcomingDates];
          state.dateProposals = state.dateProposals.filter(proposal => proposal.id !== id);
        }
      }
    },
    setUpcomingDates: (state, action: PayloadAction<DateProposal[]>) => {
      state.upcomingDates = action.payload;
    },
    setPastDates: (state, action: PayloadAction<DateProposal[]>) => {
      state.pastDates = action.payload;
    },
    moveToPastDates: (state, action: PayloadAction<string>) => {
      const dateId = action.payload;
      const index = state.upcomingDates.findIndex(date => date.id === dateId);
      
      if (index !== -1) {
        const pastDate = state.upcomingDates[index];
        state.pastDates = [pastDate, ...state.pastDates];
        state.upcomingDates = state.upcomingDates.filter(date => date.id !== dateId);
      }
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
  setDateProposals, 
  addDateProposal, 
  updateDateProposal,
  setUpcomingDates,
  setPastDates,
  moveToPastDates,
  startLoading, 
  setError 
} = datesSlice.actions;

export default datesSlice.reducer;
