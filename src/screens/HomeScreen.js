//homepage patilhardware
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CommonHeader from "../components/CommonHeader";

export default function HomeScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);



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
      <CommonHeader
        title="Patil Hardware"
        navigation={navigation}
      />

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
    marginLeft: -16
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