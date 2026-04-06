import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CommonHeader from "../components/CommonHeader";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


export default function ServiceStatus() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);




  const getRequests = async () => {
    try {
      setLoading(true);

      const uniqueid = await AsyncStorage.getItem("unique_id");

      const body = new URLSearchParams();
      body.append("uniqueid", uniqueid);

      const res = await axios.post(
        "https://patilhardware.com/MobileWeb/userPreviousRequests",
        body.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (res.data?.re === "true") {
        setData(res.data.post || []);
      } else {
        setData([]);
      }
    } catch (e) {
      console.log("API ERROR:", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
  useCallback(() => {
    getRequests();
  }, [])
);


  const onRefresh = async () => {
    setRefreshing(true);
    await getRequests();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#F07C00" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>

      <CommonHeader
        title="Patil Hardware"
        navigation={navigation}
      />

      <View style={styles.topSection}>
        <Text style={styles.screenTitle}>Your Requests</Text>
        <Text style={styles.screenSubtitle}>
          Track and rate your service history
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.header}>
          {/* <Feather
            name="arrow-left"
            size={18}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Request Status</Text> */}
        </View>

        <FlatList
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item) => item.request_no.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Request Found</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.statusCard}>
              <View style={styles.row}>
                <Text style={styles.label}>Request No :</Text>
                <Text style={styles.value}>{item.request_no}</Text>
              </View>

              <Text style={styles.infoText}>Service: {item.title}</Text>
              <Text style={styles.infoText}>Date: {item.post_date}</Text>



              <View style={styles.bottomRow}>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Entypo
                      key={i}
                      name="star"
                      size={19}
                      color={
                        i <= Number(item.ratting)
                          ? "#F07C00"
                          : "#D9D9D9"
                      }
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.btn,
                    item.requst_status === "1" && styles.btnDisabled
                  ]}
                  disabled={item.requst_status === "1"}
                  onPress={() =>
                    navigation.navigate("RateService", {
                      requestId: item.request_no, // ✅ FIX
                      title: item.title,
                      serviceId: item.service_id,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.btnText,
                      item.requst_status === "1" && styles.btnTextDisabled
                    ]}
                  >
                    {item.requst_status === "0" ? "Rate Now" : "Completed"}
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
          )}
        />
      </View>



    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  // 🔥 TOP SECTION
  topSection: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },

  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  screenSubtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },

  // 🔥 CARD
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderColor: "#D3D3D3",
    borderWidth: 1,

  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },

  label: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
  },

  value: {
    fontSize: 13,
    color: "#000",
    marginLeft: 6,
    fontWeight: "600",
  },

  infoText: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },

  // 🔥 STATUS BADGE (NEW PREMIUM)
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2E7D32",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  stars: {
    flexDirection: "row",
  },

  // 🔥 BUTTON (better spacing)
  btn: {
    backgroundColor: "#F07C00",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 25,

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  btnDisabled: {
    backgroundColor: "#E0E0E0",
  },

  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  btnTextDisabled: {
    color: "#999",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
    fontSize: 14,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

