//homepage patilhardware
 import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Otpverification from './Otpverification';
import ServiceStatus from './ServiceStatus';
import Login from './Login';
 
export default function HomeScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const go = (screen) => {
    setDrawerOpen(false);
    navigation.navigate(screen);
  };
 
  const Divider = () => <View style={styles.divider} />; 
 
  const getServices = async () => {
    try {
      const response = await fetch(
        "https://patilhardware.com/MobileWeb/service" 
      );
      const json = await response.json();
      setServices(json?.post || []);
    } catch (error) {
      console.log("API Error:", error); 
    } finally {
      setLoading(false); 
    }
  };
 
  useEffect(() => {
    getServices();
  }, []);
 
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patil Hardware </Text>
 
        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <View style={styles.menuout}>
            <Feather name="align-center" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
 
      <Divider />
 
      {/* BODY */}
      <View style={styles.container}>
        <FlatList
          data={services}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("ServiceRequest", { id: item.id })
                }
              >
                <Image
                  source={{
                    uri: `https://patilhardware.com/adminassets/uplodes/service/${item.s_image}`,
                  }}
                  style={styles.image}
                />
              </TouchableOpacity>
 
              {/* TEXT OUTSIDE CARD */}
              <Text style={styles.cardText}>{item.title}</Text>
            </View>
          )}
        />
      </View>
 
      {/* DRAWER */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setDrawerOpen(false)}
        />
 
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Patil Hardware  </Text>
            <TouchableOpacity onPress={() => setDrawerOpen(false)}>
              <View style={styles.menuout}>
                <Feather name="x" size={22} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
 
          <Divider />
 
          <TouchableOpacity style={styles.drawerItem} onPress={() => go("Home")}>
            <Foundation name="home" size={24} color="#F07C00" />
            <Text style={styles.drawerText}>Home</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => go("Login")}
          >
            <View style={styles.requestStatus}>
              <Feather name="repeat" size={12} color="#000" />
            </View>
            <Text style={styles.drawerText}>Request Status</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => go("Notifications")}
          >
            <Ionicons name="notifications" size={24} color="#F07C00" />
            <Text style={styles.drawerText}>Notification</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => go("Login")}
          >
            <Entypo name="login" size={24} color="#F07C00" />
            <Text style={styles.drawerText}>Login</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDFDFD",
  },
 
  header: {
    height: 56,
    backgroundColor: "#FDFDFD",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
 
  headerTitle: {
    flex: 1,
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
  },
 
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FDFDFD",
  },
 
 
  itemWrapper: {
    flex: 1,
    alignItems: "center",
    marginVertical: 12,
  },
 
  card: {
    width: 160,
    height: 130,
    backgroundColor: "#EDEDED",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
 
  image: {
    width: 140,
    height: 130,
    resizeMode: "contain",
    borderRadius: 10,
  },
 
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
 
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
     width: "900",
    marginLeft:-16
  },
 
  menuout: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F07C00",
    justifyContent: "center",
    alignItems: "center",
  },
 
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
 
  drawer: {
    position: "absolute",
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#1F3C88",
    paddingTop: 40,
    paddingHorizontal: 18,
  },
 
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
 
  drawerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
 
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
 
  drawerText: {
    color: "#FFFFFF",
    fontSize: 15,
    marginLeft: 12,
    fontWeight: "500",
  },
 
  requestStatus: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F07C00",
    justifyContent: "center",
    alignItems: "center",
  },
});