import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Foundation from 'react-native-vector-icons/Foundation';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppModal from '../components/AppModal';

export default function RateService() {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [afterCloseAction, setAfterCloseAction] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();

  const requestId = route?.params?.requestId;

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

  const submitRating = async () => {
    if (rating === 0) {
      showModal('Please select rating', 'warning');
      return;
    }

    try {
      setLoading(true);

      const userid = await AsyncStorage.getItem('userid');
      const uniqueid = await AsyncStorage.getItem('unique_id');

      const body = new URLSearchParams();
      body.append('userid', userid);
      body.append('requestid', requestId);
      body.append('ratting', rating);
      body.append('user_uniqueid', uniqueid);

      const response = await axios.post(
        'https://patilhardware.com/MobileWeb/userRating',
        body.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (response.data?.re === 'true') {
        setAfterCloseAction(() => () => navigation.goBack());
        showModal('Thank you for rating!', 'success');
      } else {
        showModal('Rating failed', 'error');
      }
    } catch (error) {
      console.log(error);
      showModal('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Image
          source={require('../assets/images/rateiconlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Rate Your Service</Text>

        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(i => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <Foundation
                name="star"
                size={36}
                color={i <= rating ? '#F07C00' : '#DADADA'}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={submitRating}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Submit</Text>
          )}
        </TouchableOpacity>
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



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 35,
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
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },

  // 🔥 STAR ROW
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 35,
  },

  // (spacing controlled inline, safe for all devices)

  // 🔥 BUTTON
  btn: {
    backgroundColor: '#F07C00',
    width: '100%',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',

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
});



