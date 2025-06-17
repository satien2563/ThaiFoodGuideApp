import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './components/LoginScreen';
import RegionMenuScreen from './screens/RegionMenuScreen';

import './i18n'; // ← สำคัญ!
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RegionMenu" component={RegionMenuScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
}
