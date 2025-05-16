import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/slices/userSlice';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  User, Heart, Settings, LogOut, AlertTriangle,
  Shield, CreditCard, Bell, Lock, HelpCircle
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  
  // Mock user data if none exists
  const user = currentUser || {
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
  };
  
  const handleLogout = () => {
    dispatch(logout());
    router.replace('/auth/login');
  };
  
  const goToSafetyContacts = () => {
    router.push('/safety/contacts');
  };
  
  const goToEditProfile = () => {
    router.push('/profile/edit');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={goToEditProfile}>
          <Settings size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: user.photos[0] }} 
            style={styles.profilePhoto}
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}, {user.age}</Text>
            <Text style={styles.profileLocation}>{user.location}</Text>
            
            {!user.premium && (
              <Button
                title="Upgrade to Premium"
                variant="outline"
                size="small"
                style={styles.upgradeButton}
              />
            )}
          </View>
        </View>
        
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
        
        <Card style={styles.preferencesCard}>
          <Text style={styles.cardTitle}>My Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Age Range</Text>
            <Text style={styles.preferenceValue}>{user.preferences.ageRange[0]}-{user.preferences.ageRange[1]}</Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Distance</Text>
            <Text style={styles.preferenceValue}>{user.preferences.distance} miles</Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Interested In</Text>
            <Text style={styles.preferenceValue}>{user.preferences.gender.join(', ')}</Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Relationship Goals</Text>
            <Text style={styles.preferenceValue}>{user.preferences.relationshipGoals.join(', ')}</Text>
          </View>
        </Card>
        
        <Card style={styles.wishlistCard}>
          <Text style={styles.cardTitle}>My Wish List</Text>
          
          <Text style={styles.wishlistSubtitle}>Must-Haves</Text>
          <View style={styles.wishlistTags}>
            {user.wishList.mustHaves.map(item => (
              <View key={item} style={[styles.wishlistTag, styles.mustHaveTag]}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.wishlistSubtitle}>Nice-to-Haves</Text>
          <View style={styles.wishlistTags}>
            {user.wishList.niceToHaves.map(item => (
              <View key={item} style={[styles.wishlistTag, styles.niceToHaveTag]}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </Card>
        
        <Card style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={goToSafetyContacts}>
            <Shield size={20} color={Colors.text.primary} />
            <Text style={styles.settingText}>Safety Contacts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <CreditCard size={20} color={Colors.text.primary} />
            <Text style={styles.settingText}>Payment Methods</Text>
          </TouchableOpacity>
          
          <View style={styles.settingRow}>
            <Bell size={20} color={Colors.text.primary} />
            <Text style={styles.settingText}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.divider, true: Colors.primary.light }}
              thumbColor={notifications ? Colors.primary.main : Colors.text.disabled}
              style={styles.switch}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Lock size={20} color={Colors.text.primary} />
            <Text style={styles.settingText}>Location Sharing</Text>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: Colors.divider, true: Colors.primary.light }}
              thumbColor={locationSharing ? Colors.primary.main : Colors.text.disabled}
              style={styles.switch}
            />
          </View>
          
          <TouchableOpacity style={styles.settingRow}>
            <HelpCircle size={20} color={Colors.text.primary} />
            <Text style={styles.settingText}>Help & Support</Text>
          </TouchableOpacity>
        </Card>
        
        <Button
          title="Log Out"
          variant="outline"
          onPress={handleLogout}
          leftIcon={<LogOut size={18} color={Colors.primary.main} />}
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary.main,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  profileLocation: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  upgradeButton: {
    alignSelf: 'flex-start',
  },
  bioSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.primarySemiBold,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  bioText: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  preferencesCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: Typography.fontFamily.primarySemiBold,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  preferenceLabel: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.secondary,
  },
  preferenceValue: {
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.primary,
  },
  wishlistCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  wishlistSubtitle: {
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
    marginTop: 8,
    marginBottom: 6,
  },
  wishlistTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wishlistTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  mustHaveTag: {
    backgroundColor: Colors.primary.light,
  },
  niceToHaveTag: {
    backgroundColor: Colors.secondary.light,
  },
  tagText: {
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
    color: Colors.text.white,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  settingText: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.primary,
    marginLeft: 12,
    flex: 1,
  },
  switch: {
    marginLeft: 'auto',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
});
