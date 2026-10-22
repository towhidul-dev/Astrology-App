import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BirthDetails } from '../types';

type Props = {
  onSubmit: (details: BirthDetails) => void;
};

export default function BirthDetailsScreen({ onSubmit }: Props) {
  // Each input box has its own piece of state.
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [place, setPlace] = useState('');

  function handleSubmit() {
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    const h = Number(hour);
    const min = Number(minute);

    // Basic checks so we don't calculate with bad numbers.
    if (name.trim() === '') {
      Alert.alert('Missing name', 'Please enter your name.');
      return;
    }
    if (
      !(d >= 1 && d <= 31) ||
      !(m >= 1 && m <= 12) ||
      !(y >= 1900 && y <= 2100)
    ) {
      Alert.alert('Invalid date', 'Please enter a valid day, month and year.');
      return;
    }
    if (
      hour === '' ||
      minute === '' ||
      !(h >= 0 && h <= 23) ||
      !(min >= 0 && min <= 59)
    ) {
      Alert.alert('Invalid time', 'Hour must be 0-23 and minute 0-59.');
      return;
    }

    onSubmit({
      name: name.trim(),
      day: d,
      month: m,
      year: y,
      hour: h,
      minute: min,
      place: place.trim(),
    });
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>✨ Birth Details</Text>
      <Text style={styles.subtitle}>Enter your details to see your chart</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="DD"
          placeholderTextColor="#888"
          keyboardType="number-pad"
          maxLength={2}
          value={day}
          onChangeText={setDay}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="MM"
          placeholderTextColor="#888"
          keyboardType="number-pad"
          maxLength={2}
          value={month}
          onChangeText={setMonth}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="YYYY"
          placeholderTextColor="#888"
          keyboardType="number-pad"
          maxLength={4}
          value={year}
          onChangeText={setYear}
        />
      </View>

      <Text style={styles.label}>Time of Birth (24-hour)</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Hour (0-23)"
          placeholderTextColor="#888"
          keyboardType="number-pad"
          maxLength={2}
          value={hour}
          onChangeText={setHour}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Minute"
          placeholderTextColor="#888"
          keyboardType="number-pad"
          maxLength={2}
          value={minute}
          onChangeText={setMinute}
        />
      </View>

      <Text style={styles.label}>Place of Birth</Text>
      <TextInput
        style={styles.input}
        placeholder="City, Country"
        placeholderTextColor="#888"
        value={place}
        onChangeText={setPlace}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Show My Chart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    color: '#ddd',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#2a2a4a',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  smallInput: {
    flex: 1,
  },
  button: {
    backgroundColor: '#8e6cff',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
