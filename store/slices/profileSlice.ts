import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { generateMockProfiles } from '../../utils/mockData';

interface ProfileState {
  profiles: User[];
  currentProfile: User | null;
  discoveryFeed: string[]; // IDs of profiles to show
  viewedProfiles: Record<string, boolean>; // Profile IDs already viewed
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profiles: generateMockProfiles(20),
  currentProfile: null,
  discoveryFeed: [],
  viewedProfiles: {},
  isLoading: false,
  error: null
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfiles: (state, action: PayloadAction<User[]>) => {
      state.profiles = action.payload;
      // Generate initial discovery feed
      state.discoveryFeed = action.payload.map(profile => profile.id);
    },
    setCurrentProfile: (state, action: PayloadAction<User | null>) => {
      state.currentProfile = action.payload;
    },
    likeProfile: (state, action: PayloadAction<string>) => {
      // This would trigger a side effect to update matches in a real app
      state.viewedProfiles[action.payload] = true;
      state.discoveryFeed = state.discoveryFeed.filter(id => id !== action.payload);
    },
    dislikeProfile: (state, action: PayloadAction<string>) => {
      state.viewedProfiles[action.payload] = true;
      state.discoveryFeed = state.discoveryFeed.filter(id => id !== action.payload);
    },
    refreshDiscoveryFeed: (state) => {
      // In a real app, this would fetch new profiles from the API
      state.discoveryFeed = state.profiles
        .filter(profile => !state.viewedProfiles[profile.id])
        .map(profile => profile.id);
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
  setProfiles, 
  setCurrentProfile, 
  likeProfile, 
  dislikeProfile,
  refreshDiscoveryFeed,
  startLoading, 
  setError 
} = profileSlice.actions;

export default profileSlice.reducer;
