// The information the user types on the first screen.
export type BirthDetails = {
  name: string;
  day: number;
  month: number; // 1 = January ... 12 = December
  year: number;
  hour: number; // 0 - 23
  minute: number; // 0 - 59
  place: string;
};

// One planet's position in the chart.
export type PlanetPosition = {
  name: string; // e.g. "Sun"
  short: string; // e.g. "Su" (shown inside the chart boxes)
  longitude: number; // 0 - 360 degrees around the zodiac
  signIndex: number; // 0 = Aries ... 11 = Pisces
  degreeInSign: number; // 0 - 30
};
