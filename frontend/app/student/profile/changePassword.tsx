import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/app/context/AuthContext';
import axiosInstance from '@/app/api/axiosInstance';

// Types for the password change request
interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

// API function to change password
const changePassword = async (data: PasswordChangeRequest): Promise<PasswordChangeResponse> => {
  try {
    const response = await axiosInstance.put('/student/change-password', data);
    return response.data;
  } catch (error: any) {
    // console.error('Error changing password:', error);
    
    // Return the error response if available
    if (error.response?.data) {
    //   return error.response.data;
    }
    
    // Fallback error response
    return {
      success: false,
      message: 'Failed to change password. Please try again.'
    };
  }
};

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<PasswordChangeRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<Partial<PasswordChangeRequest>>({});

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#999', dark: '#666' }, 'text');
  const errorColor = '#ff4444';

  // Auth context
  const { isAuthenticated } = useAuth();

  const handleInputChange = (field: keyof PasswordChangeRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordChangeRequest> = {};

    // Validate current password
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters long';
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Password confirmation is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'New password and confirm password do not match';
    }

    // Check if new password is different from current password
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!isAuthenticated) {
      Alert.alert('Error', 'You must be logged in to change your password');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const result = await changePassword(formData);
      
      if (result.success) {
        Alert.alert(
          'Success', 
          result.message || 'Password changed successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form and go back
                setFormData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
                router.back();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to change password');
      }
    } catch (error: any) {
    //   console.error('Error changing password:', error);
    //   Alert.alert(
    //     'Error', 
    //     'An unexpected error occurred. Please try again.'
    //   );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Check if form has been modified
    const hasChanges = formData.currentPassword || formData.newPassword || formData.confirmPassword;
    
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to go back? Your changes will be lost.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

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
        
        <ThemedText style={styles.headerTitle}>Change Password</ThemedText>
        
        <View style={styles.headerSpacer} />
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
          {/* Info Section */}
          <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor }]}>
            <View style={styles.infoHeader}>
              <Feather name="info" size={20} color={tintColor} />
              <ThemedText style={[styles.infoTitle, { color: tintColor }]}>
                Password Requirements
              </ThemedText>
            </View>
            <ThemedText style={styles.infoText}>
              • Must be at least 8 characters long{'\n'}
              • Must be different from your current password{'\n'}
              • Make sure to remember your new password
            </ThemedText>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Current Password Field */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Current Password</ThemedText>
              <View style={[
                styles.inputContainer, 
                { backgroundColor: cardColor, borderColor: errors.currentPassword ? errorColor : borderColor }
              ]}>
                <Feather name="lock" size={20} color={placeholderColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: textColor }]}
                  value={formData.currentPassword}
                  onChangeText={(value) => handleInputChange('currentPassword', value)}
                  placeholder="Enter your current password"
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => togglePasswordVisibility('current')}
                  activeOpacity={0.7}
                >
                  <Feather 
                    name={showCurrentPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color={placeholderColor} 
                  />
                </TouchableOpacity>
              </View>
              {errors.currentPassword && (
                <ThemedText style={[styles.errorText, { color: errorColor }]}>
                  {errors.currentPassword}
                </ThemedText>
              )}
            </View>

            {/* New Password Field */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>New Password</ThemedText>
              <View style={[
                styles.inputContainer, 
                { backgroundColor: cardColor, borderColor: errors.newPassword ? errorColor : borderColor }
              ]}>
                <Feather name="lock" size={20} color={placeholderColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: textColor }]}
                  value={formData.newPassword}
                  onChangeText={(value) => handleInputChange('newPassword', value)}
                  placeholder="Enter your new password"
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => togglePasswordVisibility('new')}
                  activeOpacity={0.7}
                >
                  <Feather 
                    name={showNewPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color={placeholderColor} 
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <ThemedText style={[styles.errorText, { color: errorColor }]}>
                  {errors.newPassword}
                </ThemedText>
              )}
            </View>

            {/* Confirm Password Field */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Confirm New Password</ThemedText>
              <View style={[
                styles.inputContainer, 
                { backgroundColor: cardColor, borderColor: errors.confirmPassword ? errorColor : borderColor }
              ]}>
                <Feather name="lock" size={20} color={placeholderColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: textColor }]}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your new password"
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => togglePasswordVisibility('confirm')}
                  activeOpacity={0.7}
                >
                  <Feather 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color={placeholderColor} 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <ThemedText style={[styles.errorText, { color: errorColor }]}>
                  {errors.confirmPassword}
                </ThemedText>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                { 
                  backgroundColor: tintColor,
                  opacity: loading ? 0.7 : 1
                }
              ]}
              onPress={handleChangePassword}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Feather name="check" size={20} color="white" style={styles.submitIcon} />
                  <ThemedText style={styles.submitButtonText}>Change Password</ThemedText>
                </>
              )}
            </TouchableOpacity>
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
  headerSpacer: {
    width: 32, // Same width as back button to center title
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
  infoCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
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
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
