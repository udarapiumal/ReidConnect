import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import { BASE_URL } from "../constants/config";

const { width } = Dimensions.get('window');

export default function ClubSignUp() {
  const router = useRouter();

  const [clubName, setClubName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [coverPic, setCoverPic] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<any>(null);

  const pickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required to access images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfilePic(result.assets[0]);
    }
  };

  const pickCoverImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required to access images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // 16:9 aspect ratio
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setCoverPic(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
  if (!username || !password || !clubName || !website || !bio) {
    Alert.alert('❌ Error', 'Please fill all required fields');
    return;
  }

  setLoading(true);
  const formData = new FormData();

  formData.append("username", username);
  formData.append("email", `${username}@clubs.com`);
  formData.append("password", password);
  formData.append("clubName", clubName);
  formData.append("website", website);
  formData.append("bio", bio);

  if (profilePic) {
    formData.append("profilePicture", {
      uri: profilePic.uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });
  }

  if (coverPic) {
    formData.append("coverPicture", {
      uri: coverPic.uri,
      name: "cover.jpg",
      type: "image/jpeg",
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/register-club`, {
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    Alert.alert("✅ Submitted", "Your information is sent and waiting for approval.");
    router.push("/Login");
  } catch (error) {
    console.error("Registration error:", error.message);
    Alert.alert("❌ Error", "Failed to register. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const progressStepStyle = {
    activeStepIconBorderColor: '#FF453A',
    activeStepIconColor: '#1C1C1E',
    activeLabelColor: '#FF453A',
    completedStepIconColor: '#FF453A',
    completedCheckColor: '#FF453A',
    disabledStepIconColor: '#FFFFFF',
    labelColor: '#FFFFFF',
    progressBarColor: '#48484A',
    completedProgressBarColor: '#FF453A',
    activeStepNumColor: '#FFFFFF',
    completedStepNumColor: '#FFFFFF',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tell us about your club</Text>
        <Text style={styles.headerSubtitle}>Complete the steps below to set up your club profile</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressSteps {...progressStepStyle} borderWidth={2} activeStepIconBorderColor="#FF453A">
          
          {/* Step 1: Club Information */}
          <ProgressStep label="Club Info" nextBtnStyle={styles.nextButton} nextBtnTextStyle={styles.nextButtonText}>
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Club Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your club name"
                    placeholderTextColor="#8E8E93"
                    value={clubName}
                    onChangeText={setClubName}
                  />
                </View>

                <View style={styles.imageSection}>
                  <Text style={styles.sectionTitle}>Club Images</Text>
                  
                  <View style={styles.imageUploadGroup}>
                    <Text style={styles.imageLabel}>Profile Picture (Square)</Text>
                    <Text style={styles.imageHint}>Choose an image for your club's profile</Text>
                    <TouchableOpacity 
                      onPress={pickProfileImage} 
                      style={[styles.imageUploadButton, styles.profileImageButton, profilePic && styles.imageUploadButtonActive]}
                    >
                      {profilePic ? (
                        <View style={styles.imagePreviewContainer}>
                          <Image source={{ uri: profilePic.uri }} style={styles.profileImagePreview} />
                          <View style={styles.imageOverlay}>
                            <Text style={styles.changeImageText}>Tap to change</Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.uploadPlaceholder}>
                          <Ionicons name="person-circle-outline" size={32} color="#8E8E93" style={styles.uploadIcon} />
                          <Text style={styles.uploadText}>Upload Profile Picture</Text>
                          <Text style={styles.uploadSubText}>Square format</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.imageUploadGroup}>
                    <Text style={styles.imageLabel}>Cover Picture (16:9)</Text>
                    <Text style={styles.imageHint}>Choose a wide image for your club's cover</Text>
                    <TouchableOpacity 
                      onPress={pickCoverImage} 
                      style={[styles.imageUploadButton, styles.coverImageButton, coverPic && styles.imageUploadButtonActive]}
                    >
                      {coverPic ? (
                        <View style={styles.imagePreviewContainer}>
                          <Image source={{ uri: coverPic.uri }} style={styles.coverImagePreview} />
                          <View style={styles.imageOverlay}>
                            <Text style={styles.changeImageText}>Tap to change</Text>
                          </View>
                        </View>
                      ) : (
                        <View style={[styles.uploadPlaceholder, styles.coverUploadPlaceholder]}>
                          <Ionicons name="image-outline" size={32} color="#8E8E93" style={styles.uploadIcon} />
                          <Text style={styles.uploadText}>Upload Cover Picture</Text>
                          <Text style={styles.uploadSubText}>16:9 format</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </ProgressStep>

          {/* Step 2: Bio & Website */}
          <ProgressStep label="Details" nextBtnStyle={styles.nextButton} nextBtnTextStyle={styles.nextButtonText}>
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Club Details</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bio</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Tell us about your club..."
                    placeholderTextColor="#8E8E93"
                    multiline
                    numberOfLines={4}
                    value={bio}
                    onChangeText={setBio}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Website</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://your-club-website.com"
                    placeholderTextColor="#8E8E93"
                    value={website}
                    onChangeText={setWebsite}
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </ScrollView>
          </ProgressStep>

          {/* Step 3: Credentials */}
          <ProgressStep label="Account" nextBtnStyle={styles.nextButton} nextBtnTextStyle={styles.nextButtonText}>
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Account Credentials</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Choose a unique username"
                    placeholderTextColor="#8E8E93"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a secure password"
                    placeholderTextColor="#8E8E93"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>Create Club Account</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ProgressStep>

          {/* Step 4: Confirmation */}
          <ProgressStep label="Done">
            <View style={styles.confirmationContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successEmoji}>🎉</Text>
              </View>
              <Text style={styles.successTitle}>Account Created Successfully!</Text>
              <Text style={styles.successMessage}>
                Your club details have been submitted and are now under review. 
                You'll receive an email notification once your account is activated.
              </Text>
              
              <View style={styles.nextStepsContainer}>
                <Text style={styles.nextStepsTitle}>What happens next?</Text>
                <Text style={styles.nextStepsText}>
                  • Our team will review your club information{'\n'}
                  • You'll receive an approval email within 24-48 hours{'\n'}
                  • Once approved, you can start using all club features
                </Text>
              </View>
            </View>
          </ProgressStep>
        </ProgressSteps>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#121212",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    lineHeight: 22,
  },
  progressContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepContent: {
    paddingBottom: 100,
  },
  formSection: {
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#48484A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1C1C1E",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "400",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  imageSection: {
    marginTop: 30,
  },
  imageUploadGroup: {
    marginBottom: 24,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  imageHint: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 12,
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: "#48484A",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#1C1C1E",
    overflow: "hidden",
  },
  profileImageButton: {
    height: 180,
    width: 180,
    alignSelf: 'center',
  },
  coverImageButton: {
    height: 140,
    aspectRatio: 16/9,
  },
  imageUploadButtonActive: {
    borderColor: "#FF453A",
    borderStyle: "solid",
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    height: '100%',
  },
  coverUploadPlaceholder: {
    paddingVertical: 32,
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    marginBottom: 4,
  },
  uploadSubText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "400",
  },
  imagePreviewContainer: {
    position: "relative",
    height: '100%',
    width: '100%',
  },
  profileImagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  coverImagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  changeImageText: {
    color: "#FF453A",
    fontSize: 12,
    fontWeight: "500",
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: "#FF453A",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
  },
  nextButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#FF453A",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 32,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmationContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: "#1C1C1E",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF453A",
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  nextStepsContainer: {
    width: "100%",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 20,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF453A",
    marginBottom: 12,
  },
  nextStepsText: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
});