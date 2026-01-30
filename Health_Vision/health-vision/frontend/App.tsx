import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

import { AlertProvider } from './src/context/AlertContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AlertProvider>
        <RootNavigator />
      </AlertProvider>
    </SafeAreaProvider>
  );
}
