import { useRouter } from "expo-router";
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require("../../assets/images/reidConnect.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.welcomeTitle}>
            Welcome To Reid Connect!
          </Text>
          
          <Text style={styles.subtitle}>
            Discover clubs, events and enhance your uni life
          </Text>
        </View>

        {/* Action Section */}
        <View style={styles.actionSection}>
          {/* Primary Sign Up Button */}
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => router.push('/Signup')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          {/* Login Option */}
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Already have an account?</Text>
            <TouchableOpacity 
              onPress={() => router.push('/Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Sign in</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Club Registration Option */}
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/clubRegistration')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Club Registration</Text>
          </TouchableOpacity>

          <Text style={styles.clubSubtext}>
            Join the platform as a club administrator
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logo: {
    width: 80,
    height: 80,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
    fontWeight: '400',
  },
  actionSection: {
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 6,
  },
  optionText: {
    color: '#71717A',
    fontSize: 14,
    fontWeight: '400',
  },
  linkText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  clubSubtext: {
    color: '#71717A',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 32,
  },
  footer: {
    paddingBottom: 24,
  },
  footerText: {
    color: '#52525B',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 300,
    alignSelf: 'center',
  },
});