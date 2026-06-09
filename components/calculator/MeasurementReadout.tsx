import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { colors } from '@/constants/theme';
import { wood } from '@/constants/wood-theme';

export type ReadoutStat = {
  label: string;
  value: string;
};

type MeasurementReadoutProps = {
  label: string;
  value: string;
  unit?: string;
  stats?: ReadoutStat[];
  accent?: boolean;
  tone?: 'default' | 'wood';
};

export function MeasurementReadout({
  label,
  value,
  unit,
  stats = [],
  accent = true,
  tone = 'default',
}: MeasurementReadoutProps) {
  const isWood = tone === 'wood';

  return (
    <Animated.View
      entering={FadeInDown.duration(380).springify()}
      style={[styles.wrap, isWood && styles.wrapWood]}>
      <LinearGradient
        colors={
          isWood
            ? [...wood.readoutGradient]
            : ['rgba(14, 22, 14, 0.96)', 'rgba(10, 18, 10, 0.98)']
        }
        style={StyleSheet.absoluteFill}
      />
      {accent ? (
        <View style={[styles.accentBar, isWood && styles.accentBarWood]} />
      ) : isWood ? (
        <View style={styles.oakBar} />
      ) : null}
      <Text style={[styles.label, isWood && styles.labelWood]}>{label}</Text>
      <View style={styles.primaryRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      {stats.length > 0 ? (
        <View style={[styles.statsGrid, isWood && styles.statsGridWood]}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCell}>
              <Text style={[styles.statLabel, isWood && styles.statLabelWood]}>
                {stat.label}
              </Text>
              <Text style={[styles.statValue, isWood && styles.statValueWood]}>
                {stat.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(232, 83, 26, 0.28)',
    paddingHorizontal: ux.spacing.cardPadding,
    paddingTop: 20,
    paddingBottom: 18,
    marginBottom: ux.spacing.fieldGap,
  },
  wrapWood: {
    borderColor: wood.border,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.accent,
  },
  accentBarWood: {
    backgroundColor: wood.amber,
  },
  oakBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: wood.oak,
    opacity: 0.5,
  },
  label: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.readoutLabel,
    letterSpacing: 1.2,
    color: 'rgba(240, 237, 232, 0.6)',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.readoutValue,
    letterSpacing: -1.2,
    color: colors.accent,
    lineHeight: 56,
  },
  unit: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.readoutUnit,
    letterSpacing: 0.4,
    color: 'rgba(240, 237, 232, 0.75)',
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(240, 237, 232, 0.12)',
    gap: 12,
  },
  statCell: {
    minWidth: '45%',
    flexGrow: 1,
  },
  statLabel: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.statLabel,
    letterSpacing: 0.8,
    color: 'rgba(240, 237, 232, 0.55)',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  statValue: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.statValue,
    letterSpacing: -0.2,
    color: colors.text,
    lineHeight: 24,
  },
  labelWood: {
    color: wood.textMuted,
  },
  statsGridWood: {
    borderTopColor: wood.borderMuted,
  },
  statLabelWood: {
    color: wood.textSoft,
  },
  statValueWood: {
    color: wood.text,
  },
});
