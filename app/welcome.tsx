import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../components/ui/Button';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Beyond Swipes</Text>
            <Text style={styles.tagline}>Find meaningful connections that last</Text>
            
            <View style={styles.buttonContainer}>
              <Link href="/auth/login" asChild>
                <Button variant="default" style={styles.button}>
                  Login
                </Button>
              </Link>
              
              <Link href="/auth/signup" asChild>
                <Button variant="outline" style={styles.button}>
                  Register
                </Button>
              </Link>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  button: {
    width: '100%',
  },
}); 