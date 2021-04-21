import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './src/Screen/SplashScreen';
import LoginScreen from './src/Screen/LoginScreen';
import RegisterScreen from './src/Screen/RegisterScreen';
import DrawerNavigationRoutes from './src/Screen/DrawerNavigationRoutes';

const Stack = createStackNavigator ();

const Auth = () => {
  return (
    <Stack.Navigator initialRouteName = "LoginScreen">
      <Stack.Screen 
        name = "LoginScreen"
        component = {LoginScreen}
        options = {{headerShown: false}}/>
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "SplashScreen">
        <Stack.Screen
          name = "SplashScreen"
          component = {SplashScreen}
          options = {{headerShown: false}} />

        <Stack.Screen
          name = "Auth"
          component = {Auth}
          options = {{headerShown: false}} />

        <Stack.Screen 
          name = "DrawerNavigationRoutes"
          component = {DrawerNavigationRoutes}
          options = {{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
