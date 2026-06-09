import { StyleSheet, Text, View } from 'react-native';
import {
  CloudSunIcon,
  GaugeHighIcon,
  LocationDotIcon,
  TreeIcon,
} from '@/components/wildfire-risk/WildfireFlowIcons';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { colors } from '@/constants/theme';

const STEPS = [
  {
    id: 'locate',
    title: 'Locate',
    body: 'We geocode your street address to a map coordinate. Rural US addresses use a Census fallback when OpenStreetMap does not have them on file.',
    Icon: LocationDotIcon,
  },
  {
    id: 'fuels',
    title: 'Fuels',
    body: 'Official US fuel-layer maps tell us what vegetation could burn, plus slope and canopy cover at that pin. If the pin lands on a driveway or clearing, we scan wildland fuels within ~500 m.',
    Icon: TreeIcon,
  },
  {
    id: 'weather',
    title: 'Weather',
    body: 'Current wind, humidity, and temperature feed the model. We also flag the highest-stress days in a free 16-day outlook and link NOAA seasonal drought pages.',
    Icon: CloudSunIcon,
  },
  {
    id: 'score',
    title: 'Score',
    body: 'A Rothermel surface spread model estimates how fast fire could move on the ground, then we convert that into a 0–100 risk score with Low through Extreme bands.',
    Icon: GaugeHighIcon,
  },
] as const;

export function WildfireFlowSteps() {
  return (
    <View style={styles.wrap}>
      {STEPS.map((step) => (
        <View key={step.id} style={styles.step}>
          <View style={styles.iconWrap}>
            <step.Icon size={17} color="#FFFFFF" />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.body}>{step.body}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
    paddingTop: 4,
    paddingBottom: 6,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(143, 169, 143, 0.08)',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    flexShrink: 0,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.accent,
    marginBottom: 4,
  },
  body: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: 'rgba(240, 237, 232, 0.68)',
  },
});
