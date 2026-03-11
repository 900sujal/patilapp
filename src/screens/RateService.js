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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  illustration: {
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },

  starRow: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 12,
  },

  btn: {
    backgroundColor: '#F07C00',
    width: '110%',
    paddingVertical: 17,
    borderRadius: 50,
  },

  btnText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  logo: {
    width: '188',
    height: '198',
  },
});
