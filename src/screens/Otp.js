import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AppModal from '../components/AppModal';

export default function Otp() {
    const navigation = useNavigation();

    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('success');
    const [afterCloseAction, setAfterCloseAction] = useState(null);

    const inputs = useRef([]);

    // 🔥 Modal Show
    const showModal = (message, type = 'success', action = null) => {
        setModalMessage(message);
        setModalType(type);
        setAfterCloseAction(() => action);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        if (afterCloseAction) {
            afterCloseAction();
            setAfterCloseAction(null);
        }
    };

    // 🔥 OTP Change + Auto Focus + Backspace
    const handleChange = (text, index) => {
        if (!/^\d*$/.test(text)) return; // only numbers

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 3) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    // 🔥 VERIFY OTP
    const verifyOtp = async () => {
        const finalOtp = otp.join('');

        if (finalOtp.length !== 4) {
            showModal('Please enter complete OTP', 'warning');
            return;
        }

        try {
            setLoading(true);

            const userid = await AsyncStorage.getItem('userid');

            if (!userid) {
                showModal('User not found. Please login again.', 'error');
                return;
            }

            const body = new URLSearchParams();
            body.append('otp', finalOtp);
            body.append('userid', userid);

            const response = await axios.post(
                'https://patilhardware.com/MobileWeb/otpVerify',
                body.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const json = response.data;
            console.log('OTP RESPONSE:', json);

            if (json?.re === 'true') {
                showModal('Login Successful', 'success', () =>
                    navigation.replace('ServiceStatus')
                );
            } else {
                showModal(json?.msg || 'Invalid OTP', 'error');
            }
        } catch (error) {
            console.log('OTP ERROR:', error?.response || error);
            showModal('Something went wrong. Try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    <Image
                        source={require('../assets/images/patilapplogo.png')}
                        style={styles.logo}
                    />

                    <Text style={styles.title}>Enter OTP</Text>

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
                                onKeyPress={e => handleKeyPress(e, index)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.btn} onPress={verifyOtp}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Verify OTP</Text>
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
        </KeyboardAvoidingView>
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
        elevation: 8,
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
    },

    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
        marginBottom: 30,
    },

    otpInput: {
        width: 55,
        height: 55,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '700',
        borderWidth: 1.5,
        borderColor: '#E5E5E5',
    },

    btn: {
        backgroundColor: '#F07C00',
        width: '100%',
        height: 52,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});