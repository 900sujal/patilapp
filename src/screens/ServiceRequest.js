import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonHeader from '../components/CommonHeader';
import AppModal from '../components/AppModal';

export default function ServiceRequest() {
  const navigation = useNavigation();
  const route = useRoute();

  const [showDate, setShowDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [afterCloseAction, setAfterCloseAction] = useState(null);

  const [focused, setFocused] = useState(null);

  const serviceId = route?.params?.id || '';
  const serviceName = route?.params?.serviceName || '';

  const [form, setForm] = useState({
    username: '',
    mobileno: '',
    address: '',
    landmark: '',
    post_date: '',
    start_time: '',
    end_time: '',
    serviceId: serviceId,
    serviceName: serviceName,
  });

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

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const {
      username,
      mobileno,
      address,
      landmark,
      serviceId,
      post_date,
      start_time,
      end_time,
    } = form;

    if (
      !username ||
      !mobileno ||
      !address ||
      !landmark ||
      !serviceId ||
      !post_date ||
      !start_time ||
      !end_time
    ) {
      showModal('All fields are required', 'warning');
      return;
    }

    try {
      setLoading(true);

      const body = new URLSearchParams();
      body.append('username', username);
      body.append('serviceid', serviceId);
      body.append('mobileno', mobileno);
      body.append('address', address);
      body.append('landmark', landmark);
      body.append('post_date', post_date);
      body.append('start_time', start_time);
      body.append('end_time', end_time);
      body.append('unique_id', '');
      body.append(
        'gcm_id',
        'cu4BMzQEqLo:APA91bENusFSumQlKyzy_pmxOybtNk2XvWS4rRodpTv1X4E3Fx3Wo1YCiF-iSUQqnLaiTWUtaWqfELX_os0CuaOSJ2TDRHMYXWevr-0y9HohF86pSEIchGBl5Y9I7HNATnNsjp3eks5S',
      );

      const response = await fetch(
        'https://patilhardware.com/MobileWeb/serviceRequestNew',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        },
      );

      const json = await response.json();
      console.log('SERVICE RESPONSE ===>', json);

      await AsyncStorage.setItem('userid', json?.userid?.toString() || '');
      await AsyncStorage.setItem('unique_id', json?.uniqueid?.toString() || '');

      setAfterCloseAction(() => () => navigation.navigate('Otp'));
      showModal('OTP sent on your WhatsApp', 'success');
    } catch (error) {
      console.log('Service Error:', error);
      showModal('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = date => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const formatTime = date => {
    const d = new Date(date);
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CommonHeader title="Patil Hardware" navigation={navigation} />

      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#8a8a8a"
              value={form.username}
              onChangeText={v => handleChange('username', v)}
            />

            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              keyboardType="number-pad"
              maxLength={10}
              value={form.mobileno}
              placeholderTextColor="#8a8a8a"
              onChangeText={v => handleChange('mobileno', v)}
            />

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDate(true)}
            >
              <Text style={{ color: form.post_date ? '#000' : '#999' }}>
                {form.post_date || 'Select Date'}
              </Text>
            </TouchableOpacity>

            {showDate && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDate(false);
                  if (selectedDate) {
                    handleChange('post_date', formatDate(selectedDate));
                  }
                }}
              />
            )}

            <Text style={styles.label}>Preferred Time</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.input, styles.timeInput]}
                onPress={() => setShowStartTime(true)}
              >
                <Text style={{ color: form.start_time ? '#000' : '#999' }}>
                  {form.start_time || 'Start Time'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.input, styles.timeInput]}
                onPress={() => setShowEndTime(true)}
              >
                <Text style={{ color: form.end_time ? '#000' : '#999' }}>
                  {form.end_time || 'End Time'}
                </Text>
              </TouchableOpacity>
            </View>

            {showStartTime && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowStartTime(false);
                  if (selectedTime) {
                    handleChange('start_time', formatTime(selectedTime));
                  }
                }}
              />
            )}

            {showEndTime && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowEndTime(false);
                  if (selectedTime) {
                    handleChange('end_time', formatTime(selectedTime));
                  }
                }}
              />
            )}

            <Text style={styles.label}>Service</Text>
            <TextInput
              style={styles.input}
              placeholder="Selected Service"
              placeholderTextColor="#8a8a8a"
              value={form.serviceName}
              editable={false}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={form.address}
              placeholderTextColor="#8a8a8a"
              onChangeText={v => handleChange('address', v)}
            />

            <Text style={styles.label}>Landmark</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter landmark"
              value={form.landmark}
              placeholderTextColor="#8a8a8a"
              onChangeText={v => handleChange('landmark', v)}
            />

            <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Submit</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FDFDFD',
//   },

//   overlay: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//   },

//   card: {
//     width: '95%',
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     padding: 16,
//     height: '100%',
//   },

//   label: {
//     fontSize: 13,
//     color: '#393939',
//     marginTop: 7,
//     marginBottom: 6,
//     fontWeight: '500',
//   },

//   input: {
//     backgroundColor: '#F9F9F9',
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     height: 44,
//     fontSize: 14,
//     color: '#000',
//     marginTop: 10,
//     borderColor: '#E8E8E8',
//     borderWidth: 1,
//     justifyContent: 'center',
//   },

//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//   },

//   timeInput: {
//     flex: 1,
//   },

//   btn: {
//     backgroundColor: '#F07C00',
//     height: 55,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 30,
//     marginBottom: 10,
//   },

//   btnText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//   },

//   divider: {
//     height: 1,
//     backgroundColor: '#EBEBEB',
//     width: '900',
//     marginLeft: -22,
//     marginTop: 13,
//   },
// });



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  overlay: {
    flex: 1,
    alignItems: 'center',
  },

  card: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginTop: 10,

    // 🔥 premium shadow
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },

  // 🔥 LABEL (Premium + brand color)
  label: {
    fontSize: 13,
    color: '#F07C00',
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // 🔥 INPUT (clean + modern)
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 14,
    color: '#000',

    borderWidth: 1.2,
    borderColor: '#E5E5E5',

    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  timeInput: {
    flex: 1,
  },

  // 🔥 BUTTON (premium)
  btn: {
    backgroundColor: '#F07C00',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,

    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },

  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  divider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    width: '100%',
    marginTop: 13,
  },
});