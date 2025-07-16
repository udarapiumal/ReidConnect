import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../../constants/config';
import { useClub } from '../../context/ClubContext';

const { width, height } = Dimensions.get('window');

const FACULTIES = ["UCSC", "FOS", "FOT"];
const YEARS = ["YEAR_1", "YEAR_2", "YEAR_3", "YEAR_4"];

// Time slots from 8 AM to 5 PM
const TIME_SLOTS = [
  { time: '08:00', label: '8:00 AM' },
  { time: '08:30', label: '8:30 AM' },
  { time: '09:00', label: '9:00 AM' },
  { time: '09:30', label: '9:30 AM' },
  { time: '10:00', label: '10:00 AM' },
  { time: '10:30', label: '10:30 AM' },
  { time: '11:00', label: '11:00 AM' },
  { time: '11:30', label: '11:30 AM' },
  { time: '12:00', label: '12:00 PM' },
  { time: '12:30', label: '12:30 PM' },
  { time: '13:00', label: '1:00 PM' },
  { time: '13:30', label: '1:30 PM' },
  { time: '14:00', label: '2:00 PM' },
  { time: '14:30', label: '2:30 PM' },
  { time: '15:00', label: '3:00 PM' },
  { time: '15:30', label: '3:30 PM' },
  { time: '16:00', label: '4:00 PM' },
  { time: '16:30', label: '4:30 PM' },
  { time: '17:00', label: '5:00 PM' },
  { time: '17:30', label: '5:30 PM' },
];


