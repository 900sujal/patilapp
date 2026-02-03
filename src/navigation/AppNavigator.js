import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import TermsScreen from "../screens/TermsScreen";
import HomeScreen from "../screens/HomeScreen";
import ServiceRequest from "../screens/ServiceRequest";
import ServiceStatus from "../screens/ServiceStatus";
import RateService from "../screens/RateService";
import Notifications from "../screens/Notifications";
import Login from "../screens/Login";
import Otpverification from './../screens/Otpverification';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ServiceRequest" component={ServiceRequest} />
        <Stack.Screen name="ServiceStatus" component={ServiceStatus} />
        <Stack.Screen name="RateService" component={RateService} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Login" component={Login} />
         <Stack.Screen name="Otpverification" component={Otpverification} />
         
      </Stack.Navigator>
    </NavigationContainer>
  );
}
