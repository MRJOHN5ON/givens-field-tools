import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { wildfireRisk as copy } from '@/constants/content';
import {
  report,
  reportBandBorder,
  reportBandGauge,
  reportBandPill,
  reportMetricSurface,
  reportSeverityColor,
  reportSubscoreFill,
} from '@/constants/wildfire-results-theme';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { NOAA_SEASONAL_LINKS } from '@/lib/wildfire-risk/config';
import { parseFuelCode } from '@/lib/wildfire-risk/fuel-models';
import { fmtNum, formatElevationFeet, formatShortDate } from '@/lib/wildfire-risk/format';
import {
  flameSeverity,
  moistureSeverity,
  rhSeverity,
  scoreToSeverity,
  slopeSeverity,
  spreadSeverity,
  tempSeverity,
  windSeverity,
} from '@/lib/wildfire-risk/severity';
import type { RiskBand, SeverityLevel, WildfireRiskResult } from '@/lib/wildfire-risk/types';

type RiskResultsProps = {
  result: WildfireRiskResult;
};

function openUrl(url: string) {
  Linking.openURL(url).catch(() => {});
}

function ReportCollapsible({
  title,
  defaultExpanded = false,
  children,
}: {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View>
      <Pressable
        onPress={() => setExpanded((current) => !current)}
        style={styles.reportCollapseHeader}
        accessibilityRole="button"
        accessibilityState={{ expanded }}>
        <Text style={styles.reportCollapseTitle}>{title}</Text>
        <Text style={styles.reportCollapseChevron}>{expanded ? '−' : '+'}</Text>
      </Pressable>
      {expanded ? <View style={styles.reportCollapseBody}>{children}</View> : null}
    </View>
  );
}

function MetricItem({
  label,
  value,
  level,
}: {
  label: string;
  value: string;
  level: SeverityLevel;
}) {
  const surface = reportMetricSurface(level);
  return (
    <View style={[styles.metricItem, surface]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color: reportSeverityColor(level) }]}>{value}</Text>
    </View>
  );
}

function FuelBadge({
  code,
  variant = 'default',
}: {
  code: string;
  variant?: 'default' | 'hero' | 'chip' | 'pin';
}) {
  const parsed = parseFuelCode(code);
  if (!parsed.prefix) {
    return <Text style={styles.fuelBadgePlain}>{code}</Text>;
  }

  return (
    <View
      style={[
        styles.fuelBadge,
        variant === 'hero' && styles.fuelBadgeHero,
        variant === 'chip' && styles.fuelBadgeChip,
        variant === 'pin' && styles.fuelBadgePin,
      ]}>
      <Text
        style={[
          styles.fuelBadgeGroup,
          variant === 'hero' && styles.fuelBadgeGroupHero,
          (variant === 'chip' || variant === 'pin') && styles.fuelBadgeGroupSmall,
        ]}>
        {parsed.prefix}
      </Text>
      <Text
        style={[
          styles.fuelBadgeLevel,
          variant === 'hero' && styles.fuelBadgeLevelHero,
          (variant === 'chip' || variant === 'pin') && styles.fuelBadgeLevelSmall,
        ]}>
        {parsed.level}
      </Text>
    </View>
  );
}

