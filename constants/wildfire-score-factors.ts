import type { ImageSource } from 'expo-image';

export type WildfireScoreFactor = {
  id: 'spread' | 'flame' | 'slope' | 'weather';
  label: string;
  pct: number;
  color: string;
  start: number;
  end: number;
  image: ImageSource;
  imageAlt: string;
  blurb: string;
  text: string;
  takeaway: string;
};

export const WILDFIRE_SCORE_FACTORS: WildfireScoreFactor[] = [
  {
    id: 'spread',
    label: 'Spread rate',
    pct: 40,
    color: '#d45a2a',
    start: 0,
    end: 0.4,
    image: require('@/assets/images/wildfire-risk/score-spread-rate.jpeg'),
    imageAlt: 'Surface wildfire spreading across dry grass and shrubs',
    blurb: 'Ground speed of the fire front',
    text: 'How fast surface fire could move across the ground under current fuels, weather, and slope. We estimate this with the Rothermel surface spread model — the same family of formulas used in professional fire-behavior tools.',
    takeaway:
      'Faster spread gives firefighters less time to react and can cross driveways or setbacks before defenses are ready.',
  },
  {
    id: 'flame',
    label: 'Flame length',
    pct: 30,
    color: '#e8a030',
    start: 0.4,
    end: 0.7,
    image: require('@/assets/images/wildfire-risk/score-flame-length.png'),
    imageAlt: 'Wildland firefighters near flames in forest fuels',
    blurb: 'Height of flames at the leading edge',
    text: 'Estimated flame length comes from fire intensity given your fuel model and conditions. It is a practical read on how hard the fire is to work near on the ground.',
    takeaway:
      'Taller flames preheat trees and structures, throw embers farther, and often mean you need wider defensible space — not just a quick rake pass.',
  },
  {
    id: 'slope',
    label: 'Slope',
    pct: 20,
    color: '#58a07a',
    start: 0.7,
    end: 0.9,
    image: require('@/assets/images/wildfire-risk/score-slope.png'),
    imageAlt: 'Hillside home above timber with sloped terrain',
    blurb: 'Steepness of terrain at your pin',
    text: 'Fire accelerates uphill because slopes preheat fuels above the flame front. We read slope from the same federal fuel-layer maps that define your vegetation type.',
    takeaway:
      'A home on a moderate hillside above timber can score higher than a flat lawn nearby — even when the address is only a few hundred yards away.',
  },
  {
    id: 'weather',
    label: 'Weather stress',
    pct: 10,
    color: '#4a8fd4',
    start: 0.9,
    end: 1,
    image: require('@/assets/images/wildfire-risk/score-weather.png'),
    imageAlt: 'Dry windy afternoon over western rangeland',
    blurb: 'Wind and humidity right now',
    text: 'A smaller slice based on live wind and relative humidity. Dry, breezy afternoons nudge the score up; calm, humid weather pulls it down.',
    takeaway:
      'Weather can change your score day to day. Fuels and slope set the baseline — weather is the accelerator when things get extreme.',
  },
];
