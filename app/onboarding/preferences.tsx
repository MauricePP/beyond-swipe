import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';

export default function PreferencesScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Preferences' }} />
      <Text style={styles.text}>Preferences Screen</Text>
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