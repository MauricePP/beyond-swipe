import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ArrowLeft, Plus, Edit2, Trash2, User, Phone, Share2 } from 'lucide-react-native';
import { EmergencyContact } from '../../types';

export default function SafetyContactsScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Jane Doe', phone: '(555) 123-4567', relationship: 'Friend' },
    { id: '2', name: 'John Smith', phone: '(555) 987-6543', relationship: 'Family' },
  ]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: '',
    phone: '',
    relationship: '',
  });
  
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    
    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship,
    };
    
    setContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '', relationship: '' });
    setShowAddContact(false);
  };
  
  const deleteContact = (id: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setContacts(contacts.filter(c => c.id !== id))
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Safety Features',
          headerTitleStyle: {
            fontFamily: Typography.fontFamily.primarySemiBold,
            fontSize: Typography.fontSize.large,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
          headerShown: true,
        }} 
      />
      
      <View style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Date Safety Features</Text>
          <Text style={styles.infoText}>
            Add emergency contacts who can be notified of your whereabouts during dates.
            You can share your location and date details with them at any time.
          </Text>
        </Card>
        
        <View style={styles.contactsHeader}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddContact(true)}
          >
            <Plus size={20} color={Colors.primary.main} />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>
        
        {contacts.length > 0 ? (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.contactCard}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactDetails}>{item.relationship} • {item.phone}</Text>
                </View>
                
                <View style={styles.contactActions}>
                  <TouchableOpacity 
                    style={styles.contactAction}
                    onPress={() => Alert.alert('Edit Contact', 'This feature is not implemented yet')}
                  >
                    <Edit2 size={18} color={Colors.text.secondary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.contactAction}
                    onPress={() => deleteContact(item.id)}
                  >
                    <Trash2 size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </Card>
            )}
            contentContainerStyle={styles.contactsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No emergency contacts added yet
            </Text>
          </View>
        )}
        
        <View style={styles.safetyActions}>
          <Button
            title="Share Location with Emergency Contacts"
            variant="outline"
            leftIcon={<Share2 size={18} color={Colors.primary.main} />}
            fullWidth
            style={styles.safetyButton}
            onPress={() => Alert.alert('Share Location', 'This would share your location with your emergency contacts')}
          />
          
          <Button
            title="Emergency SOS"
            gradient
            fullWidth
            style={styles.sosButton}
            onPress={() => Alert.alert('Emergency SOS', 'This would trigger an emergency alert to your contacts')}
          />
        </View>
      </View>
      
      {showAddContact && (
        <View style={styles.addContactForm}>
          <Text style={styles.formTitle}>Add Emergency Contact</Text>
          
          <Input
            label="Name"
            placeholder="Full name"
            value={newContact.name}
            onChangeText={(text) => setNewContact({...newContact, name: text})}
            leftIcon={<User size={20} color={Colors.text.secondary} />}
          />
          
          <Input
            label="Phone Number"
            placeholder="(555) 123-4567"
            keyboardType="phone-pad"
            value={newContact.phone}
            onChangeText={(text) => setNewContact({...newContact, phone: text})}
            leftIcon={<Phone size={20} color={Colors.text.secondary} />}
          />
          
          <Input
            label="Relationship"
            placeholder="Friend, Family, Partner, etc."
            value={newContact.relationship}
            onChangeText={(text) => setNewContact({...newContact, relationship: text})}
          />
          
          <View style={styles.formButtons}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowAddContact(false)}
              style={styles.formButton}
            />
            
            <Button
              title="Add Contact"
              onPress={handleAddContact}
              style={styles.formButton}
            />
          </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    marginBottom: 20,
    backgroundColor: Colors.secondary.light,
  },
  infoTitle: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.large,
    color: Colors.text.white,
    marginBottom: 8,
  },
  infoText: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.white,
    lineHeight: 22,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.primarySemiBold,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
    color: Colors.primary.main,
    marginLeft: 4,
  },
  contactsList: {
    flexGrow: 1,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: Typography.fontFamily.primarySemiBold,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  contactDetails: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
  },
  contactActions: {
    flexDirection: 'row',
  },
  contactAction: {
    padding: 8,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  safetyActions: {
    marginTop: 'auto',
    paddingVertical: 16,
  },
  safetyButton: {
    marginBottom: 12,
  },
  sosButton: {
    backgroundColor: Colors.error,
  },
  addContactForm: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background.paper,
    padding: 16,
    zIndex: 10,
  },
  formTitle: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.large,
    color: Colors.text.primary,
    marginBottom: 20,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
