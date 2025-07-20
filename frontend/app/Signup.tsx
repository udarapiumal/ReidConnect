import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
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

    const pickImage = async (): Promise<void> => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access media library is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Keep this for now to avoid the deprecation warning in some versions
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            selectionLimit: 1,
            exif: false,
            base64: false,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0] as ExtendedImagePickerAsset;
            console.log("Selected image properties:", Object.keys(asset));
            console.log("Selected image details:", {
                uri: asset.uri,
                type: asset.type,
                fileName: asset.fileName,
                fileSize: asset.fileSize,
                mimeType: asset.mimeType,
                hasFile: !!(asset as any).file,
            });
            setSelectedImage(asset);
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
            // Check if we're in a web environment with a File object
            if ((selectedImage as any).file) {
                // For web/Expo web - use the actual File object
                const file = (selectedImage as any).file as File;
                formData.append("profilePic", file, selectedImage.fileName || "profile.jpg");
                console.log("Appending File object:", {
                    name: selectedImage.fileName,
                    size: selectedImage.fileSize,
                    type: selectedImage.mimeType
                });
            } else if (selectedImage.uri && !selectedImage.uri.startsWith('data:')) {
                // For native React Native - use the URI format
                const uriParts = selectedImage.uri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                
                formData.append("profilePic", {
                    uri: selectedImage.uri,
                    name: selectedImage.fileName || `profile.${fileType}`,
                    type: selectedImage.mimeType || `image/${fileType}`,
                } as any);
                
                console.log("Appending native file:", {
                    uri: selectedImage.uri,
                    name: selectedImage.fileName,
                    type: selectedImage.mimeType
                });
            } else if (selectedImage.uri && selectedImage.uri.startsWith('data:')) {
                // Handle base64 data URI (fallback)
                console.log("Converting base64 to blob...");
                try {
                    const response = await fetch(selectedImage.uri);
                    const blob = await response.blob();
                    formData.append("profilePic", blob, selectedImage.fileName || "profile.jpg");
                    
                    console.log("Appending blob from base64:", {
                        name: selectedImage.fileName,
                        size: blob.size,
                        type: blob.type
                    });
                } catch (error) {
                    console.error("Error converting base64 to blob:", error);
                }
            }
        }

        try {
            const res = await axios.post(`${BASE_URL}/auth/signup`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 10000,
            });

            console.log("Signup response:", res.data);
            Alert.alert("Success", "Verification code sent to email. Please verify your account.");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Axios error response:", err.response);
                Alert.alert("Signup failed", JSON.stringify(err.response?.data || err.message));
            } else {
                Alert.alert("Signup failed", "Try again later.");
                console.error("Unknown error:", err);
            }
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
        <View style={styles.container}>
            <ProgressSteps
                completedStepIconColor="#FF0033"
                activeStepIconBorderColor="#c0392b"
                activeLabelColor="#c0392b"
                labelColor="#888"
                progressBarColor="#FF0033"
                completedStepNumColor="#ffffff"
                activeStepNumColor="#ffffff"
                disabledStepNumColor="#121212"
            >
                <ProgressStep label="Step 1" errors={step1Error}>
                    <Text style={styles.title}>Sign Up</Text>
                    <View style={styles.step}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Name:"
                            placeholderTextColor="#888"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                </ProgressStep>
                <ProgressStep label="Step 2" errors={step2Error}>
                    <View style={styles.step}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your E-mail:"
                            placeholderTextColor="#888"
                            value={email}
                            keyboardType="email-address"
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password:"
                            placeholderTextColor="#888"
                            value={password}
                            secureTextEntry
                            onChangeText={setPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Re-enter Password:"
                            placeholderTextColor="#888"
                            value={confirmPassword}
                            secureTextEntry
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                </ProgressStep>
                <ProgressStep label="Step 3" errors={step3Error}>
                    <View style={styles.step}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Contact Number:"
                            placeholderTextColor="#888"
                            value={contact_number}
                            keyboardType="numeric"
                            onChangeText={setContact_number}
                        />
                        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                            <Text style={styles.imageButtonText}>
                                {selectedImage ? "Change Profile Picture" : "Upload Profile Picture"}
                            </Text>
                        </TouchableOpacity>
                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage.uri }}
                                style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }}
                            />
                        )}
                    </View>
                </ProgressStep>
                <ProgressStep label="Step 4" onNext={handleSubmit}>
                    <View style={styles.step}>
                        <Picker
                            style={styles.picker}
                            selectedValue={academic_year}
                            onValueChange={(itemValue: string) => setAcademic_year(itemValue)}
                        >
                            <Picker.Item label="Select Academic Year" value="" />
                            <Picker.Item label="1st Year" value="1" />
                            <Picker.Item label="2nd Year" value="2" />
                            <Picker.Item label="3rd Year" value="3" />
                            <Picker.Item label="4th Year" value="4" />
                        </Picker>
                    </View>
                </ProgressStep>
                <ProgressStep label="Verify" onSubmit={handleVerify}>
                    <View style={styles.step}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Verification Code"
                            placeholderTextColor="#888"
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                        />
                        <Text style={styles.resendText} onPress={handleResend}>
                            Resend Verification Code
                        </Text>
                    </View>
                </ProgressStep>
            </ProgressSteps>
            <View style={styles.loginRedirectContainer}>
                <Text style={styles.loginText}>
                    Already have an account?{' '}
                    <Text style={styles.loginLink} onPress={() => router.push('/Login')}>
                        Log in
                    </Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151718',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#ffffff',
    },
    step: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 320,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1.5,
        borderColor: '#444',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#1A1A1A',
        fontSize: 16,
        color: '#ffffff',
    },
    picker: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#1e1e1e',
        color: '#ffffff',
    },
    imageButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#FF0033',
        borderRadius: 10,
    },
    imageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    resendText: {
        color: '#007BFF',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    loginRedirectContainer: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#121212',
    },
    loginText: {
        fontSize: 16,
        color: '#cccccc',
    },
    loginLink: {
        color: '#FF0033',
        fontWeight: 'bold',
    },
});