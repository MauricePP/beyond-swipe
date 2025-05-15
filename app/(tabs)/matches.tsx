import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateMatchStage } from '../../store/slices/matchesSlice';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Heart, MessageSquare, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MatchWithUser } from '../../types';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

export default function MatchesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const matches = useAppSelector(state => state.matches.matches);
  const pendingMatches = useAppSelector(state => state.matches.pendingMatches);
  const profiles = useAppSelector(state => state.profile.profiles);
  const [matchesWithUsers, setMatchesWithUsers] = useState<MatchWithUser[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  
  useEffect(() => {
    // Combine matches with user profiles
    const withUsers = matches.map(match => {
      const user = profiles.find(p => p.id === match.matchedUserId);
      return { ...match, user: user! };
    }).filter(match => match.user); // Filter out any matches without user data
    
    // Sort by matchTimestamp desc (newest first)
    withUsers.sort((a, b) => {
      if (!a.matchTimestamp) return 1;
      if (!b.matchTimestamp) return -1;
      return b.matchTimestamp - a.matchTimestamp;
    });
    
    setMatchesWithUsers(withUsers);
  }, [matches, profiles]);
  
  const handleLike = (matchId: string, currentStage: number) => {
    if (currentStage >= 3) return; // Already at max stage
    
    const newStage = currentStage + 1;
    
    // Provide haptic feedback based on stage
    if (newStage === 2) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (newStage === 3) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    dispatch(updateMatchStage({ matchId, likeStage: newStage }));
  };
  
  const handlePlanDate = (matchId: string) => {
    router.push({ pathname: '/date/planning', params: { matchId } });
  };

  const renderMatchItem = ({ item }: { item: MatchWithUser }) => {
    const isMatched = item.likeStage === 3 && item.matchTimestamp;
    const matchDate = item.matchTimestamp 
      ? format(new Date(item.matchTimestamp), 'MMM d, yyyy')
      : null;
    
    return (
      <Card style={styles.matchCard}>
        <View style={styles.matchContent}>
          <Image source={{ uri: item.user.photos[0] }} style={styles.matchPhoto} />
          
          <View style={styles.matchInfo}>
            <Text style={styles.matchName}>{item.user.name}, {item.user.age}</Text>
            <Text style={styles.matchLocation}>{item.user.location}</Text>
            
            {matchDate && (
              <Text style={styles.matchDate}>Matched on {matchDate}</Text>
            )}
            
            <View style={styles.likeStagesContainer}>
              {[1, 2, 3].map(stage => (
                <View 
                  key={stage}
                  style={[
                    styles.likeStage,
                    item.likeStage >= stage ? styles.activeLikeStage : styles.inactiveLikeStage
                  ]}
                >
                  <Heart 
                    size={14} 
                    color={item.likeStage >= stage ? Colors.text.white : Colors.primary.light}
                    fill={item.likeStage >= stage ? Colors.text.white : "none"}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.matchActions}>
          {isMatched ? (
            <Button
              title="Plan Date"
              onPress={() => handlePlanDate(item.id)}
              size="small"
              leftIcon={<Calendar size={16} color={Colors.text.white} />}
              style={styles.actionButton}
            />
          ) : (
            <Button
              title={`Like ${item.likeStage < 3 ? (item.likeStage + 1) : ''}`}
              onPress={() => handleLike(item.id, item.likeStage)}
              size="small"
              disabled={item.likeStage >= 3}
              leftIcon={<Heart size={16} color={Colors.text.white} />}
              style={styles.actionButton}
            />
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.activeTabText
            ]}
          >
            Active Matches
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'pending' && styles.activeTabText
            ]}
          >
            Pending ({pendingMatches.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'active' && (
        <>
          {matchesWithUsers.length > 0 ? (
            <FlatList
              data={matchesWithUsers}
              renderItem={renderMatchItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.matchesList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateTitle}>No matches yet</Text>
              <Text style={styles.emptyStateDescription}>
                Start swiping right on profiles you like to create matches.
              </Text>
            </View>
          )}
        </>
      )}
      
      {activeTab === 'pending' && (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>Pending Connections</Text>
          <Text style={styles.emptyStateDescription}>
            People you've liked will appear here until they like you back.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  activeTab: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  tabText: {
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.text.white,
  },
  matchesList: {
    padding: 16,
  },
  matchCard: {
    marginBottom: 16,
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 16,
  },
  matchName: {
    fontFamily: Typography.fontFamily.primarySemiBold,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.primary,
  },
  matchLocation: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  matchDate: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  likeStagesContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  likeStage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeLikeStage: {
    backgroundColor: Colors.primary.main,
  },
  inactiveLikeStage: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.light,
  },
  matchActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  actionButton: {
    minWidth: 120,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
