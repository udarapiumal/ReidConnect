import { Ionicons } from '@expo/vector-icons';
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
import { useClub } from "../../context/ClubContext";

const { width } = Dimensions.get('window');

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Cover Image with Centered Profile Picture */}
        <View style={styles.coverSection}>
          <View style={styles.coverImageContainer}>
            <Image
              source={require("../../../assets/clubImages/profilePictures/rota_cover.jpg")}
              style={styles.coverImage}
              resizeMode="cover"
            />
          </View>
          
          {/* Profile Picture centered on cover */}
          <View style={styles.profilePictureSection}>
            <View style={styles.profilePictureContainer}>
              <View style={styles.profilePicture}>
                <Image 
                  source={require("../../../assets/clubImages/profilePictures/rota_ucsc.jpg")} 
                  style={styles.profilePictureImage} 
                />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151718",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
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