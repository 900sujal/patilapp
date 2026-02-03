
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function VerifyOtp() {
  useEffect(() => {
    const checkStorage = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const mobile = await AsyncStorage.getItem("mobile_no");

      console.log("STORAGE KEYS:", keys);
      console.log("MOBILE FROM STORAGE:", mobile);
    };

    checkStorage();
  }, []);


  const navigation = useNavigation();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputs = useRef([]);

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

   
      const finalOtp = otp.join("");

      if (finalOtp.length !== 4) {
        Alert.alert("Error", "Please enter complete OTP");
        setLoading(false);
        return;
      }

      
      const mobile = await AsyncStorage.getItem("mobile_no");

      console.log("FINAL OTP:", finalOtp);
      console.log("MOBILE:", mobile);

    
      const body = new URLSearchParams();
      body.append("otp", finalOtp);
      body.append("mobile_no", mobile);

      console.log("SENDING BODY:", body.toString());

      const response = await axios.post(
        "https://patilhardware.com/MobileWeb/otpVerify",
        body.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("OTP RESPONSE:", response.data);


      if (response.status === 200) {

        Alert.alert("Success", "Login Successful");
        navigation.replace("ServiceStatus");
      } else {
        Alert.alert("Error", "Invalid OTP");
      }
    } catch (error) {
      console.log("OTP ERROR:", error?.response || error);
      Alert.alert("Error", "API call failed");
    } finally {
      setLoading(false);
    }
  };


  // const verifyOtp = async () => {
  //   try {
  //     setLoading(true);

  //     // ✅ OTP join
  //     const finalOtp = otp.join("");

  //     if (finalOtp.length !== 4) {
  //       Alert.alert("Error", "Please enter complete OTP");
  //       return;
  //     }

  //     // ✅ Mobile from storage
  //     const mobile = await AsyncStorage.getItem("mobile_no");

  //     console.log("FINAL OTP:", finalOtp);
  //     console.log("MOBILE:", mobile);

  //     // ✅ Form body (same as Postman)
  //     const body = new URLSearchParams();
  //     body.append("otp", finalOtp);
  //     body.append("mobile_no", mobile);

  //     console.log("SENDING BODY:", body.toString());

  //     // ✅ API CALL
  //     const response = await axios.post(
  //       "https://patilhardware.com/MobileWeb/otpVerify",
  //       body.toString(),
  //       {
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //       }
  //     );

  //     console.log("OTP RESPONSE:", response.data);

  //     // ✅ SUCCESS CHECK
  //     if (response.status === 200) {
  //       const userId = response.data?.data?.user_unique_id;

  //       await AsyncStorage.setItem("uniqueid", userId.toString());
  //       // await AsyncStorage.setItem("login_status", "true");

  //       Alert.alert("Success", "Login Successful");
  //       navigation.replace("ServiceStatus");
  //     } else {
  //       Alert.alert("Error", response.data?.msg || "Invalid OTP");
  //     }
  //   } catch (error) {
  //     console.log("OTP ERROR:", error?.response || error);
  //     Alert.alert("Error", "API call failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../assets/images/patilapplogo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>OTP</Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
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
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  logo: {
    width: "180",
    height: "170",
    resizeMode: "contain",
    marginBottom: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#000",
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 25,
  },

  otpInput: {
    width: 52,
    height: 52,
    borderRadius: 7,
    backgroundColor: "#F1F1F1",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "600",
    color: "#000",
    borderColor:"#999999",
    borderWidth:1,
  },

  btn: {
    backgroundColor: "#3F5E9A",
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
