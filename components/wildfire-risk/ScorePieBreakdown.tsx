import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import {
  WILDFIRE_SCORE_FACTORS,
  type WildfireScoreFactor,
} from '@/constants/wildfire-score-factors';
import { wildfireRisk as copy } from '@/constants/content';
import { colors } from '@/constants/theme';

function pieSlicePath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startRatio: number,
  endRatio: number,
) {
  const start = startRatio * 360;
  const end = endRatio * 360;
  const large = end - start > 180 ? 1 : 0;

  const polar = (r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const p1 = polar(rOuter, start);
  const p2 = polar(rOuter, end);
  const p3 = polar(rInner, end);
  const p4 = polar(rInner, start);

  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
}

function FactorCard({ factor }: { factor: WildfireScoreFactor }) {
  return (
    <View style={styles.factorCard}>
      <Image
        source={factor.image}
        style={styles.factorImage}
        contentFit="cover"
        accessibilityLabel={factor.imageAlt}
      />
      <View style={styles.factorCopy}>
        <Text style={[styles.factorTitle, { color: factor.color }]}>
          {factor.label} · {factor.pct}%
        </Text>
        <Text style={styles.factorBlurb}>{factor.blurb}</Text>
        <Text style={styles.factorText}>{factor.text}</Text>
        <Text style={styles.factorTakeaway}>
          <Text style={styles.factorTakeawayLabel}>Why it matters: </Text>
          {factor.takeaway}
        </Text>
      </View>
    </View>
  );
}

export function ScorePieBreakdown() {
  const [activeId, setActiveId] = useState<WildfireScoreFactor['id']>(
    WILDFIRE_SCORE_FACTORS[0].id,
  );

  const activeFactor =
    WILDFIRE_SCORE_FACTORS.find((factor) => factor.id === activeId) ??
    WILDFIRE_SCORE_FACTORS[0];

  return (
    <View style={styles.wrap}>
      <FactorCard factor={activeFactor} />

      <Text style={styles.pieHint}>{copy.pieTapHint}</Text>

      <View style={styles.piePanel}>
        <Svg width={180} height={180} viewBox="0 0 100 100" accessibilityLabel="Score weight breakdown">
          {WILDFIRE_SCORE_FACTORS.map((factor) => {
            const isActive = factor.id === activeId;
            return (
              <Path
                key={factor.id}
                d={pieSlicePath(50, 50, 42, 26, factor.start, factor.end)}
                fill={factor.color}
                opacity={isActive ? 1 : 0.82}
                stroke={isActive ? '#F0EDE8' : 'transparent'}
                strokeWidth={isActive ? 1.5 : 0}
                onPress={() => setActiveId(factor.id)}
              />
            );
          })}
        </Svg>

        <View style={styles.legend}>
          {WILDFIRE_SCORE_FACTORS.map((factor) => {
            const isActive = factor.id === activeId;
            return (
              <Pressable
                key={factor.id}
                onPress={() => setActiveId(factor.id)}
                style={[styles.legendItem, isActive && styles.legendItemActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}>
                <View style={[styles.swatch, { backgroundColor: factor.color }]} />
                <Text style={[styles.legendLabel, isActive && styles.legendLabelActive]}>
                  {factor.label}
                </Text>
                <Text style={[styles.legendPct, { color: factor.color }]}>{factor.pct}%</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 4,
    paddingBottom: 6,
  },
  pieHint: {
    fontFamily: 'Oswald-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(240, 237, 232, 0.5)',
    textAlign: 'center',
    marginBottom: 10,
  },
  factorCard: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(8, 14, 8, 0.45)',
    marginBottom: 16,
  },
  factorImage: {
    width: '100%',
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  factorCopy: {
    padding: 14,
  },
  factorTitle: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.body,
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  factorBlurb: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    color: colors.text,
    marginBottom: 8,
  },
  factorText: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: 'rgba(240, 237, 232, 0.72)',
    marginBottom: 10,
  },
  factorTakeaway: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: 'rgba(240, 237, 232, 0.65)',
  },
  factorTakeawayLabel: {
    fontFamily: 'Oswald-Bold',
    color: colors.accent,
  },
  piePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  legend: {
    flex: 1,
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  legendItemActive: {
    backgroundColor: 'rgba(240, 237, 232, 0.06)',
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  legendLabel: {
    flex: 1,
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    color: colors.textMuted,
  },
  legendLabelActive: {
    fontFamily: 'Oswald-Bold',
    color: colors.text,
  },
  legendPct: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.caption,
  },
});
