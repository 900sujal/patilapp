// import React, { useEffect } from "react";
// import { View, Text, StyleSheet, Image } from "react-native";
// import colors from "../theme/colors";


// export default function SplashScreen({ navigation }) {
//   useEffect(() => {
//     setTimeout(() => navigation.replace("Terms"), 2500);
//   }, []);

//   return (
//     <View style={styles.container}>

//       <Image
//         source={require("../assets/images/patilapplogo.png")}
//         style={styles.logo}
//         resizeMode="contain"
//       />
//       <Text style={styles.headingtext}> Patil Hardware</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#21428A",
//     justifyContent: "center",
//     alignItems: "center",

//   },
//   logo: {
//     width: "188",
//     height: "172"
//   },

//   text: {
//     color: colors.white,
//     fontSize: 18,
//     marginTop: 10,
//   },
//   headingtext: {
//     textAlign: "center",
//     color: "#D9D9D9",
//     fontSize: 26,
//     fontWeight: 600,


//   }
// });


import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => navigation.replace("Terms"), 2500);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1A357A" barStyle="light-content" />

      {/* LOGO CONTAINER */}
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/images/patilapplogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* APP NAME */}
      <Text style={styles.heading}>Patil Hardware</Text>

      {/* TAGLINE */}
      <Text style={styles.subHeading}>
        Trusted Hardware Solutions
      </Text>

      {/* FOOTER */}
      <Text style={styles.footer}>Powered by Patil</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // 🔥 gradient feel without library
    backgroundColor: "#1A357A",
    justifyContent: "center",
    alignItems: "center",
  },

  logoWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },

  logo: {
    width: 90,
    height: 90,
  },

  heading: {
    marginTop: 25,
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  subHeading: {
    marginTop: 6,
    fontSize: 14,
    color: "#D0D6F9",
    letterSpacing: 0.3,
  },

  footer: {
    position: "absolute",
    bottom: 30,
    fontSize: 12,
    color: "#AAB4E0",
  },
});
