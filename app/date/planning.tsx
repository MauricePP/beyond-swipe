import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../../store';
import { addDateProposal } from '../../store/slices/datesSlice';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { ArrowLeft, Calendar, Clock, MapPin, Info } from 'lucide-react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { format, parseISO, addMinutes } from 'date-fns';

export default function DatePlanningScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const matchId = params.matchId as string;
  
  const matches = useAppSelector(state => state.matches.matches);
  const profiles = useAppSelector(state => state.profile.profiles);
  
  const match = matches.find(m => m.id === matchId);
  const matchedUser = match 
    ? profiles.find(p => p.id === match.matchedUserId) 
    : null;
  
  // State for date planning
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  
  // Define available times
  const availableTimes = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
  ];
  
  // Define suggested locations
  const suggestedLocations = [
    'Central Coffee House', 'Harbor Bistro', 'City Park', 
    'Downtown Cinema', 'Art Museum', 'Riverside Walk', 
    'The Local Pub', 'Harmony Gardens'
  ];
  
  // Define suggested activities
  const suggestedActivities = [
    'Coffee', 'Dinner', 'Drinks', 'Walk in the park', 
    'Movie', 'Museum visit', 'Live music', 'Art gallery'
  ];
  
  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };
  
  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
  };
  
  const handleNextStep = () => {
    if (step === 1 && !selectedDate) {
      Alert.alert('Select a Date', 'Please select a date for your meetup');
      return;
    }
    
    if (step === 2 && !selectedTime) {
      Alert.alert('Select a Time', 'Please select a time for your meetup');
      return;
    }
    
    if (step === 3 && !selectedLocation) {
      Alert.alert('Select a Location', 'Please select a location for your meetup');
      return;
    }
    
    if (step === 4 && !selectedActivity) {
      Alert.alert('Select an Activity', 'Please select an activity for your meetup');
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Create the date proposal
      const dateTime = `${selectedDate}T${convertTo24Hour(selectedTime)}:00`;
      
      const dateProposal = {
        id: `date-${Date.now()}`,
        matchId,
        proposerId: 'current-user',
        receiverId: match?.matchedUserId || '',
        location: selectedLocation,
        dateTime,
        activity: selectedActivity,
        status: 'pending',
        createdAt: Date.now(),
      };
      
      dispatch(addDateProposal(dateProposal));
      
      Alert.alert(
        'Date Proposed!',
        `Your date proposal has been sent to ${matchedUser?.name}. You'll be notified when they respond.`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    }
  };
  
  // Helper to convert 12-hour to 24-hour format
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    
    return `${hours}:${minutes}`;
  };
  
  // Get current date as YYYY-MM-DD for min date
  const today = new Date();
  const minDate = format(today, 'yyyy-MM-dd');
  
  // Get date 2 months from now for max date
  const maxDate = format(addMinutes(today, 60 * 24 * 60), 'yyyy-MM-dd');
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Plan a Date',
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
      
      <ScrollView style={styles.content}>
        {matchedUser && (
          <View style={styles.matchInfo}>
            <Text style={styles.planningTitle}>Planning a date with</Text>
            <Text style={styles.matchedUserName}>{matchedUser.name}</Text>
          </View>
        )}
        
        <View style={styles.stepsIndicator}>
          {[1, 2, 3, 4].map(i => (
            <View 
              key={i}
              style={[
                styles.stepDot,
                i === step ? styles.activeStepDot : 
                i < step ? styles.completedStepDot : {}
              ]}
            />
          ))}
        </View>
        
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Calendar size={24} color={Colors.primary.main} />
              <Text style={styles.stepTitle}>Select a Date</Text>
            </View>
            
            <Card style={styles.calendarCard}>
              <RNCalendar
                minDate={minDate}
                maxDate={maxDate}
                onDayPress={handleDateSelect}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: Colors.primary.main }
                }}
                theme={{
                  todayTextColor: Colors.primary.main,
                  arrowColor: Colors.primary.main,
                  textDayFontFamily: Typography.fontFamily.primary,
                  textMonthFontFamily: Typography.fontFamily.primaryMedium,
                  textDayHeaderFontFamily: Typography.fontFamily.primaryMedium,
                }}
              />
            </Card>
            
            {selectedDate && (
              <View style={styles.selectionInfo}>
                <Text style={styles.selectionLabel}>Selected date:</Text>
                <Text style={styles.selectionValue}>
                  {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
                </Text>
              </View>
            )}
          </View>
        )}
        
        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Clock size={24} color={Colors.primary.main} />
              <Text style={styles.stepTitle}>Select a Time</Text>
            </View>
            
            <Card style={styles.optionsCard}>
              <View style={styles.optionsGrid}>
                {availableTimes.map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      selectedTime === time && styles.selectedOption
                    ]}
                    onPress={() => handleTimeSelect(time)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        selectedTime === time && styles.selectedOptionText
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
            
            {selectedTime && (
              <View style={styles.selectionInfo}>
                <Text style={styles.selectionLabel}>Selected time:</Text>
                <Text style={styles.selectionValue}>{selectedTime}</Text>
              </View>
            )}
          </View>
        )}
        
        {step === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <MapPin size={24} color={Colors.primary.main} />
              <Text style={styles.stepTitle}>Select a Location</Text>
            </View>
            
            <Card style={styles.optionsCard}>
              <View style={styles.optionsList}>
                {suggestedLocations.map(location => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.locationOption,
                      selectedLocation === location && styles.selectedOption
                    ]}
                    onPress={() => handleLocationSelect(location)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        selectedLocation === location && styles.selectedOptionText
                      ]}
                    >
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
            
            {selectedLocation && (
              <View style={styles.selectionInfo}>
                <Text style={styles.selectionLabel}>Selected location:</Text>
                <Text style={styles.selectionValue}>{selectedLocation}</Text>
              </View>
            )}
          </View>
        )}
        
        {step === 4 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Info size={24} color={Colors.primary.main} />
              <Text style={styles.stepTitle}>Select an Activity</Text>
            </View>
            
            <Card style={styles.optionsCard}>
              <View style={styles.optionsGrid}>
                {suggestedActivities.map(activity => (
                  <TouchableOpacity
                    key={activity}
                    style={[
                      styles.activityOption,
                      selectedActivity === activity && styles.selectedOption
                    ]}
                    onPress={() => handleActivitySelect(activity)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        selectedActivity === activity && styles.selectedOptionText
                      ]}
                    >
                      {activity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
            
            {selectedActivity && (
              <View style={styles.selectionInfo}>
                <Text style={styles.selectionLabel}>Selected activity:</Text>
                <Text style={styles.selectionValue}>{selectedActivity}</Text>
              </View>
            )}
            
            {selectedDate && selectedTime && selectedLocation && selectedActivity && (
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Date Summary</Text>
                
                <View style={styles.summaryItem}>
                  <Calendar size={16} color={Colors.text.secondary} />
                  <Text style={styles.summaryText}>
                    {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Clock size={16} color={Colors.text.secondary} />
                  <Text style={styles.summaryText}>{selectedTime}</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <MapPin size={16} color={Colors.text.secondary} />
                  <Text style={styles.summaryText}>{selectedLocation}</Text>
                </View>
                
                <Text style={styles.activityTag}>{selectedActivity}</Text>
              </Card>
            )}
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        {step > 1 && (
          <Button
            title="Back"
            variant="outline"
            onPress={() => setStep(step - 1)}
            style={styles.backButton}
          />
        )}
        
        <Button
          title={step === 4 ? "Send Invitation" : "Next"}
          onPress={handleNextStep}
          style={step === 1 ? styles.fullWidthButton : styles.nextButton}
          gradient={step === 4}
        />
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
    padding: 16,
  },
  matchInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planningTitle: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.secondary,
  },
  matchedUserName: {
    fontFamily: Typography.fontFamily.primaryBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginTop: 4,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.divider,
    marginHorizontal: 4,
  },
  activeStepDot: {
    backgroundColor: Colors.primary.main,
    width: 12,
    height: 12,
  },
  completedStepDot: {
    backgroundColor: Colors.primary.light,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontFamily: Typography.fontFamily.primarySemiBold,
    fontSize: Typography.fontSize.large,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  calendarCard: {
    padding: 0,
    overflow: 'hidden',
  },
  optionsCard: {
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionsList: {
    flexDirection: 'column',
  },
  timeOption: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 12,
    alignItems: 'center',
  },
  locationOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 8,
  },
  activityOption: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.main + '10',
  },
  optionText: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  selectedOptionText: {
    fontFamily: Typography.fontFamily.primaryMedium,
    color: Colors.primary.main,
  },
  selectionInfo: {
    marginTop: 8,
    marginBottom: 16,
  },
  selectionLabel: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  selectionValue: {
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.primary,
  },
  summaryCard: {
    marginTop: 16,
  },
  summaryTitle: {
    fontFamily: Typography.fontFamily.primarySemiBold,
    fontSize: Typography.fontSize.medium,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  activityTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary.main,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
    color: Colors.text.white,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    backgroundColor: Colors.background.paper,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  nextButton: {
    flex: 2,
  },
  fullWidthButton: {
    flex: 1,
  },
});
