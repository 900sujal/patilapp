import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import colors from "../theme/colors";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

export default function TermsScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTerms = async () => {
    try {
      const response = await fetch(
        "https://patilhardware.com/MobileWeb/terms_condition"
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.log("Terms API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTerms();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Title */}
        <Text style={styles.title}>Terms & Conditions</Text>
        <View style={styles.divider} />

        {/* Scrollable Content */}
        <View style={styles.scrollContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.orange} />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <RenderHTML
                contentWidth={width}
                source={{ html: data?.post || "" }}
                tagsStyles={{
                  p: {
                    fontSize: 14,
                    color: "#444",
                    lineHeight: 22,
                    marginBottom: 10,
                  },
                  li: {
                    fontSize: 14,
                    color: "#444",
                    lineHeight: 22,
                    marginBottom: 8,
                  },
                  ul: {
                    paddingLeft: 18,
                  },
                }}
              />
            </ScrollView>
          )}
        </View>

        {/* Bottom Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Home")}
          style={styles.shadowWrapper}
        >
          <LinearGradient
            colors={["#F07C00", "#FF9A2A"]} // gradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 10,
  },

  scrollContainer: {
    flex: 1,
  },

  shadowWrapper: {
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 10,
  },

  btn: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});