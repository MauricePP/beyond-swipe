import { User, ProfileMatch, DateProposal } from '../types';
import { format, addDays } from 'date-fns';

// Mock image URLs
const mockImageUrls = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
];

// Mock data generators
export const generateMockProfiles = (count: number): User[] => {
  const relationshipGoals = ['Casual dating', 'Long-term relationship', 'Marriage', 'Not sure yet'];
  const genders = ['Male', 'Female', 'Non-binary'];
  const politicalViews = ['Liberal', 'Conservative', 'Moderate', 'Not political', 'Other'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Seattle', 'Boston', 'Denver'];
  
  const mustHaveOptions = [
    'Ambitious', 'Family-oriented', 'Outdoorsy', 'Intellectual', 
    'Creative', 'Spiritual', 'Funny', 'Adventurous', 'Career-focused'
  ];
  
  const niceToHaveOptions = [
    'Athletic', 'Artistic', 'Loves travel', 'Animal lover', 'Foodie',
    'Tech-savvy', 'Meditates', 'Volunteers', 'Reads a lot', 'Politically active'
  ];
  
  const bios = [
    "Looking for someone to share adventures with. I love hiking, traveling, and trying new restaurants.",
    "Coffee enthusiast, dog lover, and weekend hiker. Looking for someone with similar interests.",
    "Life is short, let's make it meaningful. Passionate about photography and exploring new places.",
    "Foodie who loves cooking and trying new recipes. Also enjoy outdoor activities and good conversation.",
    "Tech professional by day, amateur chef by night. Looking for someone to share laughs and create memories with."
  ];

  return Array.from({ length: count }, (_, i) => {
    const randomPhotoCount = Math.floor(Math.random() * 5) + 3; // 3-7 photos
    const photos = Array.from({ length: randomPhotoCount }, () => 
      mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)] + 
      '?w=400&fit=crop&auto=format'
    );
    
    // Randomly select 1-2 must haves
    const mustHavesCount = Math.floor(Math.random() * 2) + 1;
    const mustHaves = shuffle(mustHaveOptions).slice(0, mustHavesCount);
    
    // Randomly select 2-4 nice to haves
    const niceToHavesCount = Math.floor(Math.random() * 3) + 2;
    const niceToHaves = shuffle(niceToHaveOptions).slice(0, niceToHavesCount);

    return {
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      age: Math.floor(Math.random() * 20) + 25, // 25-44
      location: cities[Math.floor(Math.random() * cities.length)],
      bio: bios[Math.floor(Math.random() * bios.length)],
      photos,
      preferences: {
        ageRange: [25, 40],
        distance: 25, // miles
        gender: shuffle(genders).slice(0, Math.floor(Math.random() * 2) + 1),
        relationshipGoals: [relationshipGoals[Math.floor(Math.random() * relationshipGoals.length)]],
        politicalViews: politicalViews[Math.floor(Math.random() * politicalViews.length)]
      },
      wishList: {
        mustHaves,
        niceToHaves
      },
      premium: Math.random() > 0.7 // 30% chance of being premium
    };
  });
};

export const generateMockMatches = (count: number): ProfileMatch[] => {
  return Array.from({ length: count }, (_, i) => {
    const likeStage = Math.floor(Math.random() * 3) + 1; // Random stage 1-3
    const hasMatched = likeStage === 3 && Math.random() > 0.5;
    
    return {
      id: `match-${i + 1}`,
      userId: 'current-user',
      matchedUserId: `user-${i + 1}`,
      likeStage,
      matchTimestamp: hasMatched ? Date.now() - Math.floor(Math.random() * 86400000) : undefined, // Random time in the last 24h if matched
      lastInteraction: Date.now() - Math.floor(Math.random() * 604800000) // Random time in the last week
    };
  });
};

export const generateMockDateProposals = (count: number): DateProposal[] => {
  const activities = ['Coffee', 'Drinks', 'Dinner', 'Walk in the park', 'Museum visit', 'Movie'];
  const locations = [
    'Central Coffee House', 'Harbor Bistro', 'City Park', 'Downtown Cinema',
    'Art Museum', 'Riverside Walk', 'The Local Pub', 'Harmony Gardens'
  ];
  const statuses = ['pending', 'accepted', 'countered', 'declined'] as const;

  return Array.from({ length: count }, (_, i) => {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const daysFromNow = Math.floor(Math.random() * 7) + 1; // 1-7 days from now
    const dateTime = format(addDays(new Date(), daysFromNow), "yyyy-MM-dd'T'HH:mm:ss");
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `date-${i + 1}`,
      matchId: `match-${i + 1}`,
      proposerId: Math.random() > 0.5 ? 'current-user' : `user-${i + 1}`,
      receiverId: Math.random() > 0.5 ? `user-${i + 1}` : 'current-user',
      location,
      dateTime,
      activity,
      status,
      counterProposal: status === 'countered' ? {
        matchId: `match-${i + 1}`,
        proposerId: `user-${i + 1}`,
        receiverId: 'current-user',
        location: locations[Math.floor(Math.random() * locations.length)],
        dateTime: format(addDays(new Date(), daysFromNow + 1), "yyyy-MM-dd'T'HH:mm:ss"),
        activity: activities[Math.floor(Math.random() * activities.length)],
        status: 'pending',
        createdAt: Date.now()
      } : undefined,
      createdAt: Date.now() - Math.floor(Math.random() * 86400000) // Random time in the last 24h
    };
  });
};

// Helper function to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
