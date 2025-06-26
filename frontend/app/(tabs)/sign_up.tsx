import {Text, View, StyleSheet, TextInput} from "react-native";
import {useState} from "react";
import {Picker} from "@react-native-picker/picker";
import {ProgressStep, ProgressSteps} from "react-native-progress-steps";
import axios, { AxiosError } from "axios";

export default function SignUp(){
    const [name,setName]=useState('');
    const [age,setAge]=useState('');
    const [email,setEmail]=useState('');
    const [contact_number,setContact_number]=useState('');
    const [academic_year,setAcademic_year]=useState('');
    const [password,setPassword]=useState('');

    const handleSubmit = async () => {
        const nameRegex = /^[a-zA-Z ]{2,30}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        const contactRegex = /^[0-9]{10}$/;

        if (!nameRegex.test(name)) {
            alert("Name must be 2–30 letters only.");
            return;
        }
        if (!emailRegex.test(email)) {
            alert("Enter a valid email address.");
            return;
        }
        if (!passwordRegex.test(password)) {
            alert(
                "Password must contain:\n- Min 8 characters\n- Upper & lower case letters\n- A number\n- A special character"
            );
            return;
        }
        if (!contactRegex.test(contact_number)) {
            alert("Contact number must be exactly 10 digits.");
            return;
        }
        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 50) {
            alert("Age must be a number between 18 and 50.");
            return;
        }

        try {
            const res = await axios.post("http://192.168.1.5:8080/auth/signup", {
                username: name,
                email: email,
                password: password,
                contactNumber: contact_number,
                academicYear: academic_year,
                age: ageNum,
            });

            alert("Verification code sent to email. Please verify your account.");

            // TODO: Navigate to verification screen or show input field for code entry
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data) {
                    alert("Signup failed: " + JSON.stringify(err.response.data));
                } else {
                    alert("Signup failed: No response data");
                }
            } else {
                alert("Signup failed. Try again later.");
            }
            console.error(err);
        }
    };

    const [verificationCode, setVerificationCode] = useState('');

    const handleVerify = async () => {
        try {
            const res = await axios.post('http://192.168.1.5:8080/auth/verify', {
                email,
                verificationCode
            });
            alert('Account verified successfully!');
            // You can navigate to login screen here
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data) {
                    alert('Verification failed: ' + JSON.stringify(err.response.data));
                } else {
                    alert('Verification failed: No response data');
                }
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
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data) {
                    alert('Could not resend code: ' + JSON.stringify(err.response.data));
                } else {
                    alert('Could not resend code: No response data');
                }
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
            <ProgressStep label="Step 1" >
                <Text style={styles.title}>Sign Up</Text>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Name:"
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Age:"
                        value={age}
                        keyboardType={"numeric"}
                        onChangeText={text => setAge(text)}
                    />
                </View>
            </ProgressStep>
            <ProgressStep label="Step 2" >
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your E-mail:"
                        value={email}
                        keyboardType={"email-address"}
                        onChangeText={text => setEmail(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password:"
                        value={password}
                        secureTextEntry
                        onChangeText={text => setPassword(text)}
                    />

                </View>
            </ProgressStep>
            <ProgressStep label="Step 3" >
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Contact Number:"
                        value={contact_number}
                        keyboardType={"numeric"}
                        onChangeText={text => setContact_number(text)}
                    />


                </View>
            </ProgressStep>
            <ProgressStep label="Step 4" onSubmit={handleSubmit} >
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>

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
            <ProgressStep  label="Verify" onSubmit={handleVerify} >
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
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
    },
    inputFocused: {
        borderColor: '#007bff', // Blue border on focus
    },
    placeholderTextColor: {
        color: '#aaa',
    },
    Button: {
        backgroundColor: '#c0392b',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    ButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});