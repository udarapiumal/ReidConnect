import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
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

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const { clubDetails, token } = useClub();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const fetchEventsByClubId = async (clubId, token, setEvents, setEventsLoading) => {
  if (!clubId || !token) {
    console.warn("Missing clubId or token");
    return;
  }

  setEventsLoading(true);
  try {
    const response = await axios.get(`${BASE_URL}/api/events/club/${clubId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setEvents(Array.isArray(response.data) ? response.data : []);
  } catch (err) {
    console.error("❌ Failed to load events:", err);
    setEvents([]);
  } finally {
    setEventsLoading(false);
  }
};



  // Load events when component mounts
  useEffect(() => {
    fetchEventsByClubId(clubDetails?.id, token, setEvents, setEventsLoading);
  }, [clubDetails, token]);


  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        selectionLimit: 5,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        aspect: [1, 1],
        base64: false,
      });

      if (!result.canceled && result.assets) {
        setSelectedImages(result.assets);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const removeImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const reorderImage = (index) => {
    if (selectedImages.length <= 1) return;
    
    const reordered = [...selectedImages];
    const [moved] = reordered.splice(index, 1);
    reordered.unshift(moved); // Move to front instead of back
    setSelectedImages(reordered);
  };

  const handleSharePost = async () => {
    setIsLoading(true);
    
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("🪪 Fetched token from storage:", token);

      const formData = new FormData();
      formData.append("clubId", clubDetails.id.toString());
      formData.append("description", description);
      if (selectedEventId) {
        formData.append("eventId", selectedEventId.toString());
      }

      console.log("🖼 Selected images count:", selectedImages.length);

      selectedImages.forEach((image, index) => {
        formData.append("media", {
          uri: image.uri,
          name: `photo_${index}.jpg`,
          type: "image/jpeg",
        });
        console.log(`📎 Attached image ${index}:`, image.uri);
      });

      const response = await fetch(`${BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.text();
      console.log("Server response:", result);
      Alert.alert("Success", "Post created successfully!");
      
      // Reset form and navigate back
      setDescription('');
      setSelectedImages([]);
      setSelectedEventId(null);
      setStep(1);
      navigation.goBack();
      
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", error.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.imageThumb} />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeImage(index)}
      >
        <Ionicons name="close-circle" size={24} color="#ff4444" />
      </TouchableOpacity>
      {index === 0 && (
        <View style={styles.primaryBadge}>
          <Text style={styles.primaryText}>Primary</Text>
        </View>
      )}
      <TouchableOpacity 
        style={styles.reorderButton}
        onPress={() => reorderImage(index)}
      >
        <Ionicons name="swap-vertical" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>{step}/2</Text>
        </View>
      </View>

      {step === 1 && (
        <View style={styles.galleryView}>
          <LinearGradient
            colors={['#1a1a1a', '#2a2a2a']}
            style={styles.pickButtonGradient}
          >
            <TouchableOpacity style={styles.pickButton} onPress={pickImages}>
              <Ionicons name="images" size={32} color="#007aff" />
              <Text style={styles.pickText}>Select up to 5 images</Text>
              <Text style={styles.pickSubtext}>Tap to browse your gallery</Text>
            </TouchableOpacity>
          </LinearGradient>

          {selectedImages.length > 0 && (
            <View style={styles.selectedImagesContainer}>
              <Text style={styles.sectionTitle}>Selected Images ({selectedImages.length}/5)</Text>
              <FlatList
                data={selectedImages}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.imagesList}
              />
            </View>
          )}

          <TouchableOpacity 
            style={[styles.nextButton, selectedImages.length === 0 && styles.disabledButton]} 
            onPress={() => setStep(2)}
            disabled={selectedImages.length === 0}
          >
            <LinearGradient
              colors={selectedImages.length > 0 ? ['#007aff', '#0056b3'] : ['#333', '#333']}
              style={styles.buttonGradient}
            >
              <Text style={styles.nextText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <ScrollView contentContainerStyle={styles.detailsView} showsVerticalScrollIndicator={false}>
          <View style={styles.previewContainer}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <FlatList
              data={selectedImages}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image source={{ uri: item.uri }} style={styles.previewImage} />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us more about your post..."
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor="#666"
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Link to an Event (optional)
              {eventsLoading && <Text style={styles.loadingText}> - Loading...</Text>}
            </Text>
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedEventId}
                onValueChange={(itemValue) => {
                  console.log('🎯 Selected event:', itemValue);
                  setSelectedEventId(itemValue);
                }}
                style={styles.picker}
                dropdownIconColor="#666"
                enabled={!eventsLoading}
              >
                <Picker.Item 
                  label={eventsLoading ? "Loading events..." : "No event selected"} 
                  value={null}
                  color="#fff"
                />
                {events.map(event => (
                  <Picker.Item 
                    key={event.id} 
                    label={event.name || `Event ${event.id}`} 
                    value={event.id}
                    color="#fff"
                  />
                ))}
              </Picker>
            </View>
            
            {events.length === 0 && !eventsLoading && (
              <Text style={styles.noEventsText}>No events available for this club</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setStep(1)}
            >
              <Ionicons name="arrow-back" size={20} color="#007aff" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.shareButton, isLoading && styles.disabledButton]}
              onPress={handleSharePost}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#333', '#333'] : ['#28a745', '#20a145']}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <Text style={styles.shareText}>Sharing...</Text>
                ) : (
                  <>
                    <Ionicons name="share" size={20} color="#fff" />
                    <Text style={styles.shareText}>Share Post</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
  galleryView: { 
    flex: 1,
    padding: 20,
  },
  pickButtonGradient: {
    borderRadius: 16,
    marginBottom: 24,
  },
  pickButton: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  pickText: { 
    color: '#fff', 
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  pickSubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  selectedImagesContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  imagesList: {
    paddingVertical: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  imageThumb: { 
    width: 120, 
    height: 120, 
    borderRadius: 12,
    backgroundColor: '#222',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#007aff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  primaryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  reorderButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 6,
    borderRadius: 6,
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
  detailsView: { 
    padding: 20,
    paddingBottom: 40,
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#222',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingText: {
    color: '#666',
    fontWeight: '400',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  // Enhanced Picker Styles
  pickerContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: 'transparent',
    height: 56,
    ...Platform.select({
      ios: {
        paddingHorizontal: 16,
      },
      android: {
        paddingHorizontal: 12,
      },
    }),
  },
  pickerIconContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    pointerEvents: 'none',
  },
  noEventsText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  shareButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});