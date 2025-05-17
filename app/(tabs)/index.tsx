import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  PanResponder, 
  Animated,
  ActivityIndicator
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store';
import { likeProfile, dislikeProfile, refreshDiscoveryFeed } from '../../store/slices/profileSlice';
import { addPendingMatch } from '../../store/slices/matchesSlice';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Button from '../../components/ui/Button';
import { Heart, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const PROFILE_HEIGHT = height * 0.8;

// Add timeout configuration
const IMAGE_LOAD_TIMEOUT = 10000; // 10 seconds

export default function DiscoveryScreen() {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(state => state.profile.profiles);
  const discoveryFeed = useAppSelector(state => state.profile.discoveryFeed);
  const [refreshing, setRefreshing] = useState(false);
  const [swipingProfile, setSwipingProfile] = useState<string | null>(null);
  const swipeAnimations = useRef<{[key: string]: Animated.ValueXY}>({});
  
  // Initialize swipe animations for each profile
  useEffect(() => {
    discoveryFeed.forEach(profileId => {
      if (!swipeAnimations.current[profileId]) {
        swipeAnimations.current[profileId] = new Animated.ValueXY();
      }
    });
  }, [discoveryFeed]);

  const createPanResponder = (profileId: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setSwipingProfile(profileId);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow horizontal movement
        if (swipeAnimations.current[profileId]) {
          swipeAnimations.current[profileId].setValue({ 
            x: gestureState.dx, 
            y: 0 
          });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const animation = swipeAnimations.current[profileId];
        if (!animation) return;
        
        if (gestureState.dx > 120) {
          // Swipe right (like)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Animated.timing(animation, {
            toValue: { x: width, y: 0 },
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            handleLike(profileId);
            animation.setValue({ x: 0, y: 0 });
          });
        } else if (gestureState.dx < -120) {
          // Swipe left (dislike)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Animated.timing(animation, {
            toValue: { x: -width, y: 0 },
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            handleDislike(profileId);
            animation.setValue({ x: 0, y: 0 });
          });
        } else {
          // Reset position
          Animated.spring(animation, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
        
        setSwipingProfile(null);
      },
    });
  };

  const handleLike = (profileId: string) => {
    dispatch(likeProfile(profileId));
    
    // Simulate match logic (would normally be handled by backend)
    const matchId = `match-${Date.now()}`;
    const newPendingMatch = {
      id: matchId,
      userId: 'current-user',
      matchedUserId: profileId,
      likeStage: 1,
      lastInteraction: Date.now(),
    };
    
    dispatch(addPendingMatch(newPendingMatch));
  };
  
  const handleDislike = (profileId: string) => {
    dispatch(dislikeProfile(profileId));
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(refreshDiscoveryFeed());
    setRefreshing(false);
  };

  const renderProfileItem = ({ item: profileId }: { item: string }) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return null;

    const animation = swipeAnimations.current[profileId];
    const rotate = animation?.x.interpolate({
      inputRange: [-width / 2, 0, width / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });
    
    const likeOpacity = animation?.x.interpolate({
      inputRange: [0, width / 4],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    
    const dislikeOpacity = animation?.x.interpolate({
      inputRange: [-width / 4, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const panHandlers = createPanResponder(profileId).panHandlers;

    return (
      <View style={styles.profileContainer}>
        <Animated.View 
          style={[
            styles.profileCard,
            animation ? { 
              transform: [
                { translateX: animation.x },
                { rotate: rotate || '0deg' }
              ]
            } : {}
          ]}
          {...panHandlers}
        >
          <Image
            source={{ uri: profile.photos[0] }}
            style={styles.profileImage}
            resizeMode="cover"
            onError={() => {}}
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.profileOverlay}
          />
          
          {/* Like/Dislike Indicators */}
          <Animated.View
            style={[
              styles.swipeIndicator,
              styles.likeIndicator,
              { opacity: likeOpacity || 0 }
            ]}
          >
            <Text style={styles.indicatorText}>LIKE</Text>
          </Animated.View>
          
          <Animated.View
            style={[
              styles.swipeIndicator,
              styles.dislikeIndicator,
              { opacity: dislikeOpacity || 0 }
            ]}
          >
            <Text style={styles.indicatorText}>NOPE</Text>
          </Animated.View>
          
          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
            <Text style={styles.profileLocation}>{profile.location}</Text>
            
            <View style={styles.wishListContainer}>
              {profile.wishList.mustHaves.map((item: string) => (
                <View key={item} style={[styles.wishListItem, styles.mustHaveItem]}>
                  <Text style={styles.wishListText}>{item}</Text>
                </View>
              ))}
              
              {profile.wishList.niceToHaves.map((item: string) => (
                <View key={item} style={[styles.wishListItem, styles.niceToHaveItem]}>
                  <Text style={styles.wishListText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Action Buttons (visible in vertical scroll mode) */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dislikeButton]}
              onPress={() => handleDislike(profileId)}
            >
              <X size={24} color={Colors.error} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => handleLike(profileId)}
            >
              <Heart size={24} color={Colors.text.white} fill={Colors.primary.main} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>No more profiles</Text>
      <Text style={styles.emptyStateDescription}>
        We've run out of profiles to show you. Pull down to refresh or adjust your preferences.
      </Text>
      <Button
        title="Refresh"
        onPress={handleRefresh}
        gradient
        style={styles.refreshButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>
      
      <FlatList
        data={discoveryFeed}
        renderItem={renderProfileItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        snapToInterval={PROFILE_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={renderEmptyState}
      />
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
  contentContainer: {
    flexGrow: 1,
  },
  profileContainer: {
    height: PROFILE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileCard: {
    width: width - 32,
    height: PROFILE_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.background.paper,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  profileInfo: {
    position: 'absolute',
    bottom: 80, // Make room for action buttons
    left: 0,
    right: 0,
    padding: 20,
  },
  profileName: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.xxl,
    color: Colors.text.white,
  },
  profileLocation: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.white,
    marginTop: 4,
    marginBottom: 12,
  },
  wishListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  wishListItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  mustHaveItem: {
    backgroundColor: 'rgba(255, 75, 145, 0.8)',
  },
  niceToHaveItem: {
    backgroundColor: 'rgba(119, 67, 219, 0.8)',
  },
  wishListText: {
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
    color: Colors.text.white,
  },
  swipeIndicator: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 5,
    zIndex: 3,
  },
  likeIndicator: {
    right: 20,
    borderColor: Colors.success,
    transform: [{ rotate: '15deg' }],
  },
  dislikeIndicator: {
    left: 20,
    borderColor: Colors.error,
    transform: [{ rotate: '-15deg' }],
  },
  indicatorText: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.white,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.3)',
  },
  likeButton: {
    backgroundColor: Colors.primary.main,
  },
  dislikeButton: {
    backgroundColor: Colors.background.paper,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 100,
  },
  emptyStateTitle: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.xxl,
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    marginTop: 20,
    width: 200,
  },
});
