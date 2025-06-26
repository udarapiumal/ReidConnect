import { Text, View, StyleSheet, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import axios from "axios";

export default function SignUp() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [contact_number, setContact_number] = useState('');
    const [academic_year, setAcademic_year] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    // Step validation state
    const [step1Error, setStep1Error] = useState(true);
    const [step2Error, setStep2Error] = useState(true);
    const [step3Error, setStep3Error] = useState(true);

    // Validation functions
    const validateStep1 = () => {
        const nameRegex = /^[a-zA-Z ]{2,30}$/;
        const ageNum = parseInt(age, 10);
        setStep1Error(!(nameRegex.test(name) && !isNaN(ageNum) && ageNum >= 18 && ageNum <= 50));
    };

    const validateStep2 = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        setStep2Error(!(emailRegex.test(email) && passwordRegex.test(password)));
    };

    const validateStep3 = () => {
        const contactRegex = /^[0-9]{10}$/;
        setStep3Error(!contactRegex.test(contact_number));
    };

    useEffect(() => {
        validateStep1();
    }, [name, age]);

    useEffect(() => {
        validateStep2();
    }, [email, password]);

    useEffect(() => {
        validateStep3();
    }, [contact_number]);

    const handleSubmit = async () => {
        try {
            const res = await axios.post("http://localhost:8080/auth/signup", {
                username: name,
                email: email,
                password: password,
                contactNumber: contact_number,
                academicYear: academic_year,
                age: parseInt(age, 10),
            });
            console.log("Signup response:", res);
            alert("Verification code sent to email. Please verify your account.");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Axios error response:", err.response);
                alert("Signup failed: " + JSON.stringify(err.response?.data || err.message));
            } else {
                alert("Signup failed. Try again later.");
                console.error("Unknown error:", err);
            }
        }
    };

    const handleVerify = async () => {
        try {
            const res = await axios.post("http://192.168.56.1:8080/auth/verify", {
                email,
                verificationCode
            });
            alert('Account verified successfully!');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                alert('Verification failed: ' + JSON.stringify(err.response?.data || err.message));
            } else {
                alert('Verification failed. Try again later.');
            }
            console.error(err);
        }
    };

    const handleResend = async () => {
        try {
            await axios.post('http://192.168.1.5:8080/auth/resend?email=' + email);
            alert('Verification code resent!');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                alert('Could not resend code: ' + JSON.stringify(err.response?.data || err.message));
            } else {
                alert('Could not resend code. Try again later.');
            }
            console.error(err);
        }
    };

    return (
        <ProgressSteps
            completedStepIconColor="#e74c3c"
            activeStepIconBorderColor="#c0392b"
            activeLabelColor="#c0392b"
            labelColor="#999"
            progressBarColor="#e74c3c"
        >
            <ProgressStep label="Step 1" errors={step1Error}>
                <Text style={styles.title}>Sign Up</Text>
                <View style={styles.step}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Name:"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Age:"
                        value={age}
                        keyboardType="numeric"
                        onChangeText={(text) => setAge(text)}
                    />
                </View>
            </ProgressStep>
            <ProgressStep label="Step 2" errors={step2Error}>
                <View style={styles.step}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your E-mail:"
                        value={email}
                        keyboardType="email-address"
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password:"
                        value={password}
                        secureTextEntry
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>
            </ProgressStep>
            <ProgressStep label="Step 3" errors={step3Error}>
                <View style={styles.step}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Contact Number:"
                        value={contact_number}
                        keyboardType="numeric"
                        onChangeText={(text) => setContact_number(text)}
                    />
                </View>
            </ProgressStep>
            <ProgressStep label="Step 4" onNext={handleSubmit}>
                <View style={styles.step}>
                    <Picker
                        style={styles.input}
                        selectedValue={academic_year}
                        onValueChange={(itemValue) => setAcademic_year(itemValue)}
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
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                    />
                    <Text style={{ color: '#007BFF', marginTop: 10 }} onPress={handleResend}>
                        Resend Verification Code
                    </Text>
                </View>
            </ProgressStep>
        </ProgressSteps>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    step: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
    }
});
