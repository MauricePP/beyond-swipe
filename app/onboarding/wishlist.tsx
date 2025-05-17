import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';

export default function WishlistScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Wishlist' }} />
      <Text style={styles.text}>Wishlist Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.text.primary,
    fontSize: 16,
  },
}); 