function ScoreGauge({ score, band }: { score: number; band: RiskBand }) {
  const arcLength = Math.PI * 48;
  const offset = arcLength * (1 - score / 100);
  const color = reportBandGauge[band];

  return (
    <View style={styles.gaugeWrap}>
      <Svg width={120} height={68} viewBox="0 0 120 68">
        <Path
          d="M12 58 A48 48 0 0 1 108 58"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <Path
          d="M12 58 A48 48 0 0 1 108 58"
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${arcLength}`}
          strokeDashoffset={offset}
        />
      </Svg>
      <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
    </View>
  );
}

function ScoreHero({
  risk,
  weatherSource,
}: {
  risk: NonNullable<WildfireRiskResult['risk']>;
  weatherSource: string;
}) {
  const pill = reportBandPill[risk.band];

  return (
    <View style={styles.scoreHero}>
      <View style={styles.scoreHeroMeter}>
        <ScoreGauge score={risk.score} band={risk.band} />
      </View>
      <View style={styles.scoreHeroMeta}>
        <Text style={[styles.bandPill, { backgroundColor: pill.bg, color: pill.text }]}>
          {risk.band} risk
        </Text>
        <Text style={styles.weatherSource}>{weatherSource}</Text>
      </View>
    </View>
  );
}

function KeyMetrics({ fire }: { fire: WildfireRiskResult['fire'] }) {
  return (
    <View style={styles.metricsHero}>
      <MetricItem
        label="Spread rate"
        value={`${fmtNum(fire.spreadChainsPerHr, 1)} ch/hr`}
        level={spreadSeverity(fire.spreadChainsPerHr)}
      />
      <MetricItem
        label="Flame length"
        value={`${fmtNum(fire.flameLengthFt, 1)} ft`}
        level={flameSeverity(fire.flameLengthFt)}
      />
      <MetricItem label="Fuel model" value={fire.fuelCode} level="neutral" />
      <MetricItem
        label="Slope"
        value={`${fmtNum(fire.slopeDeg, 0)}°`}
        level={slopeSeverity(fire.slopeDeg)}
      />
    </View>
  );
}

function FuelHeroCard({
  fuelCode,
  fuelName,
  eyebrow,
  direct,
}: {
  fuelCode: string;
  fuelName: string;
  eyebrow: string;
  direct?: boolean;
}) {
  const parsed = parseFuelCode(fuelCode);
  const group = parsed.group;

  return (
    <View style={[styles.fuelHero, direct && styles.fuelHeroDirect]}>
      <View style={styles.fuelHeroHead}>
        <FuelBadge code={fuelCode} variant="hero" />
        <View style={styles.fuelHeroIdentity}>
          <Text style={styles.fuelHeroEyebrow}>{eyebrow}</Text>
          {group ? (
            <Text style={styles.fuelHeroGroup}>
              <Text style={styles.fuelHeroPrefix}>{parsed.prefix}</Text> = {group.label}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.fuelHeroDetail}>
        <Text style={styles.fuelHeroName}>{fuelName}</Text>
        {group ? (
          <Text style={styles.fuelHeroHint}>
            {group.short}. Level {parsed.level} = fuel load within this group (higher is heavier).
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function ContextBlock({
  fire,
  env,
  elevation,
  weather,
}: {
  fire: WildfireRiskResult['fire'];
  env: WildfireRiskResult['env'];
  elevation: number | null;
  weather: WildfireRiskResult['weather'];
}) {
  const canopyLevel = env.canopyPct >= 60 ? 'moderate' : env.canopyPct >= 30 ? 'low' : 'neutral';

  return (
    <>
      <View style={styles.contextMetrics}>
        <MetricItem label="Elevation" value={formatElevationFeet(elevation)} level="neutral" />
        <MetricItem label="Canopy cover" value={`${env.canopyPct}%`} level={canopyLevel} />
      </View>
      <Text style={styles.conditions}>
        Wind{' '}
        <Text style={{ color: reportSeverityColor(windSeverity(weather.windMph)) }}>
          {fmtNum(weather.windMph, 0)} mph
        </Text>
        {' · RH '}
        <Text style={{ color: reportSeverityColor(rhSeverity(weather.rh, true)) }}>
          {fmtNum(weather.rh, 0)}%
        </Text>
        {' · Air '}
        <Text style={{ color: reportSeverityColor(tempSeverity(weather.tempF)) }}>
          {fmtNum(weather.tempF, 0)}°F
        </Text>
        {' · 1-hr fuel moisture '}
        <Text style={{ color: reportSeverityColor(moistureSeverity(fire.moisture1h)) }}>
          ~{fmtNum(fire.moisture1h, 0)}%
        </Text>
      </Text>
    </>
  );
}

function SubscoreBar({
  label,
  value,
  weight,
}: {
  label: string;
  value: number;
  weight: number;
}) {
  const level = scoreToSeverity(value);

  return (
    <View style={styles.subscore}>
      <View style={styles.subscoreHead}>
        <Text style={styles.subscoreLabel}>{label}</Text>
        <Text style={[styles.subscoreValue, { color: reportSeverityColor(level) }]}>{value}</Text>
      </View>
      <View style={styles.subscoreTrack}>
        <View
          style={[
            styles.subscoreFill,
            { width: `${value}%`, backgroundColor: reportSubscoreFill(level) },
          ]}
        />
      </View>
      <Text style={styles.subscoreWeight}>{Math.round(weight * 100)}% of total score</Text>
    </View>
  );
}

function SiteNoteBlock({ siteNote }: { siteNote: NonNullable<WildfireRiskResult['siteNote']> }) {
  const others = siteNote.nearbyFuels.filter((n) => n.fuel.code !== siteNote.nearest.fuel.code);

  return (
    <View style={styles.siteNote}>
      <View style={styles.siteNoteLede}>
        <View style={styles.siteNoteLedeTop}>
          <Text style={styles.siteNoteLedeText}>Your pin maps as </Text>
          <FuelBadge code={siteNote.siteFuel.code} variant="pin" />
        </View>
        <Text style={styles.siteNoteLedeDesc}>
          <Text style={styles.siteNotePinName}>{siteNote.siteFuel.name}</Text> {copy.siteNotePinSuffix}
        </Text>
      </View>

      <FuelHeroCard
        fuelCode={siteNote.nearest.fuel.code}
        fuelName={siteNote.nearest.fuel.name}
        eyebrow={`Nearest burnable fuels · ~${siteNote.nearest.distanceM}m ${siteNote.nearest.bearing}`}
      />

      {others.length > 0 ? (
        <View style={styles.nearbyPanel}>
          <ReportCollapsible
            title={`${others.length} other fuel model${others.length === 1 ? '' : 's'} within ~500m`}>
            {others.map((item) => (
              <View key={`${item.fuel.code}-${item.distanceM}`} style={styles.nearbyItem}>
                <FuelBadge code={item.fuel.code} variant="chip" />
                <View style={styles.nearbyBody}>
                  <Text style={styles.nearbyName}>{item.fuel.name}</Text>
                  <Text style={styles.nearbyMeta}>
                    ~{item.distanceM}m {item.bearing}
                  </Text>
                </View>
              </View>
            ))}
          </ReportCollapsible>
        </View>
      ) : null}
    </View>
  );
}

function OutlookSection({ outlook }: { outlook: WildfireRiskResult['outlook'] }) {
  if (!outlook.horizonDays) return null;

  return (
    <View style={styles.outlook}>
      <Text style={styles.sectionTitle}>{copy.outlookHeading}</Text>
      {outlook.summary ? <Text style={styles.outlookSummary}>{outlook.summary}</Text> : null}
      {outlook.alerts.map((alert) => (
        <Text key={`${alert.event}-${alert.expires}`} style={styles.alert}>
          <Text style={styles.alertStrong}>{alert.event}</Text>
          {alert.headline ? ` — ${alert.headline}` : ''}
        </Text>
      ))}
      <Text style={styles.peakLabel}>{copy.peakDaysLabel}</Text>
      {outlook.peakDays.length ? (
        outlook.peakDays.map((day) => (
          <View
            key={day.date}
            style={[styles.peakDay, reportMetricSurface(day.level) as ViewStyle]}>
            <Text style={styles.peakDate}>{formatShortDate(day.date)}</Text>
            <Text style={styles.peakStats}>
              RH {fmtNum(day.rhMin, 0)}% · Wind {fmtNum(day.windMax, 0)} mph · High{' '}
              {fmtNum(day.tempMax, 0)}°F
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.hint}>{copy.noPeakDays}</Text>
      )}
      <Text style={styles.outlookFine}>{copy.outlookFine}</Text>
    </View>
  );
}

function SeasonalSection() {
  return (
    <View style={styles.seasonal}>
      <Text style={styles.sectionTitle}>{copy.seasonalHeading}</Text>
      <Text style={styles.seasonalIntro}>{copy.seasonalIntro}</Text>
      {NOAA_SEASONAL_LINKS.map((link) => (
        <Pressable key={link.url} onPress={() => openUrl(link.url)}>
          <Text style={styles.link}>{link.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function RiskResults({ result }: RiskResultsProps) {
  const { geo, env, fire, risk, weather, elevation, weatherSource, siteNote, outlook } = result;

  if (fire.nonBurnable && !siteNote) {
    return (
      <View style={[styles.inner, styles.innerNb]}>
        <Text style={styles.location}>{geo.label}</Text>
        <View style={[styles.hero, styles.heroNb]}>
          <Text style={styles.eyebrow}>Surface fuel assessment</Text>
          <Text style={styles.nbTitle}>{copy.nonBurnableTitle}</Text>
          <Text style={styles.fuelLine}>
            <Text style={styles.fuelCode}>{fire.fuelCode}</Text> — {fire.fuelName}
          </Text>
        </View>
        <View style={styles.mid}>
          <Text style={styles.hint}>{copy.nonBurnableHint}</Text>
          <OutlookSection outlook={outlook} />
        </View>
        <SeasonalSection />
      </View>
    );
  }

  return (
    <View style={[styles.inner, risk ? { borderColor: reportBandBorder[risk.band] } : null]}>
      <Text style={styles.location}>{geo.label}</Text>

      <View style={styles.hero}>
        {risk ? <ScoreHero risk={risk} weatherSource={weatherSource} /> : null}
        <KeyMetrics fire={fire} />
      </View>

      <View style={styles.mid}>
        <View style={styles.context}>
          {siteNote ? (
            <SiteNoteBlock siteNote={siteNote} />
          ) : (
            <View style={styles.siteNoteDirect}>
              <FuelHeroCard
                fuelCode={fire.fuelCode}
                fuelName={fire.fuelName}
                eyebrow="Fuel at your pin"
                direct
              />
            </View>
          )}
          <ContextBlock fire={fire} env={env} elevation={elevation} weather={weather} />
          {risk ? (
            <View style={styles.breakdown}>
              <ReportCollapsible title={copy.scoreBreakdown} defaultExpanded>
                {Object.values(risk.subscores).map((sub) => (
                  <SubscoreBar
                    key={sub.label}
                    label={sub.label}
                    value={sub.value}
                    weight={sub.weight}
                  />
                ))}
              </ReportCollapsible>
            </View>
          ) : null}
        </View>

        <View style={styles.aside}>
          <OutlookSection outlook={outlook} />
          <SeasonalSection />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    marginTop: ux.spacing.fieldGap,
    padding: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: report.accent,
    backgroundColor: report.surface,
  },
  innerNb: {
    borderColor: 'rgba(0, 0, 0, 0.18)',
  },
  location: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: report.textMuted,
    marginBottom: 14,
  },
  hero: {
    gap: 14,
    marginBottom: 18,
    padding: 14,
    borderRadius: 8,
    backgroundColor: report.heroBg,
    borderWidth: 1,
    borderColor: report.heroBorder,
  },
  heroNb: {
    alignItems: 'center',
  },
  scoreHero: {
    alignItems: 'center',
    gap: 12,
  },
  scoreHeroMeter: {
    alignItems: 'center',
  },
  gaugeWrap: {
    width: 120,
    height: 68,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  scoreNumber: {
    position: 'absolute',
    bottom: 0,
    fontFamily: 'Oswald-Bold',
    fontSize: 34,
    letterSpacing: -1,
  },
  scoreHeroMeta: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  bandPill: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  weatherSource: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: report.textMuted,
    textAlign: 'center',
  },
  metricsHero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricItem: {
    width: '48%',
    flexGrow: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 2,
  },
  metricLabel: {
    fontFamily: 'Oswald-Bold',
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: report.textSoft,
  },
  metricValue: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.statValue,
    color: report.text,
  },
  mid: {
    gap: 18,
  },
  context: {
    gap: 14,
  },
  aside: {
    gap: 18,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: report.border,
  },
  siteNote: {
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: report.siteNoteBorder,
    backgroundColor: report.siteNoteBg,
    gap: 10,
  },
  siteNoteDirect: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: report.siteNoteDirectBorder,
    backgroundColor: report.siteNoteDirectBg,
    padding: 2,
  },
  siteNoteLede: {
    gap: 6,
  },
  siteNoteLedeTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  siteNoteLedeText: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    color: report.text,
  },
  siteNoteLedeDesc: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: report.text,
  },
  siteNotePinName: {
    fontFamily: 'Oswald-Bold',
  },
  fuelHero: {
    marginTop: 4,
    padding: 14,
    borderRadius: 6,
    backgroundColor: report.fuelHeroBg,
    borderWidth: 1,
    borderColor: report.fuelHeroBorder,
    gap: 10,
  },
  fuelHeroDirect: {
    marginTop: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  fuelHeroHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  fuelHeroIdentity: {
    gap: 4,
  },
  fuelHeroDetail: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: report.border,
    gap: 6,
  },
  fuelHeroEyebrow: {
    fontFamily: 'Oswald-Bold',
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: report.textSoft,
  },
  fuelHeroGroup: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: report.accent,
  },
  fuelHeroPrefix: {
    fontSize: ux.type.body,
  },
  fuelHeroName: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    color: report.text,
  },
  fuelHeroHint: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: report.textMuted,
  },
  fuelBadge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: report.accent,
    backgroundColor: report.surface,
  },
  fuelBadgeHero: {
    minWidth: 72,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  fuelBadgeChip: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  fuelBadgePin: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderColor: 'rgba(0, 0, 0, 0.22)',
  },
  fuelBadgeGroup: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.body,
    letterSpacing: 0.5,
    color: report.accent,
  },
  fuelBadgeGroupHero: {
    fontSize: 28,
  },
  fuelBadgeGroupSmall: {
    fontSize: ux.type.caption,
  },
  fuelBadgeLevel: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    color: report.textMuted,
  },
  fuelBadgeLevelHero: {
    fontSize: ux.type.body,
  },
  fuelBadgeLevelSmall: {
    fontSize: ux.type.caption,
  },
  fuelBadgePlain: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    color: report.text,
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  nearbyBody: {
    flex: 1,
    minWidth: 0,
  },
  nearbyName: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: report.text,
  },
  nearbyMeta: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    color: report.textSoft,
    marginTop: 2,
  },
  contextMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nearbyPanel: {
    marginTop: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: report.border,
    overflow: 'hidden',
  },
  reportCollapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  reportCollapseTitle: {
    flex: 1,
    fontFamily: 'Oswald-Bold',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: report.accent,
    paddingRight: 10,
  },
  reportCollapseChevron: {
    fontFamily: 'Oswald-Bold',
    fontSize: 20,
    color: report.textMuted,
    minWidth: 24,
    textAlign: 'center',
  },
  reportCollapseBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  conditions: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: report.textSoft,
  },
  breakdown: {
    borderWidth: 1,
    borderColor: report.border,
    borderRadius: 8,
    backgroundColor: report.breakdownBg,
    overflow: 'hidden',
  },
  subscore: {
    marginBottom: 12,
  },
  subscoreHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 8,
  },
  subscoreLabel: {
    flex: 1,
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.caption,
    color: report.textMuted,
    textTransform: 'uppercase',
  },
  subscoreValue: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
  },
  subscoreTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  subscoreFill: {
    height: '100%',
    borderRadius: 999,
  },
  subscoreWeight: {
    fontFamily: 'Oswald-Regular',
    fontSize: 11,
    color: report.textSoft,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.label,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: report.textMuted,
    marginBottom: 8,
  },
  outlook: {
    gap: 8,
  },
  outlookSummary: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: report.text,
  },
  outlookFine: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: report.textSoft,
    marginTop: 6,
  },
  alert: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: '#b5281a',
  },
  alertStrong: {
    fontFamily: 'Oswald-Bold',
  },
  peakLabel: {
    fontFamily: 'Oswald-Bold',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: report.textSoft,
    marginTop: 4,
  },
  peakDay: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 6,
  },
  peakDate: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    color: report.text,
    marginBottom: 2,
  },
  peakStats: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    color: report.textMuted,
  },
  seasonal: {
    gap: 6,
  },
  seasonalIntro: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: report.textMuted,
    marginBottom: 4,
  },
  link: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.caption,
    color: report.accent,
    marginBottom: 4,
  },
  eyebrow: {
    fontFamily: 'Oswald-Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: report.textMuted,
    marginBottom: 6,
  },
  nbTitle: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.guideTitle,
    color: report.accent,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  fuelLine: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    color: report.text,
    textAlign: 'center',
  },
  fuelCode: {
    fontFamily: 'Oswald-Bold',
  },
  hint: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: report.text,
  },
});
