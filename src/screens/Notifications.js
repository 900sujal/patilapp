import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const DATA = [
  { id: "1", name: "V", color: "#F07C00", time: "1 min" },
  { id: "2", name: "R", color: "#7FFF00", time: "2 min" },
  { id: "3", name: "H", color: "#FF7675", time: "3 min" },
  { id: "4", name: "P", color: "#F39C12", time: "4 min" },
  { id: "5", name: "A", color: "#00B894", time: "6 min" },
  { id: "6", name: "H", color: "#2ECC71", time: "1 min" },
  { id: "7", name: "P", color: "#3498DB", time: "2 min" },
  { id: "8", name: "H", color: "#FF7675", time: "3 min" },
  { id: "9", name: "D", color: "#F39C12", time: "4 min" },
  { id: "10", name: "M", color: "#A52A2A", time: "6 min" },

];

export default function Notification() {
    const Divider = () => <View style={styles.divider} />;
     const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
     
      <View style={styles.header}>
        <Feather name="arrow-left" size={18} color="#000000"  onPress={() => navigation.navigate("Home")}/>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>
  <Divider />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: item.color }]}>
              <Text style={styles.avatarText}>{item.name}</Text>
            </View>

            <View style={styles.textBox}>
              <Text style={styles.msg}>
                Lorem Ipsum is simply dummy text of the printing and
                typesetting
              </Text>
            </View>

            <Text style={styles.time}>{item.time}</Text>
            
          </View>
          
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
    color: "#000000"
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  textBox: {
    flex: 1,
  },

  msg: {
    fontSize: 13,
    color: "#444",
  },

  time: {
    fontSize: 11,
    color: "#777",
    marginLeft: 6,
  },
   divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
     width: "900",
    marginLeft:-16
  },
});
