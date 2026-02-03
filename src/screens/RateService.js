import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Foundation from "react-native-vector-icons/Foundation";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function RateService() {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();


  const requestId = route?.params?.requestId;

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select rating");
      return;
    }

    try {
      setLoading(true);

      const userid = await AsyncStorage.getItem("userid");
      const uniqueid = await AsyncStorage.getItem("unique_id");

      console.log("USERID:", userid);
      console.log("UNIQUE ID:", uniqueid);
      console.log("REQUEST ID:", requestId);
      console.log("RATING:", rating);

      const body = new URLSearchParams();
      body.append("userid", userid);
      body.append("requestid", requestId);
      body.append("ratting", rating);
      body.append("user_uniqueid", uniqueid);

      const response = await axios.post(
        "https://patilhardware.com/MobileWeb/userRating",
        body.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("RATING RESPONSE:", response.data);

      if (response.status === 200) {
        Alert.alert("Success", "Thank you for rating!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Rating failed");
      }
    } catch (error) {
      console.log("RATING ERROR:", error?.response || error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Image
          source={require("../assets/images/rateiconlogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Rate Your Service</Text>

        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <Foundation
                name="star"
                size={36}
                color={i <= rating ? "#F07C00" : "#DADADA"}
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
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  illustration: {
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },

  starRow: {
    flexDirection: "row",
    marginBottom: 40,
    gap: 12
  },

  btn: {
    backgroundColor: "#F07C00",
    width: "110%",
    paddingVertical: 17,
    borderRadius: 50,
  },

  btnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  logo: {
    width: "188",
    height: "198"
  },
});
