import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonHeader from "../components/CommonHeader";

export default function ServiceRequest() {
  const navigation = useNavigation();
  const route = useRoute();
  const [showDate, setShowDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);



  const serviceId = route?.params?.id;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    mobileno: "",
    address: "",
    landmark: "",
    post_date: "",
    start_time: "",
    end_time: "",
    serviceId: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
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
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      setLoading(true);

      const body = new URLSearchParams();
      body.append("username", username);
      body.append("serviceid", serviceId);
      body.append("mobileno", mobileno);
      body.append("address", address);
      body.append("landmark", landmark);
      body.append("post_date", post_date);
      body.append("start_time", start_time);
      body.append("end_time", end_time);
      body.append("unique_id", "");
      body.append(
        "gcm_id",
        "cu4BMzQEqLo:APA91bENusFSumQlKyzy_pmxOybtNk2XvWS4rRodpTv1X4E3Fx3Wo1YCiF-iSUQqnLaiTWUtaWqfELX_os0CuaOSJ2TDRHMYXWevr-0y9HohF86pSEIchGBl5Y9I7HNATnNsjp3eks5S"
      );

      const response = await fetch(
        "https://patilhardware.com/MobileWeb/serviceRequestNew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        }
      );

      const json = await response.json();
      console.log("SERVICE RESPONSE ===>", json);

      Alert.alert("Success", "OTP sent on your WhatsApp");

      await AsyncStorage.setItem("userid", json?.userid?.toString());
      await AsyncStorage.setItem("unique_id", json?.uniqueid?.toString());

      navigation.navigate("Otp");
    } catch (error) {
      console.log("Service Error:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };


  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <CommonHeader
        title="Patil Hardware"
        navigation={navigation}
      />

      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* HEADER */}
          {/* <View style={styles.header}>
            <Feather
              name="arrow-left"
              size={18}
              color="#000"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.headerTitle}>Service Request Form</Text>
          </View>

          <View style={styles.divider} /> */}

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={form.username}
              onChangeText={(v) => handleChange("username", v)}
            />

            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              keyboardType="number-pad"
              maxLength={10}
              value={form.mobileno}
              onChangeText={(v) => handleChange("mobileno", v)}
            />

            <Text style={styles.label}>Date</Text>

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDate(true)}
            >
              <Text style={{ color: form.post_date ? "#000" : "#999" }}>
                {form.post_date || "Select Date"}
              </Text>
            </TouchableOpacity>

            {showDate && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowDate(false);
                  if (selectedDate) {
                    handleChange("post_date", formatDate(selectedDate));
                  }
                }}
              />
            )}

            <Text style={styles.label}>Preferred Time</Text>

            <View style={styles.row}>

              <TouchableOpacity
                style={[styles.input, { flex: 1 }]}
                onPress={() => setShowStartTime(true)}
              >
                <Text style={{ color: form.start_time ? "#000" : "#999" }}>
                  {form.start_time || "Start Time"}
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={[styles.input, { flex: 1 }]}
                onPress={() => setShowEndTime(true)}
              >
                <Text style={{ color: form.end_time ? "#000" : "#999" }}>
                  {form.end_time || "End Time"}
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
                    handleChange("start_time", formatTime(selectedTime));
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
                    handleChange("end_time", formatTime(selectedTime));
                  }
                }}
              />
            )}


            <Text style={styles.label}>Service</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Serivce"
              value={form.serviceId}
              onChangeText={(v) => handleChange("serceIdvId", v)}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={form.address}
              onChangeText={(v) => handleChange("address", v)}
            />

            <Text style={styles.label}>Landmark</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter landmark"
              value={form.landmark}
              onChangeText={(v) => handleChange("landmark", v)}
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
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  overlay: {

    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FDFDFD",
  },

  card: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    Height: "100%",



  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,

  },

  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
    color: "#000000",
  },

  label: {
    fontSize: 13,
    color: "#393939",
    marginTop: 7,
    marginBottom: 6,
    fontWeight: 500
  },

  input: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 44,
    fontSize: 14,
    color: "black",
    marginTop: 10,
    borderColor: "#E8E8E8",
    borderWidth: 1,

  },

  iconInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 44,
    gap: 10
  },

  flexInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  btn: {
    backgroundColor: "#F07C00",
    height: 55,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    width: "900",
    marginLeft: -22,
    marginTop: 13
  },
});
