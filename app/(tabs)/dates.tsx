import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../../store';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Calendar, Clock, MapPin, Check, X } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { DateWithUsers } from '../../types';
import { useRouter } from 'expo-router';

export default function DatesScreen() {
  const router = useRouter();
  const dateProposals = useAppSelector(state => state.dates.dateProposals);
  const upcomingDates = useAppSelector(state => state.dates.upcomingDates);
  const profiles = useAppSelector(state => state.profile.profiles);
  const [activeTab, setActiveTab] = useState<'proposals' | 'upcoming'>('proposals');
  const [dateProposalsWithUsers, setDateProposalsWithUsers] = useState<DateWithUsers[]>([]);
  const [upcomingDatesWithUsers, setUpcomingDatesWithUsers] = useState<DateWithUsers[]>([]);
  
  useEffect(() => {
    // Combine date proposals with user profiles
    const proposals = dateProposals.map(proposal => {
      const proposer = proposal.proposerId === 'current-user' 
        ? { id: 'current-user', name: 'You', age: 0, photos: [], location: '', bio: '', preferences: { ageRange: [0, 0], distance: 0, gender: [], relationshipGoals: [] }, wishList: { mustHaves: [], niceToHaves: [] }, premium: false }
        : profiles.find(p => p.id === proposal.proposerId);
        
      const receiver = proposal.receiverId === 'current-user'
        ? { id: 'current-user', name: 'You', age: 0, photos: [], location: '', bio: '', preferences: { ageRange: [0, 0], distance: 0, gender: [], relationshipGoals: [] }, wishList: { mustHaves: [], niceToHaves: [] }, premium: false }
        : profiles.find(p => p.id === proposal.receiverId);
        
      return { 
        ...proposal, 
        proposer: proposer!, 
        receiver: receiver! 
      };
    });
    
    setDateProposalsWithUsers(proposals);
    
    // Combine upcoming dates with user profiles
    const upcoming = upcomingDates.map(date => {
      const proposer = date.proposerId === 'current-user'
        ? { id: 'current-user', name: 'You', age: 0, photos: [], location: '', bio: '', preferences: { ageRange: [0, 0], distance: 0, gender: [], relationshipGoals: [] }, wishList: { mustHaves: [], niceToHaves: [] }, premium: false }
        : profiles.find(p => p.id === date.proposerId);
        
      const receiver = date.receiverId === 'current-user'
        ? { id: 'current-user', name: 'You', age: 0, photos: [], location: '', bio: '', preferences: { ageRange: [0, 0], distance: 0, gender: [], relationshipGoals: [] }, wishList: { mustHaves: [], niceToHaves: [] }, premium: false }
        : profiles.find(p => p.id === date.receiverId);
        
      return { 
        ...date, 
        proposer: proposer!, 
        receiver: receiver! 
      };
    });
    
    setUpcomingDatesWithUsers(upcoming);
  }, [dateProposals, upcomingDates, profiles]);
  
  const renderDateProposal = ({ item }: { item: DateWithUsers }) => {
    const isFromMe = item.proposerId === 'current-user';
    const otherPerson = isFromMe ? item.receiver : item.proposer;
    const formattedDate = format(parseISO(item.dateTime), 'E, MMM d');
    const formattedTime = format(parseISO(item.dateTime), 'h:mm a');
    
    return (
      <Card style={styles.dateCard}>
        <View style={styles.dateHeader}>
          <Image 
            source={{ uri: otherPerson.photos[0] }} 
            style={styles.userPhoto} 
          />
          <View style={styles.dateInfo}>
            <Text style={styles.otherPersonName}>{otherPerson.name}</Text>
            <Text style={styles.proposalType}>
              {isFromMe ? 'Your proposal' : 'Sent you a date invitation'}
            </Text>
          </View>
        </View>
        
        <View style={styles.dateDetails}>
          <View style={styles.detailRow}>
            <Calendar size={18} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={18} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{formattedTime}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={18} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          
          <View style={styles.activityContainer}>
            <Text style={styles.activityText}>{item.activity}</Text>
          </View>
        </View>
        
        {!isFromMe && item.status === 'pending' && (
          <View style={styles.actionButtons}>
            <Button
              title="Accept"
              size="small"
              leftIcon={<Check size={16} color={Colors.text.white} />}
              style={[styles.actionButton, styles.acceptButton]}
            />
            
            <Button
              title="Decline"
              variant="outline"
              size="small"
              leftIcon={<X size={16} color={Colors.primary.main} />}
              style={styles.actionButton}
            />
            
            <Button
              title="Counter"
              variant="secondary"
              size="small"
              style={styles.actionButton}
            />
          </View>
        )}
        
        {item.status === 'countered' && (
          <View style={styles.counterProposalContainer}>
            <Text style={styles.counterProposalTitle}>Counter Proposal:</Text>
            
            {item.counterProposal && (
              <>
                <View style={styles.detailRow}>
                  <Calendar size={16} color={Colors.text.secondary} />
                  <Text style={styles.detailText}>
                    {format(parseISO(item.counterProposal.dateTime), 'E, MMM d')}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Clock size={16} color={Colors.text.secondary} />
                  <Text style={styles.detailText}>
                    {format(parseISO(item.counterProposal.dateTime), 'h:mm a')}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MapPin size={16} color={Colors.text.secondary} />
                  <Text style={styles.detailText}>{item.counterProposal.location}</Text>
                </View>
                
                {isFromMe && (
                  <View style={styles.actionButtons}>
                    <Button
                      title="Accept Counter"
                      size="small"
                      style={[styles.actionButton, styles.acceptButton]}
                    />
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </Card>
    );
  };
  
  const renderUpcomingDate = ({ item }: { item: DateWithUsers }) => {
    const otherPerson = item.proposerId === 'current-user' ? item.receiver : item.proposer;
    const formattedDate = format(parseISO(item.dateTime), 'E, MMM d');
    const formattedTime = format(parseISO(item.dateTime), 'h:mm a');
    
    return (
      <Card style={styles.dateCard}>
        <View style={styles.dateHeader}>
          <Image 
            source={{ uri: otherPerson.photos[0] }} 
            style={styles.userPhoto} 
          />
          <View style={styles.dateInfo}>
            <Text style={styles.otherPersonName}>{otherPerson.name}</Text>
            <Text style={styles.proposalType}>Date confirmed</Text>
          </View>
        </View>
        
        <View style={styles.dateDetails}>
          <View style={styles.detailRow}>
            <Calendar size={18} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={18} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{formattedTime}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={18} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          
          <View style={styles.activityContainer}>
            <Text style={styles.activityText}>{item.activity}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <Button
            title="Safety Features"
            variant="outline"
            size="small"
            onPress={() => router.push('/safety/contacts')}
            style={styles.actionButton}
          />
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dates</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'proposals' && styles.activeTab]}
          onPress={() => setActiveTab('proposals')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'proposals' && styles.activeTabText
            ]}
          >
            Proposals ({dateProposalsWithUsers.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText
            ]}
          >
            Upcoming ({upcomingDatesWithUsers.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'proposals' && (
        <>
          {dateProposalsWithUsers.length > 0 ? (
            <FlatList
              data={dateProposalsWithUsers}
              renderItem={renderDateProposal}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateTitle}>No date proposals</Text>
              <Text style={styles.emptyStateDescription}>
                When you have a match, you can suggest a date or they can invite you.
              </Text>
            </View>
          )}
        </>
      )}
      
      {activeTab === 'upcoming' && (
        <>
          {upcomingDatesWithUsers.length > 0 ? (
            <FlatList
              data={upcomingDatesWithUsers}
              renderItem={renderUpcomingDate}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateTitle}>No upcoming dates</Text>
              <Text style={styles.emptyStateDescription}>
                Once you accept a date proposal, it will appear here.
              </Text>
            </View>
          )}
        </>
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
  list: {
    padding: 16,
  },
  dateCard: {
    marginBottom: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  dateInfo: {
    marginLeft: 12,
  },
  otherPersonName: {
    fontFamily: Typography.fontFamily.primarySemiBold,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.primary,
  },
  proposalType: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
  },
  dateDetails: {
    backgroundColor: Colors.background.default,
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  activityContainer: {
    backgroundColor: Colors.secondary.light,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  activityText: {
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
    color: Colors.text.white,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  actionButton: {
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: Colors.success,
  },
  counterProposalContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  counterProposalTitle: {
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
    color: Colors.text.primary,
    marginBottom: 8,
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
