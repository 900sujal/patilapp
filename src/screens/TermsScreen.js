import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import colors from "../theme/colors";
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
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>

          <Text style={styles.title}>Term & Conditions</Text>


          <View style={styles.divider} />


          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Loading...
              </Text>
            ) : (
              <RenderHTML
                contentWidth={width}
                source={{ html: data?.post || "" }}
                tagsStyles={{
                  li: {
                    fontSize: 12,
                    color: "#393939",
                    lineHeight: 20,
                    marginBottom: 8,
                  },
                  ul: {
                    paddingLeft: 20,
                  },
                }}
              />
            )}
          </ScrollView>


          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,



    width: "100%"
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
    marginTop: 6,
    marginRight: 10,
  },

  text: {
    flex: 1,
    fontSize: 12,
    color: "#393939",
    lineHeight: 20,
  },

  btn: {
    backgroundColor: "#F07C00",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
