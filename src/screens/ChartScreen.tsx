import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { BirthDetails } from '../types';
import { calculateChart, ZODIAC_SIGNS } from '../utils/astrology';

type Props = {
  details: BirthDetails;
  onBack: () => void;
};

// Short sign names shown around the wheel.
const SIGN_LABELS = ZODIAC_SIGNS.map(sign => sign.slice(0, 3));

// Size of the round planet badges, in pixels.
const PLANET_SIZE = 26;

export default function ChartScreen({ details, onBack }: Props) {
  const planets = calculateChart(details);
  const sun = planets[0]; // calculateChart always puts the Sun first

  // The wheel fills the screen width (minus padding), up to 400 pixels.
  const { width } = useWindowDimensions();
  const size = Math.min(width - 40, 400);
  const center = size / 2;

  const outerRadius = size / 2; // outside edge of the sign ring
  const innerRadius = size * 0.36; // inside edge of the sign ring
  const middleRadius = size * 0.13; // the small circle in the middle

  // Converts a zodiac longitude (0 - 360) into an x/y spot on the wheel.
  // 0° Aries is on the left and the signs go anticlockwise,
  // like a traditional Western chart wheel.
  function pointOnWheel(longitude: number, radius: number) {
    const angle = (longitude * Math.PI) / 180;
    return {
      x: center - radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  }

  // A circle View: a square with fully rounded corners, centred on the wheel.
  function circleStyle(radius: number) {
    return {
      width: radius * 2,
      height: radius * 2,
      borderRadius: radius,
      left: center - radius,
      top: center - radius,
    };
  }

  const date = `${details.day}/${details.month}/${details.year}`;
  const time = `${details.hour}:${String(details.minute).padStart(2, '0')}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{details.name}'s Chart</Text>
      <Text style={styles.info}>
        {date} at {time}
        {details.place ? ` · ${details.place}` : ''}
      </Text>
      <Text style={styles.sunSign}>
        Sun sign: {ZODIAC_SIGNS[sun.signIndex]}
      </Text>

      {/* The chart wheel */}
      <View style={[styles.wheel, { width: size, height: size }]}>
        {/* 1. Outer circle (the sign ring) */}
        <View
          style={[styles.circle, styles.outerCircle, circleStyle(outerRadius)]}
        />

        {/* 2. Lines between the signs. Each line goes across the whole
               circle, so 6 lines make 12 sections. */}
        {[0, 30, 60, 90, 120, 150].map(degrees => (
          <View
            key={degrees}
            style={[
              styles.dividerLine,
              {
                width: size,
                top: center,
                transform: [{ rotate: `${-degrees}deg` }],
              },
            ]}
          />
        ))}

        {/* 3. Inner circle. It covers the middle part of the lines. */}
        <View
          style={[styles.circle, styles.innerCircle, circleStyle(innerRadius)]}
        />

        {/* 4. Sign names, placed in the middle of each section */}
        {SIGN_LABELS.map((label, signIndex) => {
          const labelRadius = (outerRadius + innerRadius) / 2;
          const point = pointOnWheel(signIndex * 30 + 15, labelRadius);
          return (
            <Text
              key={label}
              style={[
                styles.signLabel,
                { left: point.x - 20, top: point.y - 9 },
                signIndex === sun.signIndex && styles.sunSignLabel,
              ]}
            >
              {label}
            </Text>
          );
        })}

        {/* 5. Small circle in the middle with the name */}
        <View
          style={[
            styles.circle,
            styles.middleCircle,
            circleStyle(middleRadius),
          ]}
        >
          <Text style={styles.centerText} numberOfLines={1}>
            {details.name}
          </Text>
        </View>

        {/* 6. Planets, placed at their exact position */}
        {planets.map((planet, index) => {
          // If earlier planets are close by, move this one inward
          // so the badges don't sit on top of each other.
          const closePlanets = planets.slice(0, index).filter(other => {
            const gap = Math.abs(other.longitude - planet.longitude);
            return Math.min(gap, 360 - gap) < 12;
          }).length;
          const radius = innerRadius - 20 - closePlanets * PLANET_SIZE;
          const point = pointOnWheel(planet.longitude, radius);

          return (
            <View
              key={planet.name}
              style={[
                styles.planet,
                {
                  left: point.x - PLANET_SIZE / 2,
                  top: point.y - PLANET_SIZE / 2,
                },
              ]}
            >
              <Text style={styles.planetText}>{planet.short}</Text>
            </View>
          );
        })}
      </View>

      {/* Table with exact positions */}
      <Text style={styles.sectionTitle}>Planet Positions</Text>
      {planets.map(p => (
        <View key={p.name} style={styles.tableRow}>
          <Text style={styles.tableCell}>{p.name}</Text>
          <Text style={styles.tableCell}>{ZODIAC_SIGNS[p.signIndex]}</Text>
          <Text style={styles.tableCell}>{p.degreeInSign.toFixed(1)}°</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  back: {
    color: '#b9a5ff',
    fontSize: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  info: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 4,
  },
  sunSign: {
    color: '#ffd166',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  wheel: {
    alignSelf: 'center',
  },
  // Every circle, line and label is placed with exact pixel positions.
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#8e6cff',
  },
  outerCircle: {
    backgroundColor: '#22223d',
  },
  innerCircle: {
    backgroundColor: '#14142b', // same as the screen background
  },
  middleCircle: {
    backgroundColor: '#22223d',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  dividerLine: {
    position: 'absolute',
    left: 0,
    height: 1,
    backgroundColor: '#8e6cff',
  },
  signLabel: {
    position: 'absolute',
    width: 40,
    height: 18,
    textAlign: 'center',
    color: '#bbb',
    fontSize: 13,
  },
  sunSignLabel: {
    color: '#ffd166',
    fontWeight: 'bold',
  },
  centerText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  planet: {
    position: 'absolute',
    width: PLANET_SIZE,
    height: PLANET_SIZE,
    borderRadius: PLANET_SIZE / 2,
    backgroundColor: '#8e6cff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planetText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tableCell: {
    flex: 1,
    color: '#ddd',
    fontSize: 15,
  },
});
