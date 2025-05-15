export interface User {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  photos: string[];
  preferences: {
    ageRange: [number, number];
    distance: number;
    gender: string[];
    relationshipGoals: string[];
    politicalViews?: string;
  };
  wishList: {
    mustHaves: string[];
    niceToHaves: string[];
  };
  emergencyContacts?: EmergencyContact[];
  premium: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface ProfileMatch {
  id: string;
  userId: string;
  matchedUserId: string;
  likeStage: number; // 1, 2, or 3
  matchTimestamp?: number; // When both reach stage 3
  lastInteraction: number;
}

export interface DateProposal {
  id: string;
  matchId: string;
  proposerId: string;
  receiverId: string;
  location: string;
  dateTime: string;
  activity: string;
  status: 'pending' | 'accepted' | 'countered' | 'declined';
  counterProposal?: Omit<DateProposal, 'counterProposal' | 'id'>;
  createdAt: number;
}

export interface MatchWithUser extends ProfileMatch {
  user: User;
}

export interface DateWithUsers extends DateProposal {
  proposer: User;
  receiver: User;
}
