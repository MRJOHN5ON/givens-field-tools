import { StyleSheet, Text, View } from 'react-native';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { colors } from '@/constants/theme';
import {
  riskAccentColor,
  riskBackgroundColor,
  riskBorderColor,
} from '@/lib/plant-identifier/theme';
import type { ProcessedMatch } from '@/lib/plant-identifier/types';

type PlantResultCardProps = {
  match: ProcessedMatch;
};

export function PlantResultCard({ match }: PlantResultCardProps) {
  const isBest = match.rank === 1;

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: riskBorderColor(match.risk),
          backgroundColor: riskBackgroundColor(match.risk),
        },
      ]}>
      <View style={styles.header}>
        <View style={styles.meta}>
          <Text style={styles.rank}>
            #{match.rank}
            {isBest ? ' Best match' : ''}
          </Text>
          <View style={[styles.badge, { borderColor: riskAccentColor(match.risk) }]}>
            <Text style={[styles.badgeText, { color: riskAccentColor(match.risk) }]}>
              {match.riskLabel}
            </Text>
          </View>
        </View>
        <Text style={styles.common}>{match.commonName}</Text>
        <Text style={styles.sci}>{match.scientificName}</Text>
      </View>

      <View style={styles.confidence}>
        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceLabel}>Match confidence</Text>
          <Text style={styles.confidenceValue}>{match.confidence}%</Text>
        </View>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${match.confidence}%`, backgroundColor: riskAccentColor(match.risk) },
            ]}
          />
        </View>
      </View>

      <Text style={styles.note}>{match.note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  rank: {
    fontFamily: 'Oswald-Bold',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: 'Oswald-Bold',
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  common: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.guideTitle,
    color: colors.text,
    marginBottom: 2,
  },
  sci: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    fontStyle: 'italic',
    color: 'rgba(240, 237, 232, 0.65)',
  },
  confidence: {
    marginBottom: 12,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  confidenceLabel: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    color: colors.textMuted,
  },
  confidenceValue: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    color: colors.text,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(240, 237, 232, 0.12)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  note: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: 'rgba(240, 237, 232, 0.78)',
  },
});
