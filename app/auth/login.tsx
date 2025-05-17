import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAppDispatch } from '../../store';
import { setUser } from '../../store/slices/userSlice';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createClient } from '@supabase/supabase-js';
import * as Haptics from 'expo-haptics';

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile from your profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        // Update Redux store with user data
        dispatch(setUser({
          id: data.user.id,
          email: data.user.email!,
          ...profile,
        }));

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Login' }} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            containerStyle={styles.inputContainer}
          />

          <Button
            title={loading ? "Signing in..." : "Sign In"}
            onPress={handleLogin}
            fullWidth
            style={styles.button}
            gradient
            disabled={loading}
          />

          <TouchableOpacity 
            onPress={() => router.push('/auth/reset-password')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.xxl,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.secondary,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: Colors.error + '10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.small,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: Colors.primary.main,
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.small,
  },
  signupLink: {
    color: Colors.primary.main,
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
  },
}); 