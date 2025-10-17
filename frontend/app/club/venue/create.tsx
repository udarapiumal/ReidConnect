import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
import SignatureScreen from 'react-native-signature-canvas';

const { width, height } = Dimensions.get('window');

// Time slots from 8 AM to 5:30 PM with slot IDs
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

  // Step control
  const [step, setStep] = useState(1);

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

  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [clubSignatureImage, setClubSignatureImage] = useState(null);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Booked slots state
  const [bookedSlots, setBookedSlots] = useState([]); // APPROVED slots
  const [pendingSlots, setPendingSlots] = useState([]); // PENDING slots
  const [loadingSlots, setLoadingSlots] = useState(false);

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

  const fetchBookedSlots = async (venueId, date) => {
    if (!venueId || !date) return;

    setLoadingSlots(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/bookings/summary/venue/${venueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter bookings for the selected date
      const formattedDate = formatDateForAPI(date);
      const bookingsForDate = response.data.filter(
        booking => booking.date === formattedDate
      );

      // Separate APPROVED and PENDING bookings
      const approvedSlotIds = bookingsForDate
        .filter(booking => booking.status === 'APPROVED')
        .flatMap(booking => booking.slotIds.map(slot => slot.id));

      const pendingSlotIds = bookingsForDate
        .filter(booking => booking.status === 'PENDING')
        .flatMap(booking => booking.slotIds.map(slot => slot.id));

      setBookedSlots(approvedSlotIds);
      setPendingSlots(pendingSlotIds);
    } catch (error) {
      console.error('Failed to load booked slots:', error);
      setBookedSlots([]);
      setPendingSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const handleDateSelect = async (day) => {
    const selected = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selected < today) {
      Alert.alert('Invalid Date', 'Please select a future date');
      return;
    }
    
    setSelectedDate(selected);
    setSelectedTimeSlots([]);
    
    // Fetch booked slots for this date
    if (selectedVenue) {
      await fetchBookedSlots(selectedVenue.id, selected);
    }
  };

  const toggleTimeSlot = (slotId) => {
    // Check if slot is already approved/booked
    if (bookedSlots.includes(slotId)) {
      Alert.alert('Already Booked', 'This time slot has been approved and is already booked.');
      return;
    }

    // Check if slot has pending request
    if (pendingSlots.includes(slotId)) {
      Alert.alert(
        'Pending Request',
        'Another club has already requested this time slot. Do you wish to proceed?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Proceed',
            onPress: () => {
              setSelectedTimeSlots(prev => {
                if (prev.includes(slotId)) {
                  return prev.filter(id => id !== slotId);
                } else {
                  return [...prev, slotId];
                }
              });
            }
          }
        ]
      );
      return;
    }

    // Free slot - toggle normally
    setSelectedTimeSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const handleSubmit = async () => {
    if (!reason.trim() || !applicantName.trim() || !registrationNumber.trim() || !contactNumber.trim() || !selectedVenue || !selectedDate || selectedTimeSlots.length === 0 || !clubSignatureImage) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        venueId: selectedVenue.id,
        slotIds: selectedTimeSlots,
        clubName: applicantName.trim(),
        registrationNumber: registrationNumber.trim(),
        contactNumber: contactNumber.trim(),
        date: formatDateForAPI(selectedDate),
        reason: reason.trim(),
        clubSignatureImage: clubSignatureImage,
      };

      await axios.post(`${BASE_URL}/api/bookings/create/${clubDetails.userId}`, bookingData, {
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
      setClubSignatureImage(null);
      setBookedSlots([]);
      setPendingSlots([]);
      setStep(1);

    } catch (error) {
      console.error('Error submitting booking request:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit booking request. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = () => {
    return reason.trim() && applicantName.trim() && registrationNumber.trim() && contactNumber.trim() && selectedVenue;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
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
      const isPast = date < today;
      
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
    
    return days;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Venue Booking Request</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>{step}/2</Text>
        </View>
      </View>

      {/* STEP 1: Basic Information */}
      {step === 1 && (
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
                dropdownIconColor="#666"
              >
                <Picker.Item label="-- Select a Venue --" value={null} color="#666" />
                {allVenues.map(venue => (
                  <Picker.Item 
                    key={venue.id} 
                    label={`${venue.name} - ${venue.faculty} (Cap: ${venue.capacity})`} 
                    value={venue.id}
                    color="#666"
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

          {/* Next Button */}
          <TouchableOpacity 
            style={[styles.nextButton, !canProceedToStep2() && styles.disabledButton]} 
            onPress={() => setStep(2)}
            disabled={!canProceedToStep2()}
          >
            <LinearGradient
              colors={canProceedToStep2() ? ['#007aff', '#0056b3'] : ['#333', '#333']}
              style={styles.buttonGradient}
            >
              <Text style={styles.nextText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* STEP 2: Date, Time & Signature */}
      {step === 2 && (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Selected Venue Preview */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={20} color="#007aff" />
              <Text style={styles.detailText}>{selectedVenue?.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="person" size={20} color="#007aff" />
              <Text style={styles.detailText}>{applicantName}</Text>
            </View>
          </View>

          {/* Custom Calendar */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Date *</Text>
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  style={styles.monthNavButton}
                  onPress={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                >
                  <Ionicons name="chevron-back" size={24} color="#007aff" />
                </TouchableOpacity>
                
                <Text style={styles.calendarTitle}>
                  {MONTHS[currentMonth]} {currentYear}
                </Text>
                
                <TouchableOpacity
                  style={styles.monthNavButton}
                  onPress={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                >
                  <Ionicons name="chevron-forward" size={24} color="#007aff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.calendarWeekDays}>
                {DAYS.map(day => (
                  <Text key={day} style={styles.weekDayText}>{day}</Text>
                ))}
              </View>
              
              <View style={styles.calendarGrid}>
                {renderCalendar()}
              </View>

              {selectedDate && (
                <View style={styles.selectedDateDisplay}>
                  <Ionicons name="calendar" size={20} color="#007aff" />
                  <Text style={styles.selectedDateText}>
                    {formatDateForDisplay(selectedDate)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Time Slots - Only shown after date selection */}
          {selectedDate && (
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Select Time Slots *</Text>
                {loadingSlots && (
                  <ActivityIndicator size="small" color="#007aff" />
                )}
              </View>
              
              <View style={styles.timeSlotsGrid}>
                {TIME_SLOTS.map(slot => {
                  const isBooked = bookedSlots.includes(slot.id);
                  const isPending = pendingSlots.includes(slot.id);
                  const isSelected = selectedTimeSlots.includes(slot.id);
                  
                  return (
                    <TouchableOpacity
                      key={slot.id}
                      style={[
                        styles.timeSlot,
                        isBooked && styles.bookedTimeSlot,
                        isPending && styles.pendingTimeSlot,
                        isSelected && styles.selectedTimeSlot
                      ]}
                      onPress={() => toggleTimeSlot(slot.id)}
                      disabled={isBooked}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        isBooked && styles.bookedTimeSlotText,
                        isPending && styles.pendingTimeSlotText,
                        isSelected && styles.selectedTimeSlotText
                      ]}>
                        {slot.label}
                      </Text>
                      {isBooked && (
                        <View style={styles.statusBadge}>
                          <Ionicons name="lock-closed" size={14} color="#ff4444" />
                        </View>
                      )}
                      {isPending && !isSelected && (
                        <View style={styles.statusBadge}>
                          <Ionicons name="time" size={14} color="#ffa500" />
                        </View>
                      )}
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={18} color="#fff" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {selectedTimeSlots.length > 0 && (
                <View style={styles.slotCountContainer}>
                  <Text style={styles.slotCount}>
                    {selectedTimeSlots.length} slot(s) selected
                  </Text>
                </View>
              )}
              
              {(bookedSlots.length > 0 || pendingSlots.length > 0) && (
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendBox, styles.freeLegend]} />
                    <Text style={styles.legendText}>Free</Text>
                  </View>
                  {pendingSlots.length > 0 && (
                    <View style={styles.legendItem}>
                      <View style={[styles.legendBox, styles.pendingLegend]} />
                      <Text style={styles.legendText}>Requested</Text>
                    </View>
                  )}
                  {bookedSlots.length > 0 && (
                    <View style={styles.legendItem}>
                      <View style={[styles.legendBox, styles.occupiedLegend]} />
                      <Text style={styles.legendText}>Booked</Text>
                    </View>
                  )}
                  <View style={styles.legendItem}>
                    <View style={[styles.legendBox, styles.selectedLegend]} />
                    <Text style={styles.legendText}>Selected</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Signature */}
          {selectedDate && selectedTimeSlots.length > 0 && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Club Signature *</Text>
              <TouchableOpacity 
                style={styles.signatureButton}
                onPress={() => setSignatureModalVisible(true)}
              >
                {clubSignatureImage ? (
                  <>
                    <Ionicons name="checkmark-circle" size={24} color="#28a745" />
                    <Text style={styles.signatureButtonTextSuccess}>Signature Captured</Text>
                    <Text style={styles.signatureButtonSubtext}>Tap to redo</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="create-outline" size={24} color="#007aff" />
                    <Text style={styles.signatureButtonText}>Tap to Sign</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setStep(1)}
            >
              <Ionicons name="arrow-back" size={20} color="#007aff" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!selectedDate || selectedTimeSlots.length === 0 || !clubSignatureImage || loading) && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={!selectedDate || selectedTimeSlots.length === 0 || !clubSignatureImage || loading}
            >
              <LinearGradient
                colors={(!selectedDate || selectedTimeSlots.length === 0 || !clubSignatureImage || loading) ? ['#333', '#333'] : ['#28a745', '#20a145']}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="send" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Submit Request</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Signature Modal */}
      <Modal visible={signatureModalVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <SignatureScreen
            onOK={(sig) => {
              const base64Data = sig.replace(/^data:image\/\w+;base64,/, "");
              setClubSignatureImage(base64Data);
              setSignatureModalVisible(false);
            }}
            onEmpty={() => Alert.alert('Error', 'Please provide a signature')}
            onClear={() => {}}
            onEnd={() => {}}
            descriptionText="Sign above"
            clearText="Clear"
            confirmText="Save"
            webStyle={`.m-signature-pad {box-shadow: none; border: none;}`}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSignatureModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0a0a0a' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepIndicator: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  stepText: {
    color: '#007aff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    height: 100,
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
    backgroundColor: 'transparent',
    height: 56,
  },
  venueInfo: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: -12,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#007aff',
  },
  venueInfoText: {
    color: '#ccc',
    fontSize: 14,
  },
  nextButton: {
    marginTop: 'auto',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  nextText: { 
    color: '#fff', 
    fontSize: 16,
    fontWeight: '600',
  },
  previewSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  detailText: {
    color: '#ccc',
    fontSize: 14,
  },
  calendarContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthNavButton: {
    padding: 8,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  calendarWeekDays: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: (width - 80) / 7,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  calendarDayText: {
    color: '#fff',
    fontSize: 14,
  },
  todayDay: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  todayText: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  selectedDay: {
    backgroundColor: '#007aff',
    borderRadius: 8,
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
  selectedDateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  selectedDateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '48%',
    maxWidth: '48%',
  },
  selectedTimeSlot: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  bookedTimeSlot: {
    backgroundColor: '#2a1a1a',
    borderColor: '#ff4444',
    opacity: 0.6,
  },
  pendingTimeSlot: {
    backgroundColor: '#2a2a1a',
    borderColor: '#ffa500',
  },
  timeSlotText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#fff',
    fontWeight: '600',
  },
  bookedTimeSlotText: {
    color: '#ff4444',
    fontWeight: '500',
  },
  pendingTimeSlotText: {
    color: '#ffa500',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotCountContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  slotCount: {
    color: '#007aff',
    fontSize: 14,
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  freeLegend: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  occupiedLegend: {
    backgroundColor: '#2a1a1a',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  pendingLegend: {
    backgroundColor: '#2a2a1a',
    borderWidth: 1,
    borderColor: '#ffa500',
  },
  selectedLegend: {
    backgroundColor: '#007aff',
  },
  legendText: {
    color: '#ccc',
    fontSize: 12,
  },
  signatureButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  signatureButtonText: {
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  signatureButtonTextSuccess: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  signatureButtonSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007aff',
    gap: 8,
  },
  backText: {
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});