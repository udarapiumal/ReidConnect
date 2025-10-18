import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import axiosInstance from '@/app/api/axiosInstance';
import { BASE_URL } from '@/constants/config';

// Types for the update request
interface UpdateStudentRequest {
  username: string;
  studentName: string;
  contactNumber: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  studentName?: string;
  profilePictureUrl?: string;
  contactNumber?: string;
}

// API function to update student details
const updateStudentDetails = async (data: UpdateStudentRequest) => {
  try {
    const response = await axiosInstance.put('/student/me', data);
    return response.data;
  } catch (error) {
    console.error('Error updating student details:', error);
    throw error;
  }
};

// API function to fetch current student details
const fetchStudentDetails = async (): Promise<UserData | null> => {
  try {
    const response = await axiosInstance.get('/student/me');
    console.log('Student details fetched successfully');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

// API function to upload profile picture
const uploadProfilePicture = async (imageUri: string) => {
  try {
    const formData = new FormData();
    const fileExtension = imageUri.split('.').pop() || 'jpg';
    const mimeType = `image/${fileExtension}`;
    
    formData.append('profilePicture', {
      uri: imageUri,
      type: mimeType,
      name: `profile-picture.${fileExtension}`,
    } as any);

    const response = await axiosInstance.post('/student/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Upload successful:', response.status);
    return response.data;
  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// API function to delete profile picture
const deleteProfilePicture = async () => {
  try {
    const response = await axiosInstance.delete('/student/me/profile-picture');
    return response.data;
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    throw error;
  }
};

export default function ProfileEditPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    studentName: '',
    contactNumber: '',
  });

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#999', dark: '#666' }, 'text');

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const user = await fetchStudentDetails();
        if (user) {
          setUserData(user);
          setFormData({
            username: user.username || '',
            studentName: user.studentName || '',
            contactNumber: user.contactNumber || '',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (field: keyof UpdateStudentRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (imageUri: string) => {
    try {
      setUploadingImage(true);
      await uploadProfilePicture(imageUri);
      
      // Refresh user data to get updated profile picture
      const updatedUser = await fetchStudentDetails();
      if (updatedUser) {
        setUserData(updatedUser);
      }
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      let errorMessage = 'Failed to upload image. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeProfilePicture = async () => {
    Alert.alert(
      'Remove Profile Picture',
      'Are you sure you want to remove your profile picture?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setUploadingImage(true);
              await deleteProfilePicture();
              
              // Refresh user data
              const updatedUser = await fetchStudentDetails();
              if (updatedUser) {
                setUserData(updatedUser);
              }
              
              // Alert.alert('Success', 'Profile picture removed successfully!');
            } catch (error: any) {
              console.error('Error removing profile picture:', error);
              let errorMessage = 'Failed to remove profile picture. Please try again.';
              
              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              }
              
              Alert.alert('Error', errorMessage);
            } finally {
              setUploadingImage(false);
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Basic validation
      if (!formData.username.trim()) {
        Alert.alert('Validation Error', 'Username is required');
        return;
      }
      
      if (!formData.studentName.trim()) {
        Alert.alert('Validation Error', 'Student name is required');
        return;
      }

      // Validate contact number format (basic validation)
      if (formData.contactNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.contactNumber)) {
        Alert.alert('Validation Error', 'Please enter a valid contact number');
        return;
      }

      await updateStudentDetails(formData);
      
      Alert.alert(
        'Success', 
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check your inputs.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Username already exists. Please choose a different username.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={textColor} />
        </TouchableOpacity>
        
        <ThemedText style={styles.headerTitle}>Edit Profile</ThemedText>
        
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: tintColor }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ 
                  uri: userData?.profilePictureUrl ? 
                    `${BASE_URL}/${userData.profilePictureUrl}` : 
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop'
                }}
                style={styles.avatar}
                contentFit="cover"
              />
              {uploadingImage ? (
                <View style={[styles.editAvatarButton, { backgroundColor: tintColor }]}>
                  <ActivityIndicator size="small" color="white" />
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.editAvatarButton, { backgroundColor: tintColor }]}
                  onPress={pickImage}
                  activeOpacity={0.8}
                >
                  <Feather name="camera" size={16} color="white" />
                </TouchableOpacity>
              )}
            </View>
            <ThemedText style={styles.changePhotoText}>Tap to change photo</ThemedText>
            {userData?.profilePictureUrl && (
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={removeProfilePicture}
                disabled={uploadingImage}
              >
                <ThemedText style={styles.removePhotoText}>Remove photo</ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Username Field */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Username</ThemedText>
              <View style={[styles.inputContainer, { backgroundColor: cardColor, borderColor }]}>
                <Feather name="user" size={20} color={placeholderColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: textColor }]}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  placeholder="Enter username"
                  placeholderTextColor={placeholderColor}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Student Name Field */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
              <View style={[styles.inputContainer, { backgroundColor: cardColor, borderColor }]}>
                <Feather name="type" size={20} color={placeholderColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: textColor }]}
                  value={formData.studentName}
                  onChangeText={(value) => handleInputChange('studentName', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor={placeholderColor}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Contact Number Field */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Contact Number</ThemedText>
              <View style={[styles.inputContainer, { backgroundColor: cardColor, borderColor }]}>
                <Feather name="phone" size={20} color={placeholderColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: textColor }]}
                  value={formData.contactNumber}
                  onChangeText={(value) => handleInputChange('contactNumber', value)}
                  placeholder="Enter contact number"
                  placeholderTextColor={placeholderColor}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Email Field (Read-only) */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Email (Read-only)</ThemedText>
              <View style={[styles.inputContainer, styles.readOnlyContainer, { backgroundColor: cardColor, borderColor }]}>
                <Feather name="mail" size={20} color={placeholderColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput, { color: placeholderColor }]}
                  value={userData?.email || ''}
                  placeholder="Email address"
                  placeholderTextColor={placeholderColor}
                  editable={false}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  changePhotoText: {
    fontSize: 14,
    opacity: 0.6,
  },
  removePhotoButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removePhotoText: {
    fontSize: 14,
    color: '#ff4444',
    textDecorationLine: 'underline',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  readOnlyContainer: {
    opacity: 0.6,
  },
  readOnlyInput: {
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
});
