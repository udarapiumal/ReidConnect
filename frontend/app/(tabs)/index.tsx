import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  
  return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome Back</Text>
        <Text style={styles.text}>Name</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={() => router.push('/admin')}
          >
            <Text style={styles.buttonText}>Admin Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 30,
  },
  adminButton: {
    backgroundColor: '#F86D70',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
