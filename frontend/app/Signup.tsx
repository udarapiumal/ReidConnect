import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import { BASE_URL } from '../constants/config';

// Extended type to include web-specific properties
interface ExtendedImagePickerAsset extends ImagePicker.ImagePickerAsset {
    file?: File;
    mimeType?: string;
}

export default function SignUp() {
    const router = useRouter();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [contact_number, setContact_number] = useState<string>('');
    const [academic_year, setAcademic_year] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<ExtendedImagePickerAsset | null>(null);

    // Focus states
    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
    const [contactFocused, setContactFocused] = useState(false);
    const [verificationFocused, setVerificationFocused] = useState(false);

    const [step1Error, setStep1Error] = useState<boolean>(true);
    const [step2Error, setStep2Error] = useState<boolean>(true);
    const [step3Error, setStep3Error] = useState<boolean>(true);

    const validateStep1 = (): void => {
        const nameRegex = /^[a-zA-Z ]{2,30}$/;
        setStep1Error(!(nameRegex.test(name)));
    };

    const validateStep2 = (): void => {
        const emailRegex = /^\d{4}[a-z]{2}\d{3}@stu\.ucsc\.cmb\.ac\.lk$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        const isEmailValid = emailRegex.test(email);
        const isPasswordValid = passwordRegex.test(password);
        const isConfirmMatch = password === confirmPassword;

        setStep2Error(!(isEmailValid && isPasswordValid && isConfirmMatch));
    };

    const validateStep3 = (): void => {
        const contactRegex = /^[0-9]{10}$/;
        setStep3Error(!contactRegex.test(contact_number));
    };

    useEffect(() => { validateStep1(); }, [name]);
    useEffect(() => { validateStep2(); }, [email, password, confirmPassword]);
    useEffect(() => { validateStep3(); }, [contact_number]);

    const pickImage = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert("Permission to access media library is required!");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (!result.canceled && result.assets.length > 0) {
    setSelectedImage(result.assets[0]);
  }
};


    const handleSubmit = async (): Promise<void> => {
  const formData = new FormData();
  formData.append("username", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("contactNumber", contact_number);
  formData.append("academicYear", academic_year);

  if (selectedImage) {
    formData.append("profilePic", {
      uri: selectedImage.uri,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    Alert.alert("Success", "Verification code sent to email. Please verify your account.");
  } catch (err: any) {
    console.error("Signup error:", err.message);
    Alert.alert("Signup failed", "Try again later.");
  }
};


    const handleVerify = async (): Promise<void> => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/verify`, {
                email,
                verificationCode
            });
            Alert.alert('Success', 'Account verified successfully!');
            router.push('/Login');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                Alert.alert('Verification failed', JSON.stringify(err.response?.data || err.message));
            } else {
                Alert.alert('Verification failed', 'Try again later.');
            }
            console.error(err);
        }
    };

    const handleResend = async (): Promise<void> => {
        try {
            await axios.post(`${BASE_URL}/auth/resend?email=` + email);
            Alert.alert('Success', 'Verification code resent!');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                Alert.alert('Could not resend code', JSON.stringify(err.response?.data || err.message));
            } else {
                Alert.alert('Could not resend code', 'Try again later.');
            }
            console.error(err);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
            
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Create Account</Text>
                    <Text style={styles.headerSubtitle}>Join the Reid Connect community</Text>
                </View>

                {/* Progress Steps */}
                <View style={styles.progressContainer}>
                    <ProgressSteps
                        completedStepIconColor="#FF453A"
                        activeStepIconBorderColor="#FF453A"
                        activeLabelColor="#FF453A"
                        labelColor="#71717A"
                        progressBarColor="#FF453A"
                        completedStepNumColor="#FFFFFF"
                        activeStepNumColor="#FFFFFF"
                        disabledStepNumColor="#52525B"
                        completedProgressBarColor="#FF453A"
                        activeProgressBarColor="#FF453A"
                        borderWidth={2}
                        activeStepIconBorderWidth={2}
                        marginBottom={0}
                    >
                        <ProgressStep label="Personal" errors={step1Error}>
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>Personal Information</Text>
                                <Text style={styles.stepSubtitle}>Tell us about yourself</Text>
                                
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            nameFocused && styles.inputFocused
                                        ]}
                                        placeholder="Enter Your Full Name"
                                        placeholderTextColor="#71717A"
                                        value={name}
                                        onChangeText={setName}
                                        onFocus={() => setNameFocused(true)}
                                        onBlur={() => setNameFocused(false)}
                                    />
                                </View>
                            </View>
                        </ProgressStep>

                        <ProgressStep label="Account" errors={step2Error}>
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>Account Details</Text>
                                <Text style={styles.stepSubtitle}>Set up your login credentials</Text>
                                
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            emailFocused && styles.inputFocused
                                        ]}
                                        placeholder="University Email Address"
                                        placeholderTextColor="#71717A"
                                        value={email}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        onChangeText={setEmail}
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => setEmailFocused(false)}
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            passwordFocused && styles.inputFocused
                                        ]}
                                        placeholder="Create Password"
                                        placeholderTextColor="#71717A"
                                        value={password}
                                        secureTextEntry
                                        onChangeText={setPassword}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            confirmPasswordFocused && styles.inputFocused
                                        ]}
                                        placeholder="Confirm Password"
                                        placeholderTextColor="#71717A"
                                        value={confirmPassword}
                                        secureTextEntry
                                        onChangeText={setConfirmPassword}
                                        onFocus={() => setConfirmPasswordFocused(true)}
                                        onBlur={() => setConfirmPasswordFocused(false)}
                                    />
                                </View>
                            </View>
                        </ProgressStep>

                        <ProgressStep label="Profile" errors={step3Error}>
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>Profile Setup</Text>
                                <Text style={styles.stepSubtitle}>Add your contact and photo</Text>
                                
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            contactFocused && styles.inputFocused
                                        ]}
                                        placeholder="Contact Number (10 digits)"
                                        placeholderTextColor="#71717A"
                                        value={contact_number}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        onChangeText={setContact_number}
                                        onFocus={() => setContactFocused(true)}
                                        onBlur={() => setContactFocused(false)}
                                    />
                                    
                                    <TouchableOpacity 
                                        onPress={pickImage} 
                                        style={styles.imageButton}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.imageButtonText}>
                                            {selectedImage ? "Change Profile Picture" : "Upload Profile Picture"}
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    {selectedImage && (
                                        <View style={styles.imagePreviewContainer}>
                                            <Image
                                                source={{ uri: selectedImage.uri }}
                                                style={styles.imagePreview}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                        </ProgressStep>

                        <ProgressStep label="Academic" onNext={handleSubmit}>
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>Academic Information</Text>
                                <Text style={styles.stepSubtitle}>Select your current year</Text>
                                
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        style={styles.picker}
                                        selectedValue={academic_year}
                                        onValueChange={(itemValue: string) => setAcademic_year(itemValue)}
                                        dropdownIconColor="#71717A"
                                    >
                                        <Picker.Item label="Select Academic Year" value="" color="#71717A" />
                                        <Picker.Item label="1st Year" value="1" color="#FFFFFF" />
                                        <Picker.Item label="2nd Year" value="2" color="#FFFFFF" />
                                        <Picker.Item label="3rd Year" value="3" color="#FFFFFF" />
                                        <Picker.Item label="4th Year" value="4" color="#FFFFFF" />
                                    </Picker>
                                </View>
                            </View>
                        </ProgressStep>

                        <ProgressStep label="Verify" onSubmit={handleVerify}>
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>Email Verification</Text>
                                <Text style={styles.stepSubtitle}>Enter the code sent to your email</Text>
                                
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            verificationFocused && styles.inputFocused
                                        ]}
                                        placeholder="Enter Verification Code"
                                        placeholderTextColor="#71717A"
                                        value={verificationCode}
                                        keyboardType="numeric"
                                        onChangeText={setVerificationCode}
                                        onFocus={() => setVerificationFocused(true)}
                                        onBlur={() => setVerificationFocused(false)}
                                    />
                                    
                                    <TouchableOpacity 
                                        onPress={handleResend}
                                        style={styles.resendButton}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.resendText}>
                                            Resend Verification Code
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ProgressStep>
                    </ProgressSteps>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.optionContainer}>
                        <Text style={styles.optionText}>Already have an account?</Text>
                        <TouchableOpacity 
                            onPress={() => router.push('/Login')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.linkText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#121212',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 24,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        color: '#A1A1AA',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '400',
    },
    progressContainer: {
        flex: 1,
    },
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 32,
        paddingHorizontal: 8,
        minHeight: 350,
    },
    stepTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    stepSubtitle: {
        color: '#A1A1AA',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '400',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 54,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '400',
    },
    inputFocused: {
        borderColor: '#FF453A',
        borderWidth: 2,
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
    },
    pickerContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        marginBottom: 16,
    },
    picker: {
        width: '100%',
        height: 54,
        color: '#FFFFFF',
    },
    imageButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 16,
    },
    imageButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FF453A',
    },
    resendButton: {
        marginTop: 16,
    },
    resendText: {
        color: '#FF453A',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    footer: {
        paddingBottom: 24,
        paddingTop: 16,
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    optionText: {
        color: '#71717A',
        fontSize: 14,
        fontWeight: '400',
    },
    linkText: {
        color: '#FF453A',
        fontSize: 14,
        fontWeight: '600',
    },
});