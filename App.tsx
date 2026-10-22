/**
 * Astrology App
 *
 * Two screens:
 *   1. BirthDetailsScreen - the user enters birth details
 *   2. ChartScreen        - shows the astrology chart
 *
 * We switch between screens with a simple piece of state
 * (no navigation library needed).
 *
 * @format
 */

import { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BirthDetailsScreen from './src/screens/BirthDetailsScreen';
import ChartScreen from './src/screens/ChartScreen';
import { BirthDetails } from './src/types';

function App() {
  // null = show the form. Once filled in, show the chart.
  const [details, setDetails] = useState<BirthDetails | null>(null);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {details === null ? (
          <BirthDetailsScreen onSubmit={setDetails} />
        ) : (
          <ChartScreen details={details} onBack={() => setDetails(null)} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14142b',
  },
});

export default App;
