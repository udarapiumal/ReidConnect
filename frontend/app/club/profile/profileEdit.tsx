import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../../constants/config';
import { useClub } from "../../context/ClubContext";

const { width } = Dimensions.get('window');
const router = useRouter();

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { clubDetails, user } = useClub();

  const [name, setName] = useState("");
  const [profilePicture, setprofilePicture] = useState("");
  const [website, setwebsite] = useState("");
  const [bio, setbio] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Profile Updated", "Your profile has been saved successfully");
  };

  useEffect(() => {
    if (clubDetails) {
      setName(clubDetails.clubName || "");
      setprofilePicture(clubDetails.profilePicture || "");
      setwebsite(clubDetails.website || "");
      setbio(clubDetails.bio || "");
      setIsPrivate(clubDetails.isPrivate ?? true);
    }
  }, [clubDetails]);

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  const copyToClipboard = () => {
    Alert.alert("Copied", "Channel URL copied to clipboard");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
                      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                         <Ionicons name="arrow-back" size={24} color="#fff" />
                      </TouchableOpacity>
                      
                        <Text style={styles.title}>Profile</Text>
                      
                      <View style={styles.headerActions}>
                      </View>
                    </View>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        

        <ScrollView style={styles.scrollView}>
          {/* Cover Image with Centered Profile Picture */}
          <View style={styles.coverSection}>
            <View style={styles.coverImageContainer}>
              {clubDetails?.profilePicture ? (
                    <Image
                source={{
                    uri: `${BASE_URL}${clubDetails.coverPicture}`
                }}
                style={styles.coverImage}
                />
                ) : (
                    <Image
                    source={require('../../../assets/images/default-profile.png')} // fallback image
                    style={styles.coverImage}
                    />
                )}
            </View>
            
            {/* Profile Picture centered on cover */}
            <View style={styles.profilePictureSection}>
              <View style={styles.profilePictureContainer}>
                <View style={styles.profilePicture}>
                  {clubDetails?.profilePicture ? (
                        <Image
                    source={{
                        uri: `${BASE_URL}${clubDetails.profilePicture}`
                    }}
                    style={styles.coverImage}
                    />
                    ) : (
                        <Image
                        source={require('../../../assets/images/default-profile.png')} // fallback image
                        style={styles.coverImage}
                        />
                    )}
                </View>
                <TouchableOpacity style={styles.cameraButton}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Edit Cover Photo Button */}
            <TouchableOpacity style={styles.editCoverButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile Fields */}
          <View style={styles.profileFields}>
            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Name</Text>
              <View style={styles.fieldRow}>
                {isEditing ? (
                  <TextInput
                    style={[styles.fieldValue, styles.editableField]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                    placeholderTextColor="#666"
                  />
                ) : (
                  <Text style={styles.fieldValue}>{name}</Text>
                )}
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  <Ionicons name="pencil" size={16} color="#fff" />
                </TouchableOpacity>

              </View>
            </View>

            {/* Channel URL Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Website URL</Text>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldValue}>{website}</Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  <Ionicons name="pencil" size={16} color="#fff" />
                </TouchableOpacity>

              </View>
            </View>

            {/* bio Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <View style={styles.fieldRow}>
                {isEditing ? (
                  <TextInput
                    style={[styles.fieldValue, styles.editableField]}
                    value={bio}
                    onChangeText={setbio}
                    placeholder="Add a bio"
                    placeholderTextColor="#666"
                    multiline
                  />
                ) : (
                  <Text style={[styles.fieldValue, styles.bioText]}>
                    {bio}
                  </Text>
                )}
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  <Ionicons name="pencil" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            
          </View>

          {/* Edit Buttons */}
          {isEditing && (
            <View style={styles.editingButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
        flex: 1,
        backgroundColor: "#151718",
    },
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
    backgroundColor: '#151718',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    width: 44,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  searchButton: {
    width: 44,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonActive: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  container: {
    flex: 1,
    backgroundColor: "#151718",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "0F0F0F",
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    color: "#fff",
    fontSize: 24,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
    marginLeft: 16,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerIcon: {
    padding: 8,
  },
  headerIconText: {
    color: "#fff",
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  coverSection: {
    position: "relative",
    width: "100%",
    height: 200, // Maintain aspect ratio for 820x462
    backgroundColor: "#222",
  },
  coverImageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#222",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  profilePictureSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePictureContainer: {
    position: "relative",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 80,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
  },
  profilePictureImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  profilePictureText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  cameraButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#333",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIcon: {
    fontSize: 16,
  },
  editCoverButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    fontSize: 16,
  },
  profileFields: {
    paddingHorizontal: 16,
    paddingTop: 32,
    backgroundColor: "#151718",
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldValue: {
    color: "#ccc",
    fontSize: 16,
    flex: 1,
  },
  editableField: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 4,
    color: "#fff",
  },
  bioText: {
    color: "#666",
    fontStyle: "italic",
  },
  editButton: {
    padding: 8,
  },
  editButtonIcon: {
    fontSize: 16,
  },
  privacyContainer: {
    marginTop: 8,
  },
  privacyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  privacyText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  privacyNote: {
    color: "#666",
    fontSize: 12,
    lineHeight: 16,
  },
  editingButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  saveButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
});