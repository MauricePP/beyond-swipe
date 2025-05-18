import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../store';
import { setUser } from '../store/slices/userSlice';

export default function Index() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
  
  useEffect(() => {
    // Check for existing session/token here
    // For now, we'll keep the demo user logic
    const checkAuth = async () => {
      try {
        // TODO: Implement proper auth check
        // For demo purposes, we'll keep the mock user
        dispatch(setUser({
          id: 'current-user',
          name: 'Alex Johnson',
          age: 29,
          location: 'Seattle, WA',
          bio: 'Coffee enthusiast, hiking lover and tech professional. Looking for genuine connections.',
          photos: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&auto=format'
          ],
          preferences: {
            ageRange: [25, 40],
            distance: 25,
            gender: ['Female'],
            relationshipGoals: ['Long-term relationship'],
          },
          wishList: {
            mustHaves: ['Ambitious', 'Family-oriented'],
            niceToHaves: ['Athletic', 'Loves travel', 'Foodie', 'Reads a lot'],
          },
          premium: false,
        }));
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [dispatch]);
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  
  // If not authenticated, show welcome page
  return <Redirect href="/welcome" />;
}
