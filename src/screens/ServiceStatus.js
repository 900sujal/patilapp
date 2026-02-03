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
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


export default function ServiceStatus() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
const [drawerOpen, setDrawerOpen] = useState(false);

 const go = (screen) => {
    setDrawerOpen(false);
    navigation.navigate(screen);
  };

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


  useEffect(() => {
    getRequests();
  }, []);


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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patil Hardware </Text>

        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <View style={styles.menuout}>
            <Feather name="align-center" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Feather
            name="arrow-left"
            size={18}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Request Status</Text>
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

              <Text>Service Name - {item.title}</Text>
              <Text>Date - {item.post_date}</Text>

              <View style={styles.bottomRow}>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Feather
                      key={i}
                      name="star"
                      size={14}
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
                      requestNo: item.request_no,
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
    backgroundColor: "#FFFFFF",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 14,
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
    color: "#000",
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderColor: "#E8E8E8",
    borderWidth: 1,
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 100,
    fontSize: 13,
    color: "#555",
  },
  value: {
    fontSize: 13,
    color: "#000",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  stars: {
    flexDirection: "row",
    gap: 6,
  },
  btn: {
    backgroundColor: "#F07C00",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnDisabled: {
    backgroundColor: "#E0E0E0",
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  btnTextDisabled: {
    color: "#999",
  },
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginVertical: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});