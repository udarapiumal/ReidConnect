import {Text, View, StyleSheet, TextInput, TouchableOpacity, Button} from "react-native";
import {useState} from "react";
import {Picker} from "@react-native-picker/picker";

export default function SignUp(){
    const [name,setName]=useState('');
    const [age,setAge]=useState('');
    const [email,setEmail]=useState('');
    const [contact_number,setContact_number]=useState('');
    const [address,setAddress]=useState('');
    const [nic,setNic]=useState('');
    const [academic_year,setAcademic_year]=useState('');
    const [password,setPassword]=useState('');

    const handleSubmit=()=>{
        const nameRegex=/^[a-zA-Z ]{2,30}$/;
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegex.test(name)) {
            alert('Name must be 2–30 letters only.');
            return;
        }
        if (!emailRegex.test(email)) {
            alert('Enter a valid email address.');
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!passwordRegex.test(password)) {
            alert('Password must contain:\n- Min 8 characters\n- Upper & lower case letters\n- A number\n- A special character');
            return;
        }
        const contactRegex = /^[0-9]{10}$/;

        if (!contactRegex.test(contact_number)) {
            alert('Contact number must be exactly 10 digits.');
            return;
        }

        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 50) {
            alert('Age must be a number between 18 and 50.');
            return;
        }
        alert('Form submitted successfully!');

    }



    return(
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Enter Your E-mail:"
                value={email}
                keyboardType={"email-address"}
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Your Contact Number:"
                value={contact_number}
                keyboardType={"numeric"}
                onChangeText={text => setContact_number(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Your Address:"
                value={address}
                onChangeText={text => setAddress(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Your NIC:"
                value={nic}
                keyboardType={"numeric"}
                onChangeText={text => setNic(text)}
            />
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
            <TextInput
                style={styles.input}
                placeholder="Password:"
                value={password}
                secureTextEntry
                onChangeText={text => setPassword(text)}
            />
            <Button color="#c0392b" onPress={handleSubmit} title="Submit"></Button>
            <Text style={styles.alt}>Already have an account?<TouchableOpacity>Log in</TouchableOpacity></Text>

        </View>
    );
}
const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    alt:{
        padding:50
    }
})