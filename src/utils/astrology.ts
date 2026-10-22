import { BirthDetails, PlanetPosition } from '../types';

export const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

// 0 = Western (tropical) zodiac.
// Change to 24 for the Vedic (sidereal / Lahiri) zodiac.
const AYANAMSA = 0;

// Simple orbit data for each planet (circular orbits around the Sun).
// startLongitude: where the planet was on 1 Jan 2000 (degrees)
// speed: how many degrees it moves per day
// distance: distance from the Sun in AU (Earth = 1)
const PLANETS = [
  {
    name: 'Mercury',
    short: 'Me',
    startLongitude: 252.25,
    speed: 4.09233445,
    distance: 0.387,
  },
  {
    name: 'Venus',
    short: 'Ve',
    startLongitude: 181.98,
    speed: 1.60213034,
    distance: 0.723,
  },
  {
    name: 'Mars',
    short: 'Ma',
    startLongitude: 355.45,
    speed: 0.5240384,
    distance: 1.524,
  },
  {
    name: 'Jupiter',
    short: 'Ju',
    startLongitude: 34.4,
    speed: 0.08308529,
    distance: 5.203,
  },
  {
    name: 'Saturn',
    short: 'Sa',
    startLongitude: 49.94,
    speed: 0.03344414,
    distance: 9.537,
  },
];

// Keeps an angle between 0 and 360.
function normalize(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

// Number of days between the birth moment and 1 Jan 2000, 12:00 UTC.
function daysSince2000(details: BirthDetails): number {
  // new Date(...) uses the phone's time zone for the birth time.
  const birth = new Date(
    details.year,
    details.month - 1,
    details.day,
    details.hour,
    details.minute,
  );
  const start2000 = Date.UTC(2000, 0, 1, 12, 0);
  return (birth.getTime() - start2000) / (1000 * 60 * 60 * 24);
}

function sunLongitude(days: number): number {
  const meanLongitude = 280.459 + 0.98564736 * days;
  const meanAnomaly = toRadians(357.529 + 0.98560028 * days);
  return normalize(
    meanLongitude +
      1.915 * Math.sin(meanAnomaly) +
      0.02 * Math.sin(2 * meanAnomaly),
  );
}

function moonLongitude(days: number): number {
  const meanLongitude = 218.316 + 13.176396 * days;
  const meanAnomaly = toRadians(134.963 + 13.064993 * days);
  return normalize(meanLongitude + 6.289 * Math.sin(meanAnomaly));
}

// Where a planet appears in the sky as seen from Earth.
function planetLongitude(
  planet: (typeof PLANETS)[number],
  days: number,
  earthLongitude: number,
): number {
  const angle = toRadians(planet.startLongitude + planet.speed * days);
  const earthAngle = toRadians(earthLongitude);

  // Position of the planet minus position of the Earth.
  const x = planet.distance * Math.cos(angle) - Math.cos(earthAngle);
  const y = planet.distance * Math.sin(angle) - Math.sin(earthAngle);

  return normalize(toDegrees(Math.atan2(y, x)));
}

function makePosition(
  name: string,
  short: string,
  tropicalLongitude: number,
): PlanetPosition {
  const longitude = normalize(tropicalLongitude - AYANAMSA);
  return {
    name,
    short,
    longitude,
    signIndex: Math.floor(longitude / 30),
    degreeInSign: longitude % 30,
  };
}

// Main function: turns birth details into a list of planet positions.
// Note: these are simple approximations (usually within a few degrees),
// good for learning, not for professional astrology.
export function calculateChart(details: BirthDetails): PlanetPosition[] {
  const days = daysSince2000(details);
  const sun = sunLongitude(days);
  const earth = normalize(sun + 180); // Earth is opposite the Sun

  const positions = [
    makePosition('Sun', 'Su', sun),
    makePosition('Moon', 'Mo', moonLongitude(days)),
  ];

  PLANETS.forEach(planet => {
    positions.push(
      makePosition(
        planet.name,
        planet.short,
        planetLongitude(planet, days, earth),
      ),
    );
  });

  return positions;
}
