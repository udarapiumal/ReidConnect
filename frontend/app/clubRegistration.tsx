import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coverPic, setCoverPic] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Animations for the approval screen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideUpAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const ring2Rotate = useRef(new Animated.Value(0)).current;
  const dotAnim1 = useRef(new Animated.Value(0.3)).current;
  const dotAnim2 = useRef(new Animated.Value(0.3)).current;
  const dotAnim3 = useRef(new Animated.Value(0.3)).current;
  const cardSlide1 = useRef(new Animated.Value(60)).current;
  const cardSlide2 = useRef(new Animated.Value(60)).current;
  const cardSlide3 = useRef(new Animated.Value(60)).current;
  const cardFade1 = useRef(new Animated.Value(0)).current;
  const cardFade2 = useRef(new Animated.Value(0)).current;
  const cardFade3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (submitted) {
      // Main icon entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Pulsing glow
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotating rings
      Animated.loop(
        Animated.timing(ringRotate, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.timing(ring2Rotate, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Dot loading animation
      const animateDot = (dot: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      animateDot(dotAnim1, 0);
      animateDot(dotAnim2, 200);
      animateDot(dotAnim3, 400);

      // Staggered card entries
      const animateCard = (slideAnim: Animated.Value, fadeAnimVal: Animated.Value, delay: number) => {
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 500,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimVal, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      };
      animateCard(cardSlide1, cardFade1, 400);
      animateCard(cardSlide2, cardFade2, 600);
      animateCard(cardSlide3, cardFade3, 800);
    }
  }, [submitted]);

  const ringSpin = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ring2Spin = ring2Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const pickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required to access images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
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
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setCoverPic(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!username || !password || !clubName || !website || !bio || !email) {
      alert('Please fill all required fields including email.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append("username", username);
    formData.append("email", email);
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
      setErrorMessage("");
      const response = await fetch(`${BASE_URL}/auth/register-club`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let friendlyMessage = "Failed to register. Please try again.";
        try {
          const errorJson = await response.json();
          if (errorJson.message) {
            friendlyMessage = errorJson.message;
          }
        } catch {
          // response wasn't JSON – use default message
        }
        setErrorMessage(friendlyMessage);
        return;
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error("Registration error:", error.message);
      setErrorMessage("Network error. Please check your connection and try again.");
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

  // ─── Animated Approval Pending Screen ─────────────────────────
  if (submitted) {
    return (
      <View style={styles.approvalContainer}>
        {/* Animated background rings */}
        <View style={styles.iconArea}>
          <Animated.View
            style={[
              styles.outerRing,
              { transform: [{ rotate: ringSpin }, { scale: pulseAnim }] },
            ]}
          />
          <Animated.View
            style={[
              styles.innerRing,
              { transform: [{ rotate: ring2Spin }] },
            ]}
          />

          {/* Main icon */}
          <Animated.View
            style={[
              styles.approvalIconContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Ionicons name="hourglass-outline" size={48} color="#FF453A" />
          </Animated.View>
        </View>

        {/* Title + subtitle */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
            alignItems: 'center',
          }}
        >
          <Text style={styles.approvalTitle}>Awaiting Approval</Text>
          <Text style={styles.approvalSubtitle}>
            Your club registration has been submitted successfully
          </Text>

          {/* Animated dots */}
          <View style={styles.dotsRow}>
            <Animated.View style={[styles.dot, { opacity: dotAnim1 }]} />
            <Animated.View style={[styles.dot, { opacity: dotAnim2 }]} />
            <Animated.View style={[styles.dot, { opacity: dotAnim3 }]} />
          </View>
        </Animated.View>

        {/* Info cards */}
        <View style={styles.cardsContainer}>
          <Animated.View
            style={[
              styles.infoCard,
              { opacity: cardFade1, transform: [{ translateY: cardSlide1 }] },
            ]}
          >
            <View style={styles.cardIconBg}>
              <Ionicons name="search-outline" size={20} color="#FF453A" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Under Review</Text>
              <Text style={styles.cardText}>Our team is reviewing your club information</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.infoCard,
              { opacity: cardFade2, transform: [{ translateY: cardSlide2 }] },
            ]}
          >
            <View style={styles.cardIconBg}>
              <Ionicons name="mail-outline" size={20} color="#FF453A" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Email Notification</Text>
              <Text style={styles.cardText}>You'll be notified at {email} once approved</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.infoCard,
              { opacity: cardFade3, transform: [{ translateY: cardSlide3 }] },
            ]}
          >
            <View style={styles.cardIconBg}>
              <Ionicons name="time-outline" size={20} color="#FF453A" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Expected Timeline</Text>
              <Text style={styles.cardText}>Approval typically takes 24–48 hours</Text>
            </View>
          </Animated.View>
        </View>

        {/* Back to Home button */}
        <Animated.View style={{ opacity: fadeAnim, width: '100%', paddingHorizontal: 24 }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/")}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#121212" style={{ marginRight: 8 }} />
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // ─── Registration Form ────────────────────────────────────────
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
                  <Text style={styles.inputLabel}>Club Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="club@example.com"
                    placeholderTextColor="#8E8E93"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

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

                {errorMessage ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={20} color="#FF453A" />
                    <Text style={styles.errorBannerText}>{errorMessage}</Text>
                    <TouchableOpacity onPress={() => setErrorMessage("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="close-circle" size={20} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator size="small" color="#121212" />
                      <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>Submitting...</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>Create Club Account</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    aspectRatio: 16 / 9,
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Approval Pending Screen ──────────────────────────────────
  approvalContainer: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconArea: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  outerRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255, 69, 58, 0.15)',
    borderTopColor: 'rgba(255, 69, 58, 0.6)',
    borderRightColor: 'rgba(255, 69, 58, 0.3)',
  },
  innerRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(255, 69, 58, 0.1)',
    borderBottomColor: 'rgba(255, 69, 58, 0.4)',
    borderLeftColor: 'rgba(255, 69, 58, 0.2)',
  },
  approvalIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.25)',
  },
  approvalTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  approvalSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 36,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF453A',
  },

  // Info cards
  cardsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 36,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  cardIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  cardText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },

  // Back button
  backButton: {
    backgroundColor: '#FF453A',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
  },

  // Error banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.3)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    color: '#FF6961',
    fontSize: 14,
    marginLeft: 10,
    marginRight: 8,
    lineHeight: 20,
  },
});