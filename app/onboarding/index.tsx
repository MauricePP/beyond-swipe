import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch } from '../../store';
import { setUser } from '../../store/slices/userSlice';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    location: '',
    bio: '',
  });
  
  const handleChange = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value });
  };
  
  const handleNext = () => {
    // Validate inputs
    if (step === 1) {
      if (!userData.name) {
        alert('Please enter your name');
        return;
      }
      if (!userData.age || isNaN(Number(userData.age))) {
        alert('Please enter a valid age');
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep(2);
    } else if (step === 2) {
      if (!userData.location) {
        alert('Please enter your location');
        return;
      }
      if (!userData.bio) {
        alert('Please write a short bio');
        return;
      }
      
      // Setup a mock user with the entered data
      dispatch(setUser({
        id: 'current-user',
        name: userData.name,
        age: parseInt(userData.age),
        location: userData.location,
        bio: userData.bio,
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
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    }
  };
  
  const handleSkip = () => {
    // For demo purposes, use default data
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
    
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary.light, Colors.secondary.main]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Beyond Swipes</Text>
          <Text style={styles.subtitle}>Find meaningful connections and move beyond endless chats</Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, step >= 1 && styles.activeStepDot]} />
            <View style={[styles.stepDot, step >= 2 && styles.activeStepDot]} />
          </View>
          
          {step === 1 ? (
            <>
              <Text style={styles.formTitle}>Let's get started</Text>
              <Text style={styles.formSubtitle}>Tell us about yourself</Text>
              
              <Input
                label="Name"
                placeholder="Your name"
                value={userData.name}
                onChangeText={(text) => handleChange('name', text)}
                containerStyle={styles.inputContainer}
              />
              
              <Input
                label="Age"
                placeholder="Your age"
                keyboardType="number-pad"
                value={userData.age}
                onChangeText={(text) => handleChange('age', text)}
                containerStyle={styles.inputContainer}
              />
            </>
          ) : (
            <>
              <Text style={styles.formTitle}>Almost there</Text>
              <Text style={styles.formSubtitle}>A bit more about you</Text>
              
              <Input
                label="Location"
                placeholder="City, State"
                value={userData.location}
                onChangeText={(text) => handleChange('location', text)}
                containerStyle={styles.inputContainer}
              />
              
              <Input
                label="Bio"
                placeholder="Write a short bio"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={userData.bio}
                onChangeText={(text) => handleChange('bio', text)}
                containerStyle={styles.inputContainer}
                inputStyle={styles.bioInput}
              />
            </>
          )}
          
          <Button
            title={step === 1 ? "Next" : "Get Started"}
            onPress={handleNext}
            fullWidth
            style={styles.button}
            gradient
          />
          
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: 32,
    color: Colors.text.white,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: Colors.background.paper,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginTop: 'auto',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.divider,
    marginHorizontal: 4,
  },
  activeStepDot: {
    backgroundColor: Colors.primary.main,
    width: 20,
  },
  formTitle: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  formSubtitle: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
  button: {
    marginTop: 8,
  },
  skipButton: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  skipText: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
  },
});
