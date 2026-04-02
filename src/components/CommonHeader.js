import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function CommonHeader({ title, navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ================= CHECK LOGIN ================= */
  useFocusEffect(
    useCallback(() => {
      checkLogin();
    }, [])
  );

  const checkLogin = async () => {
    const id = await AsyncStorage.getItem("unique_id");
    setIsLoggedIn(!!id);
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("unique_id");
      setIsLoggedIn(false);
      setDrawerOpen(false);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: logout },
    ]);
  };

  const go = (screen) => {
    setDrawerOpen(false);
    navigation.navigate(screen);
  };

  const Divider = () => <View style={styles.divider} />;

  return (
    <>
      {/* STATUS BAR */}
      <StatusBar backgroundColor="#FDFDFD" barStyle="dark-content" />

      {/* HEADER (FIXED TOP SPACE) */}
      <SafeAreaView edges={["top"]} style={styles.safeHeader}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>

          <TouchableOpacity onPress={() => setDrawerOpen(true)}>
            <View style={styles.menuout}>
              <Feather name="align-center" size={22} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Divider />

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
          {/* HEADER */}
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>{title}</Text>

            <TouchableOpacity onPress={() => setDrawerOpen(false)}>
              <View style={styles.menuout}>
                <Feather name="x" size={22} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          <Divider />

          {/* HOME */}
          <TouchableOpacity style={styles.drawerItem} onPress={() => go("Home")}>
            <Foundation name="home" size={24} color="#F07C00" />
            <Text style={styles.drawerText}>Home</Text>
          </TouchableOpacity>

          {/* REQUEST STATUS */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() =>
              isLoggedIn ? go("ServiceStatus") : go("Login")
            }
          >
            <Feather name="repeat" size={18} color="#F07C00" />
            <Text style={styles.drawerText}>Request Status</Text>
          </TouchableOpacity>

          {/* NOTIFICATIONS */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => go("Notifications")}
          >
            <Ionicons name="notifications" size={24} color="#F07C00" />
            <Text style={styles.drawerText}>Notification</Text>
          </TouchableOpacity>

          {/* LOGIN / LOGOUT */}
          {isLoggedIn ? (
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={confirmLogout}
            >
              <Entypo name="log-out" size={24} color="#F07C00" />
              <Text style={styles.drawerText}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => go("Login")}
            >
              <Entypo name="login" size={24} color="#F07C00" />
              <Text style={styles.drawerText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeHeader: {
    backgroundColor: "#FDFDFD",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop:-46
  },

  header: {
    height: 89,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 21,

  },

  headerTitle: {
    flex: 1,
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
    marginTop:-6
  },

  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    width: "100%",
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
});