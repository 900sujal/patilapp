import React, { useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import VersionCheck from "react-native-version-check";

import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {

  const checkUpdate = async () => {
    try {
      const res = await VersionCheck?.needUpdate();

      if (res?.isNeeded) {
        Alert.alert(
          "Update Available 🚀",
          "New version available, please update your app",
          [
            {
              text: "Update",
              onPress: () => {
                Linking.openURL(res.storeUrl); // ✅ auto correct URL
              },
            },
          ]
        );
      }
    } catch (error) {
      console.log("Update check error:", error);
    }
  };

  useEffect(() => {
    checkUpdate();
  }, []);


  return <AppNavigator />;
}
