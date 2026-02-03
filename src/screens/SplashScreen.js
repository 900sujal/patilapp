import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import colors from "../theme/colors";


export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => navigation.replace("Terms"), 2500);
  }, []);

  return (
    <View style={styles.container}>

      <Image
        source={require("../assets/images/patilapplogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.headingtext}> Patil Hardware</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#21428A",
    justifyContent: "center",
    alignItems: "center",

  },
  logo: {
    width: "188",
    height: "172"
  },

  text: {
    color: colors.white,
    fontSize: 18,
    marginTop: 10,
  },
  headingtext: {
    textAlign: "center",
    color: "#D9D9D9",
    fontSize: 26,
    fontWeight: 600,


  }
});
