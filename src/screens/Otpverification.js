import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AppModal from '../components/AppModal';

export default function VerifyOtp() {
  useEffect(() => {
    const checkStorage = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const mobile = await AsyncStorage.getItem('mobile_no');

      console.log('STORAGE KEYS:', keys);
      console.log('MOBILE FROM STORAGE:', mobile);
    };

    checkStorage();
  }, []);

  const navigation = useNavigation();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [afterCloseAction, setAfterCloseAction] = useState(null);

  const inputs = useRef([]);

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

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);

      const finalOtp = otp.join('');

      if (finalOtp.length !== 4) {
        showModal('Please enter complete OTP', 'warning');
        return;
      }

      const mobile = await AsyncStorage.getItem('mobile_no');

      const body = new URLSearchParams();
      body.append('otp', finalOtp);
      body.append('mobile_no', mobile);

      const response = await axios.post(
        'https://patilhardware.com/MobileWeb/userotpVerify',
        body.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const json = response.data;

      console.log('OTP RESPONSE:', json);

      if (json?.re === 'true') {
        await AsyncStorage.setItem(
          'unique_id',
          json?.data?.user_unique_id?.toString(),
        );

        setAfterCloseAction(() => () => navigation.replace('ServiceStatus'));
        showModal('Login Successful', 'success');
      } else {
        showModal(json?.msg || 'Invalid OTP', 'error');
      }
    } catch (error) {
      console.log('OTP ERROR:', error?.response || error);
      showModal('API call failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../assets/images/patilapplogo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>OTP</Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, index)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={verifyOtp}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Submit OTP</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',

    // 🔥 premium shadow
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  logo: {
    width: 140,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
    letterSpacing: 0.5,
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 30,
  },

  // 🔥 OTP INPUT (premium)
  otpInput: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',

    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#000',

    borderWidth: 1.5,
    borderColor: '#E5E5E5',

    // shadow feel
    elevation: 2,
  },

  // 🔥 BUTTON (brand orange)
  btn: {
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

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },

//   card: {
//     width: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//   },

//   logo: {
//   width: 180,
//   height: 170,
//   resizeMode: 'contain',
//   marginBottom: 15,
// },

//   title: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 20,
//     color: '#000',
//   },

//   otpRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '80%',
//     marginBottom: 25,
//   },

//   otpInput: {
//     width: 52,
//     height: 52,
//     borderRadius: 7,
//     backgroundColor: '#F1F1F1',
//     textAlign: 'center',
//     fontSize: 25,
//     fontWeight: '600',
//     color: '#000',
//     borderColor: '#999999',
//     borderWidth: 1,
//   },

//   btn: {
//     backgroundColor: '#3F5E9A',
//     width: '100%',
//     height: 50,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   btnText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
