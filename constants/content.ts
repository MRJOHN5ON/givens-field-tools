export const brand = {
  name: 'Givens Fire & Forestry',
  tagline: 'Wildfire Defense & Forestry Services',
  location: 'Montana',
  ownerNote: 'Ex-wildland firefighter owned',
} as const;

export const contact = {
  phone: '406-539-4224',
  phoneRaw: '4065394224',
  siteUrl: 'https://www.givensfireandforestry.com',
  siteLabel: 'givensfireandforestry.com',
  privacyPolicyUrl: 'https://www.givensfireandforestry.com/field-tools-privacy',
} as const;

export const cta = {
  banner: 'Need this work done in Montana?',
  callToAction: 'Call us.',
} as const;

export const home = {
  title: 'Field Tools',
  tagline: 'Built for the backcountry.',
  toolsHeading: 'Select a Tool',
  privacyLabel: 'Privacy policy',
} as const;

export const tools = {
  cordCalculator: {
    id: 'cord-calculator',
    title: 'Cord Calculator',
    description: 'Estimate cords from felled log measurements. Frustum formula.',
    route: '/cord-calculator',
  },
  treeHeight: {
    id: 'tree-height',
    title: 'Tree Height',
    description: 'Five methods — angle, line-of-sight, shadow, clinometer, and triangulation.',
    route: '/tree-height',
  },
  wildfireRisk: {
    id: 'wildfire-risk',
    title: 'Wildfire Risk',
    description: 'Screen surface wildfire risk at your address using fuel maps, weather, and a Rothermel model.',
    route: '/wildfire-risk',
  },
} as const;

export const cordCalculator = {
  title: 'Cord Calculator',
  subtitle: 'Estimate cords from felled tree and log measurements.',
  dimensionsHeading: 'Log Measurements',
  bottomDiameterLabel: 'Bottom Diameter',
  topDiameterLabel: 'Top Diameter',
  heightLabel: 'Height',
  bottomDiameterHint: 'Diameter at the base of the log, in inches.',
  topDiameterHint: 'Diameter at the top of the log, in inches. Use 0 for a pointed top.',
  heightHint: 'Total length of the log, in feet.',
  speciesHeading: 'Wood Species',
  speciesHint: 'Optional — select a species to estimate BTU output.',
  noSpecies: 'No species selected',
  unitIn: 'in',
  unitFt: 'ft',
  resultLabel: 'Estimated Cords',
  cordsLabel: 'cords',
  volumeLabel: 'Volume',
  faceCordsLabel: 'Face Cords',
  btuLabel: 'Est. BTU Output',
  totalsHeading: 'All Logs Total',
  totalCordsLabel: 'Total Cords',
  totalFaceCordsLabel: 'Total Face Cords',
  totalBtuLabel: 'Total BTU',
  addLog: 'Add Log',
  removeLog: 'Remove Log',
  clearLog: 'Clear Measurements',
  resetAllLogs: 'Reset All Logs',
  resetAllConfirmTitle: 'Reset all logs?',
  resetAllConfirmMessage:
    'This deletes every log and clears all saved measurements. This cannot be undone.',
  resetAllConfirmAction: 'Reset',
  resetAllCancelAction: 'Cancel',
  logsHeading: 'Your Logs',
  logNameLabel: 'Name this log',
  logNamePlaceholder: 'e.g. Pine by driveway, Oak trunk',
  logNameHint: 'Type a custom name — it updates the tab label as you go.',
  guideHeading: 'Field Guide',
  note: 'Uses a frustum formula for tapered logs. Estimates only — consult a forester for timber sales.',
} as const;

