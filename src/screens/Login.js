import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppModal from '../components/AppModal';

export default function Login() {
  const navigation = useNavigation();

  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [afterCloseAction, setAfterCloseAction] = useState(null);

  const showModal = (message, type = 'success') => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);

    if (afterCloseAction) {
      afterCloseAction();
      setAfterCloseAction(null);
    }
  };

  const handleLogin = async () => {
    if (mobile.length !== 10) {
      showModal('Please enter valid 10 digit number', 'warning');
      return;
    }

    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append('mobile_no', mobile);

      const response = await fetch(
        'https://patilhardware.com/MobileWeb/userLogin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        },
      );

      const json = await response.json();
      console.log('LOGIN RESPONSE ===>', json);

      if (json?.status === 'true') {
        await AsyncStorage.setItem('mobile_no', mobile);
        await AsyncStorage.setItem('otp', json?.otp?.toString());

        setAfterCloseAction(() => () => navigation.navigate('Otpverification'));
        showModal('OTP Sent on Your WhatsApp', 'success');
      } else {
        setAfterCloseAction(() => () => navigation.navigate('Home'));
        showModal(json?.msg || 'Login failed', 'error');
      }
    } catch (error) {
      console.log('Login Error:', error);
      showModal('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.card}>
        <Image
          source={require('../assets/images/patilapplogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Please Enter your Number"
          placeholderTextColor="#8A8A8A"
          keyboardType="number-pad"
          maxLength={10}
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
        />

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={handleCloseModal}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,

    // 🔥 premium shadow
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  logo: {
    width: 130,
    height: 110,
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 25,
    letterSpacing: 0.5,
  },

  // 🔥 INPUT (premium)
  input: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',

    borderWidth: 1.2,
    borderColor: '#E5E5E5',

    paddingHorizontal: 15,
    fontSize: 15,
    color: '#000',
    marginBottom: 25,
  },

  // 🔥 BUTTON (brand orange)
  loginBtn: {
    backgroundColor: '#F07C00',
    width: '100%',
    height: 52,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   card: {
//     width: '90%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     alignItems: 'center',
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//   },

//   logo: {
//     width: 150,
//     height: 130,
//     marginBottom: 15,
//   },

//   title: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#111',
//     marginBottom: 25,
//   },

//   input: {
//     width: '100%',
//     height: 50,
//     borderRadius: 8,
//     backgroundColor: '#F3F3F3',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     paddingHorizontal: 15,
//     fontSize: 16,
//     marginBottom: 25,
//   },

//   loginBtn: {
//     backgroundColor: '#3F5E9A',
//     width: 200,
//     height: 50,
//     borderRadius: 8,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   loginText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
