import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../../constants/config';
import { useClub } from '../../context/ClubContext';

const { width, height } = Dimensions.get('window');

// Time slots from 8 AM to 5 PM with slot IDs
const TIME_SLOTS = [
  { id: 1, time: '08:00', label: '8:00 AM' },
  { id: 2, time: '08:30', label: '8:30 AM' },
  { id: 3, time: '09:00', label: '9:00 AM' },
  { id: 4, time: '09:30', label: '9:30 AM' },
  { id: 5, time: '10:00', label: '10:00 AM' },
  { id: 6, time: '10:30', label: '10:30 AM' },
  { id: 7, time: '11:00', label: '11:00 AM' },
  { id: 8, time: '11:30', label: '11:30 AM' },
  { id: 9, time: '12:00', label: '12:00 PM' },
  { id: 10, time: '12:30', label: '12:30 PM' },
  { id: 11, time: '13:00', label: '1:00 PM' },
  { id: 12, time: '13:30', label: '1:30 PM' },
  { id: 13, time: '14:00', label: '2:00 PM' },
  { id: 14, time: '14:30', label: '2:30 PM' },
  { id: 15, time: '15:00', label: '3:00 PM' },
  { id: 16, time: '15:30', label: '3:30 PM' },
  { id: 17, time: '16:00', label: '4:00 PM' },
  { id: 18, time: '16:30', label: '4:30 PM' },
  { id: 19, time: '17:00', label: '5:00 PM' },
  { id: 20, time: '17:30', label: '5:30 PM' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function VenueBookingRequest() {
  const { clubDetails, token } = useClub();

  // Form state
  const [reason, setReason] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Venue data
  const [allVenues, setAllVenues] = useState([]);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [timeSlotModalVisible, setTimeSlotModalVisible] = useState(false);

  // Fetch all venues on mount
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/venues`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllVenues(response.data);
    } catch (error) {
      console.error('Failed to load venues:', error);
      Alert.alert('Error', 'Failed to load venues');
    }
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day) => {
    const selected = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selected < today) {
      Alert.alert('Invalid Date', 'Please select a future date');
      return;
    }
    
    setSelectedDate(selected);
    setCalendarVisible(false);
  };

  const toggleTimeSlot = (slotId) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter the reason for booking');
      return;
    }
    
    if (!applicantName.trim()) {
      Alert.alert('Error', 'Please enter applicant name');
      return;
    }
    
    if (!registrationNumber.trim()) {
      Alert.alert('Error', 'Please enter registration number');
      return;
    }
    
    if (!contactNumber.trim()) {
      Alert.alert('Error', 'Please enter contact number');
      return;
    }
    
    if (!selectedVenue) {
      Alert.alert('Error', 'Please select a venue');
      return;
    }
    
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }
    
    if (selectedTimeSlots.length === 0) {
      Alert.alert('Error', 'Please select at least one time slot');
      return;
    }

    setLoading(true);
    
    try {
      const bookingData = {
        clubId: clubDetails.id,
        venueId: selectedVenue.id,
        requestedDate: formatDateForAPI(selectedDate),
        reason: reason.trim(),
        applicantName: applicantName.trim(),
        registrationNumber: registrationNumber.trim(),
        contactNumber: contactNumber.trim(),
        slotIds: selectedTimeSlots
      };

      console.log('Sending booking data:', bookingData);

      await axios.post(`${BASE_URL}/api/venue-bookings/create`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      Alert.alert('Success', 'Venue booking request submitted successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      
      // Reset form
      setReason('');
      setApplicantName('');
      setRegistrationNumber('');
      setContactNumber('');
      setSelectedVenue(null);
      setSelectedDate(null);
      setSelectedTimeSlots([]);
      
    } catch (error) {
      console.error('Error submitting booking request:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit booking request. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const today = new Date();
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.calendarDay} />
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isPast = date < today.setHours(0, 0, 0, 0);
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isToday && styles.todayDay,
            isSelected && styles.selectedDay,
            isPast && styles.pastDay
          ]}
          onPress={() => !isPast && handleDateSelect(day)}
          disabled={isPast}
        >
          <Text style={[
            styles.calendarDayText,
            isToday && styles.todayText,
            isSelected && styles.selectedDayText,
            isPast && styles.pastDayText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return (
      <View style={styles.calendar}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.calendarTitle}>
            {MONTHS[currentMonth]} {currentYear}
          </Text>
          
          <TouchableOpacity
            onPress={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
          >
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.calendarWeekDays}>
          {DAYS.map(day => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.calendarGrid}>
          {days}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.heading}>Venue Booking Request</Text>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Reason Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reason for Booking *</Text>
            <TextInput
              placeholder="Enter the reason for venue booking"
              placeholderTextColor="#666"
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              onChangeText={setReason}
              value={reason}
            />
          </View>

          {/* Applicant Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Applicant Name *</Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#666"
              style={styles.input}
              onChangeText={setApplicantName}
              value={applicantName}
            />
          </View>

          {/* Registration Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Registration Number *</Text>
            <TextInput
              placeholder="Enter your registration number"
              placeholderTextColor="#666"
              style={styles.input}
              onChangeText={setRegistrationNumber}
              value={registrationNumber}
            />
          </View>

          {/* Contact Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              placeholder="Enter your contact number"
              placeholderTextColor="#666"
              style={styles.input}
              keyboardType="phone-pad"
              onChangeText={setContactNumber}
              value={contactNumber}
            />
          </View>

          {/* Venue Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Venue *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedVenue?.id || null}
                onValueChange={(value) => {
                  const venue = allVenues.find(v => v.id === value);
                  setSelectedVenue(venue || null);
                }}
                style={styles.picker}
              >
                <Picker.Item label="-- Select a Venue --" value={null} />
                {allVenues.map(venue => (
                  <Picker.Item 
                    key={venue.id} 
                    label={`${venue.name} - ${venue.faculty} (Cap: ${venue.capacity})`} 
                    value={venue.id} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          {selectedVenue && (
            <View style={styles.venueInfo}>
              <Text style={styles.venueInfoText}>
                📍 {selectedVenue.name} • {selectedVenue.faculty} • Capacity: {selectedVenue.capacity}
              </Text>
            </View>
          )}

          {/* Date Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Date *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setCalendarVisible(true)}
            >
              <Ionicons name="calendar" size={20} color="#666" />
              <Text style={styles.dateButtonText}>
                {selectedDate ? formatDateForDisplay(selectedDate) : 'Select a date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Time Slots Selection */}
          {selectedDate && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Time Slots *</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setTimeSlotModalVisible(true)}
              >
                <Ionicons name="time" size={20} color="#666" />
                <Text style={styles.timeButtonText}>
                  {selectedTimeSlots.length > 0 
                    ? `${selectedTimeSlots.length} slot(s) selected`
                    : 'Select time slots'}
                </Text>
              </TouchableOpacity>
              
              {selectedTimeSlots.length > 0 && (
                <View style={styles.selectedSlotsContainer}>
                  {selectedTimeSlots.map(slotId => {
                    const timeSlot = TIME_SLOTS.find(t => t.id === slotId);
                    return (
                      <View key={slotId} style={styles.selectedSlot}>
                        <Text style={styles.selectedSlotText}>{timeSlot?.label}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!reason || !applicantName || !registrationNumber || !contactNumber || !selectedVenue || !selectedDate || selectedTimeSlots.length === 0) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!reason || !applicantName || !registrationNumber || !contactNumber || !selectedVenue || !selectedDate || selectedTimeSlots.length === 0 || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit Booking Request</Text>
                <Ionicons name="send" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

        </ScrollView>

        {/* Calendar Modal */}
        <Modal
          visible={calendarVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setCalendarVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            {renderCalendar()}
          </View>
        </Modal>

        {/* Time Slots Modal */}
        <Modal
          visible={timeSlotModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setTimeSlotModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time Slots</Text>
              <TouchableOpacity onPress={() => setTimeSlotModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.timeSlotsContainer}>
              <View style={styles.timeSlotsGrid}>
                {TIME_SLOTS.map(slot => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlot,
                      selectedTimeSlots.includes(slot.id) && styles.selectedTimeSlot
                    ]}
                    onPress={() => toggleTimeSlot(slot.id)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTimeSlots.includes(slot.id) && styles.selectedTimeSlotText
                    ]}>
                      {slot.label}
                    </Text>
                    {selectedTimeSlots.includes(slot.id) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#151718",
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  venueInfo: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#007aff',
  },
  venueInfoText: {
    color: '#ccc',
    fontSize: 14,
  },
  dateButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  timeButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  selectedSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  selectedSlot: {
    backgroundColor: '#007aff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectedSlotText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#007aff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  calendar: {
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  calendarWeekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: width / 7 - 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 8,
  },
  calendarDayText: {
    color: '#fff',
    fontSize: 16,
  },
  todayDay: {
    backgroundColor: '#333',
  },
  todayText: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  selectedDay: {
    backgroundColor: '#007aff',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pastDay: {
    opacity: 0.3,
  },
  pastDayText: {
    color: '#666',
  },
  timeSlotsContainer: {
    flex: 1,
    padding: 20,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: '45%',
  },
  selectedTimeSlot: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  timeSlotText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
});