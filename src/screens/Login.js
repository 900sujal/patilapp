import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const navigation = useNavigation();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (mobile.length !== 10) {
      Alert.alert("Error", "Please enter valid 10 digit number");
      return;
    }

    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append("mobile_no", mobile);

      const response = await fetch(
        "https://patilhardware.com/MobileWeb/userLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const json = await response.json();
      console.log("LOGIN RESPONSE ===>", json);

      if (json?.status === "true") {
        Alert.alert("Success", "OTP sent on your WhatsApp");


        await AsyncStorage.setItem("mobile_no", mobile);
        await AsyncStorage.setItem("otp", json?.otp?.toString());

        navigation.navigate("Otpverification");
      } else {
        Alert.alert("Message", json?.msg || "Login failed");
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log("Login Error:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.card}>
        <Image
          source={require("../assets/images/patilapplogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Please enter your Number"
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
    </View>
  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  logo: {
    width: 150,
    height: 130,
    marginBottom: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 25,
  },

  input: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F3F3F3",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 25,
  },

  loginBtn: {
    backgroundColor: "#3F5E9A",
    width: 200,
    height: 50,
    borderRadius: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});