export const treeHeight = {
  title: 'Tree Height',
  subtitle: 'Five field methods — standard and advanced — matching the Givens calculator.',
  instructions:
    'Pick a standard or advanced method, enter your measurements, and read the estimated height.',
  tierHeading: 'Method Category',
  tiers: {
    standard: 'Standard',
    advanced: 'Advanced',
  },
  methodHeading: 'Measurement Method',
  methods: {
    angle: 'Angle',
    lineOfSight: 'Line-of-Sight',
    shadow: 'Shadow',
    clinometer: 'Clinometer',
    triangulation: 'Triangulation',
  },
  distanceHeading: 'Standoff Distance',
  distanceLabel: 'Distance to base',
  distance2Label: 'Distance (position 2)',
  angleHeading: 'Sight Angle',
  angleLabel: 'Angle to treetop',
  angle2Label: 'Angle (position 2)',
  angleHint:
    'Use a clinometer app, inclinometer, or other angle tool — then enter the reading here.',
  eyeHeightLabel: 'Eye height',
  eyeHeightHint: 'Optional — adds your eye height above ground for better accuracy.',
  clinometerEyeHeightHint: 'Required — measure from the ground to your eye level.',
  lineOfSightHeading: 'Line-of-Sight Distance',
  lineOfSightLabel: 'Distance to treetop',
  lineOfSightHint: 'Measure the diagonal distance from you to the treetop.',
  triangulationHeading: 'Position 1',
  triangulationHeading2: 'Position 2',
  shadowHeading: 'Shadow Measurements',
  userHeightLabel: 'Your height',
  userShadowLabel: 'Your shadow',
  treeShadowLabel: 'Tree shadow',
  resultLabel: 'Estimated Height',
  alternateHeightLabel: 'Alternate Units',
  warningsLabel: 'Notes',
  guideHeading: 'Field Guide',
  methodGuideHeading: 'Method Instructions',
  feet: 'ft',
  meters: 'm',
} as const;

export const wildfireRisk = {
  title: 'Wildfire Risk Calculator',
  subtitle:
    'Screen surface wildfire risk at your property using official US fuel-layer maps, local weather, and a Rothermel spread model.',
  addressLabel: 'Property address',
  checkPropertyHeading: 'Check Your Property',
  addressHint: 'Enter your full street address with city and state.',
  addressPlaceholder: 'e.g. 123 Main St, Helena, MT',
  useMyLocation: 'Use my current location instead',
  locating: 'Getting location…',
  locationActiveHint: 'Using GPS at your current position — clear the address to type a different property.',
  advancedHeading: 'Adjust conditions (optional)',
  useCustomWeather: 'Use custom weather instead of live forecast',
  windLabel: 'Wind speed at 10 m height',
  windUnit: 'mph',
  humidityLabel: 'Relative humidity',
  humidityUnit: '%',
  tempLabel: 'Air temperature',
  tempUnit: '°F',
  calculate: 'Calculate fire risk',
  guideHeading: 'How it works',
  sourcesHeading: 'Data sources',
  disclaimer:
    'Educational screening tool only — not a substitute for professional wildfire mitigation assessment, defensible-space inspection, or official fire-danger ratings.',
  scoreBreakdown: 'Score breakdown',
  outlookHeading: '16-day fire weather outlook',
  peakDaysLabel: 'Highest-stress days in forecast',
  noPeakDays: 'No high-stress days flagged in the next 16 days.',
  outlookFine:
    'Outlook uses Open-Meteo forecast data and active NWS alerts when issued. 16 days is the practical free limit for daily forecasts.',
  siteNotePinSuffix:
    '— common for homes, driveways, and cleared areas in timber country.',
  seasonalHeading: 'Monthly & seasonal outlook',
  seasonalIntro:
    'Free forecast data stops at 16 days. For drought trends and longer-range fire-season signals, check NOAA official outlooks.',
  nonBurnableTitle: 'Non-burnable at this location',
  nonBurnableHint:
    'Federal fuel maps do not show burnable wildland fuels within ~500m of this pin. That can still happen in very open, agricultural, or lake-front areas.',
  pieTapHint: 'Tap a slice to learn more about each factor.',
} as const;