// Mapping slot IDs to time slots 
const SLOT_ID_TO_TIME_MAPPING = {
  1: '08:00',
  2: '08:30',
  3: '09:00',
  4: '09:30',
  5: '10:00',
  6: '10:30',
  7: '11:00',
  8: '11:30',
  9: '12:00',
  10: '12:30',
  11: '13:00',
  12: '13:30',
  13: '14:00',
  14: '14:30',
  15: '15:00',
  16: '15:30',
  17: '16:00',
  18: '16:30',
  19: '17:00',
  20: '17:30',
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CreateEvent() {
  const { clubDetails, token } = useClub();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [targetYears, setTargetYears] = useState([]);
  const [targetFaculties, setTargetFaculties] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [venue, setVenue] = useState('');
  const [loading, setLoading] = useState(false);
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [currentConflict, setCurrentConflict] = useState(null);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [existingEvents, setExistingEvents] = useState([]);
  const [calendarView, setCalendarView] = useState('month'); // 'month' or 'day'
  const [selectedSlotForConflict, setSelectedSlotForConflict] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      quality: 1,
      allowsEditing: true,
      aspect: [16, 9]
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const fetchExistingEvents = async () => {
    if (!targetYears.length || !targetFaculties.length) return;

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/events/conflicts`, {
        params: {
          faculties: targetFaculties,
          years: targetYears,
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExistingEvents(response.data);
    } catch (error) {
      console.error('Error fetching existing events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2 && targetYears.length && targetFaculties.length) {
      fetchExistingEvents();
    }
  }, [step, targetYears, targetFaculties]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Fixed date formatting function - use local date instead of UTC
const formatDateForComparison = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fixed function to get events for a specific date
const getEventsForDate = (date) => {
  const dateStr = formatDateForComparison(date);
  
  const eventsForDate = existingEvents.filter(event => {
    return event.date === dateStr;
  });
  
  return eventsForDate;
};

// Fixed function to get events for a specific time slot
const getEventsForTimeSlot = (date, timeSlot) => {
  const dateStr = formatDateForComparison(date);
  
  const eventsForSlot = existingEvents.filter(event => {
    // Check if event is on the selected date
    if (event.date !== dateStr) {
      return false;
    }
    
    // Check if event has slotIds
    if (!event.slotIds || !Array.isArray(event.slotIds)) {
 
      return false;
    }

    // Convert slot IDs to time slots
    const eventTimeSlots = event.slotIds
      .map(slotId => SLOT_ID_TO_TIME_MAPPING[slotId])
      .filter(Boolean); // Remove any undefined values
    const hasTimeSlot = eventTimeSlots.includes(timeSlot);
    
    return hasTimeSlot;
  });
  
  return eventsForSlot;
};


  const handleTimeSlotPress = (timeSlot) => {
    if (!selectedDate) return;

    const conflictingEvents = getEventsForTimeSlot(selectedDate, timeSlot);
    
    if (conflictingEvents.length > 0) {
      setCurrentConflict({
        timeSlot,
        events: conflictingEvents
      });
      setSelectedSlotForConflict(timeSlot);
      setConflictModalVisible(true);
    } else {
      toggleTimeSlot(timeSlot);
    }
  };

  const toggleTimeSlot = (timeSlot) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(timeSlot)) {
        return prev.filter(slot => slot !== timeSlot);
      } else {
        return [...prev, timeSlot];
      }
    });
  };

  const handleConflictOverride = () => {
    if (selectedSlotForConflict) {
      toggleTimeSlot(selectedSlotForConflict);
    }
    setConflictModalVisible(false);
    setSelectedSlotForConflict(null);
  };

  const handleSubmit = async () => {
    if (!name || !description || !selectedDate || !selectedTimeSlots.length || !venue) {
      Alert.alert('❌ Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('targetYears', JSON.stringify(targetYears));
    formData.append('targetFaculties', JSON.stringify(targetFaculties));
    formData.append('date', formatDateForComparison(selectedDate));
    formData.append('timeSlots', JSON.stringify(selectedTimeSlots));
    formData.append('venue', venue);
    
    if (image) {
      formData.append('image', { 
        uri: image.uri, 
        name: 'event.jpg', 
        type: 'image/jpeg' 
      });
    }

    try {
      await axios.post(`${BASE_URL}/api/events`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      Alert.alert('✅ Success', 'Event created successfully!');
      // Reset form
      setStep(1);
      setName('');
      setDescription('');
      setImage(null);
      setTargetYears([]);
      setTargetFaculties([]);
      setSelectedDate(null);
      setSelectedTimeSlots([]);
      setVenue('');
      setCalendarView('month');
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (item, list, setter) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {step} of 3</Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Event Details</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Event Name *</Text>
        <TextInput
          placeholder="Enter event name"
          placeholderTextColor="#666"
          style={styles.input}
          onChangeText={setName}
          value={name}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          placeholder="Enter event description"
          placeholderTextColor="#666"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          onChangeText={setDescription}
          value={description}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Event Image</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color="#666" />
              <Text style={styles.imagePlaceholderText}>Tap to select image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Venue *</Text>
        <TextInput
          placeholder="Enter venue location"
          placeholderTextColor="#666"
          style={styles.input}
          onChangeText={setVenue}
          value={venue}
        />
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.label}>Select Target Faculties *</Text>
        <View style={styles.optionGrid}>
          {FACULTIES.map(faculty => (
            <TouchableOpacity
              key={faculty}
              style={[
                styles.optionItem,
                targetFaculties.includes(faculty) && styles.selectedOption
              ]}
              onPress={() => toggleArrayItem(faculty, targetFaculties, setTargetFaculties)}
            >
              <Text style={[
                styles.optionText,
                targetFaculties.includes(faculty) && styles.selectedOptionText
              ]}>
                {faculty}
              </Text>
              {targetFaculties.includes(faculty) && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.label}>Select Target Years *</Text>
        <View style={styles.optionGrid}>
          {YEARS.map(year => (
            <TouchableOpacity
              key={year}
              style={[
                styles.optionItem,
                targetYears.includes(year) && styles.selectedOption
              ]}
              onPress={() => toggleArrayItem(year, targetYears, setTargetYears)}
            >
              <Text style={[
                styles.optionText,
                targetYears.includes(year) && styles.selectedOptionText
              ]}>
                {year.replace('_', ' ')}
              </Text>
              {targetYears.includes(year) && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.nextButton, (!name || !description || !venue || !targetFaculties.length || !targetYears.length) && styles.disabledButton]}
        onPress={() => setStep(2)}
        disabled={!name || !description || !venue || !targetFaculties.length || !targetYears.length}
      >
        <Text style={styles.nextButtonText}>Next</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderCalendarHeader = () => (
    <View style={styles.calendarHeader}>
      <TouchableOpacity
        style={styles.calendarNavButton}
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
        style={styles.calendarNavButton}
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
  );

  // Updated calendar day rendering with better debugging
  const renderCalendarGrid = () => {
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const today = new Date();
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const isPast = date < today;
    
    // Get events for this day with debugging
    const eventsForDay = getEventsForDate(date);
    
    days.push(
      <TouchableOpacity
        key={day}
        style={[
          styles.calendarDay,
          isToday && styles.todayDay,
          isSelected && styles.selectedDay,
          isPast && styles.pastDay,
          eventsForDay.length > 0 && styles.dayWithEvents
        ]}
        onPress={() => {
          if (!isPast) {
            setSelectedDate(date);
            setCalendarView('day');
          }
        }}
        disabled={isPast}
      >
        <Text style={[
          styles.dayText,
          isToday && styles.todayText,
          isSelected && styles.selectedDayText,
          isPast && styles.pastDayText
        ]}>
          {day}
        </Text>
        {eventsForDay.length > 0 && (
          <View style={styles.eventIndicator}>
            <Text style={styles.eventCount}>{eventsForDay.length}</Text>
          </View>
        )}
        {/* Show event names in small rectangles */}
        {eventsForDay.length > 0 && (
          <View style={styles.dayEventsContainer}>
            {eventsForDay.slice(0, 2).map((event, index) => (
              <View key={index} style={styles.dayEventRect}>
                <Text style={styles.dayEventText} numberOfLines={1}>
                  {event.name}
                </Text>
              </View>
            ))}
            {eventsForDay.length > 2 && (
              <Text style={styles.moreEventsText}>+{eventsForDay.length - 2}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={styles.calendarGrid}>
      {DAYS.map(day => (
        <View key={day} style={styles.dayHeader}>
          <Text style={styles.dayHeaderText}>{day}</Text>
        </View>
      ))}
      {days}
    </View>
  );
};

// Updated day view rendering with better debugging
const renderDayView = () => {
  if (!selectedDate) return null;
  
  const eventsForDay = getEventsForDate(selectedDate);

  
  return (
    <View style={styles.dayViewContainer}>
      <View style={styles.dayViewHeader}>
        <TouchableOpacity
          style={styles.backToDayButton}
          onPress={() => setCalendarView('month')}
        >
          <Ionicons name="chevron-back" size={24} color="#007aff" />
          <Text style={styles.backToDayText}>Back to Calendar</Text>
        </TouchableOpacity>
        <Text style={styles.dayViewTitle}>
          {selectedDate.toDateString()}
        </Text>
      </View>
      
      <ScrollView style={styles.timeSlotsList}>
        {TIME_SLOTS.map(({ time, label }) => {
          const eventsForSlot = getEventsForTimeSlot(selectedDate, time);
          const isSelected = selectedTimeSlots.includes(time);
          const hasConflict = eventsForSlot.length > 0;
          
          return (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlotRow,
                isSelected && styles.selectedTimeSlotRow,
                hasConflict && styles.conflictTimeSlotRow
              ]}
              onPress={() => handleTimeSlotPress(time)}
            >
              <View style={styles.timeSlotTime}>
                <Text style={[
                  styles.timeSlotTimeText,
                  isSelected && styles.selectedTimeSlotText
                ]}>
                  {label}
                </Text>
              </View>
              
              <View style={styles.timeSlotContent}>
                {eventsForSlot.length > 0 ? (
                  eventsForSlot.map((event, index) => (
                    <View key={index} style={styles.existingEvent}>
                      <Text style={styles.existingEventTitle}>{event.name}</Text>
                      <Text style={styles.existingEventDetails}>
                        {event.targetFaculties.join(', ')} • {event.targetYears.join(', ')}
                      </Text>
                      <Text style={styles.existingEventVenue}>
                        {event.venue || event.venueName || 'No venue specified'}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptySlotText}>Free</Text>
                )}
                
                {isSelected && (
                  <View style={styles.newEventIndicator}>
                    <Text style={styles.newEventText}>New Slot Selected</Text>
                  </View>
                )}
                
                {hasConflict && (
                  <Ionicons name="warning" size={20} color="#ff6b6b" style={styles.warningIcon} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Date & Time</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007aff" />
          <Text style={styles.loadingText}>Loading existing events...</Text>
        </View>
      ) : (
        <>
          {calendarView === 'month' ? (
            <View style={styles.calendarContainer}>
              {renderCalendarHeader()}
              {renderCalendarGrid()}
            </View>
          ) : (
            renderDayView()
          )}
        </>
      )}
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep(1)}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            (!selectedDate || !selectedTimeSlots.length) && styles.disabledButton
          ]}
          onPress={() => setStep(3)}
          disabled={!selectedDate || !selectedTimeSlots.length}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review & Create</Text>
      
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewTitle}>Event Summary</Text>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Event Name:</Text>
          <Text style={styles.reviewValue}>{name}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Description:</Text>
          <Text style={styles.reviewValue}>{description}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Venue:</Text>
          <Text style={styles.reviewValue}>{venue}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Date:</Text>
          <Text style={styles.reviewValue}>{selectedDate?.toDateString()}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Time Slots:</Text>
          <Text style={styles.reviewValue}>
            {selectedTimeSlots.map(slot => 
              TIME_SLOTS.find(t => t.time === slot)?.label
            ).join(', ')}
          </Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Target Faculties:</Text>
          <Text style={styles.reviewValue}>{targetFaculties.join(', ')}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Target Years:</Text>
          <Text style={styles.reviewValue}>{targetYears.map(y => y.replace('_', ' ')).join(', ')}</Text>
        </View>
        
        {image && (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Event Image:</Text>
            <Image source={{ uri: image.uri }} style={styles.reviewImage} />
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep(2)}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.createButtonText}>Create Event</Text>
              <Ionicons name="checkmark" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConflictModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={conflictModalVisible}
      onRequestClose={() => setConflictModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons name="warning" size={30} color="#ff6b6b" />
            <Text style={styles.modalTitle}>Schedule Conflict</Text>
          </View>
          
          {currentConflict && (
            <View style={styles.conflictInfo}>
              <Text style={styles.conflictText}>
                This time slot ({TIME_SLOTS.find(t => t.time === currentConflict.timeSlot)?.label}) conflicts with:
              </Text>
              
              {currentConflict.events.map((event, index) => (
                <View key={index} style={styles.conflictEvent}>
                  <Text style={styles.conflictEventName}>{event.name}</Text>
                  <Text style={styles.conflictDetails}>
                    Faculties: {event.targetFaculties.join(", ")}
                  </Text>
                  <Text style={styles.conflictDetails}>
                    Years: {event.targetYears.join(", ")}
                  </Text>
                  <Text style={styles.conflictDetails}>
                    Venue: {event.venue || event.venueName}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setConflictModalVisible(false);
                setSelectedSlotForConflict(null);
              }}
            >
              <Text style={styles.modalCancelText}>Choose Different Time</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={handleConflictOverride}
            >
              <Text style={styles.modalConfirmText}>Schedule Anyway</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Create Event</Text>
        {renderProgressBar()}
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setStep(1);
            setName('');
            setDescription('');
            setImage(null);
            setTargetYears([]);
            setTargetFaculties([]);
            setSelectedDate(null);
            setSelectedTimeSlots([]);
            setVenue('');
            setCalendarView('month');
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {renderConflictModal()}
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
  scrollContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007aff',
    borderRadius: 2,
  },
  progressText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  stepContainer: {
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
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
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#666',
    marginTop: 10,
  },
  selectionContainer: {
    marginBottom: 25,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'space-between',
  },
  selectedOption: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 0.45,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#007aff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 0.45,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  createButton: {
    backgroundColor: '#007aff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 0.45,
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Enhanced Calendar Styles
  calendarContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    minHeight: 400,
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarNavButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  dayHeader: {
  width: '14.28%', // 100% / 7 days = 14.28%
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 2,
  
},
  dayHeaderText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  calendarDay: {
  width: '14.28%', // 100% / 7 days = 14.28%
  height: 80, // Increased height for better visibility
  justifyContent: 'flex-start',
  alignItems: 'center',
  paddingVertical: 4,
  paddingHorizontal: 2,
  borderRadius: 8,
  backgroundColor: '#0a0a0a',
  position: 'relative',
  borderWidth: 1,
  borderColor: '#333',
  marginBottom: 2
},

emptyDay: {
  width: '14.28%', // 100% / 7 days = 14.28%
  height: 80,
  marginBottom: 2,
},
  todayDay: {
    backgroundColor: '#007aff',
    opacity: 0.3,
    borderColor: '#007aff',
  },
  selectedDay: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  pastDay: {
    backgroundColor: '#333',
    opacity: 0.3,
  },
  dayWithEvents: {
    backgroundColor: '#2a2a2a',
    borderColor: '#007aff',
  },
  dayText: {
  color: '#fff',
  fontSize: 14, // Slightly larger for better readability
  fontWeight: '600',
  marginBottom: 2,
},
  todayText: {
    color: '#fff',
    fontWeight: '700',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '700',
  },
  pastDayText: {
    color: '#666',
  },
  eventIndicator: {
  position: 'absolute',
  top: 2,
  right: 2,
  backgroundColor: '#007aff',
  borderRadius: 10,
  width: 20, // Slightly larger
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#fff',
},

eventCount: {
  color: '#fff',
  fontSize: 11, // Slightly larger
  fontWeight: '700',
},
  
  // Enhanced Day Events Container for full screen
dayEventsContainer: {
  position: 'absolute',
  bottom: 2,
  left: 2,
  right: 2,
  maxHeight: 40, // Increased for full screen
  overflow: 'hidden',
},

dayEventRect: {
  backgroundColor: '#007aff',
  borderRadius: 3,
  paddingHorizontal: 3,
  paddingVertical: 1,
  marginBottom: 1,
  minHeight: 14, // Slightly larger
  justifyContent: 'center',
  borderWidth: 0.5,
  borderColor: '#4a90e2',
},

dayEventText: {
  color: '#fff',
  fontSize: 9, // Slightly larger for better readability
  fontWeight: '600',
  textAlign: 'center',
},
  moreEventsText: {
    color: '#007aff',
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: '#333',
    borderRadius: 2,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  
  // Enhanced Day View Styles
  dayViewContainer: {
    flex: 1,
    marginBottom: 20,
  },
  dayViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  backToDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backToDayText: {
    color: '#007aff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  dayViewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  timeSlotsList: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#333',
  },
  timeSlotRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    minHeight: 60,
    alignItems: 'flex-start',
  },
  selectedTimeSlotRow: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#007aff',
  },
  conflictTimeSlotRow: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b6b',
  },
  timeSlotTime: {
    width: 80,
    paddingHorizontal: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333',
    backgroundColor: '#0a0a0a',
  },
  timeSlotTimeText: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedTimeSlotText: {
    color: '#007aff',
    fontWeight: '700',
  },
  timeSlotContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  existingEvent: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#007aff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  existingEventTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  existingEventDetails: {
    color: '#bbb',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  existingEventVenue: {
    color: '#4a90e2',
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  emptySlotText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  newEventIndicator: {
    backgroundColor: '#007aff',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#4a90e2',
  },
  newEventText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  warningIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    marginTop: 12,
  },
  
  // Review Styles
  reviewContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  reviewTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewLabel: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  reviewValue: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  reviewImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
  
  // Enhanced Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  conflictInfo: {
    marginBottom: 24,
  },
  conflictText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  conflictEvent: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  conflictEventName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  conflictDetails: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCancelButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  modalCancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalConfirmButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff8a8a',
  },
  modalConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});