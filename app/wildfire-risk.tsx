import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CTABanner } from '@/components/CTABanner';
import { FieldInput } from '@/components/calculator/FieldInput';
import { PrimaryButton } from '@/components/calculator/PrimaryButton';
import { SurfaceCard } from '@/components/calculator/SurfaceCard';
import { ToolScreenHeader } from '@/components/calculator/ToolScreenHeader';
import { ToolScreenShell } from '@/components/calculator/ToolScreenShell';
import { CollapsibleGuide, GuideBlock } from '@/components/calculator/ToolGuide';
import { RiskResults } from '@/components/wildfire-risk/RiskResults';
import { ScorePieBreakdown } from '@/components/wildfire-risk/ScorePieBreakdown';
import { WildfireFlowSteps } from '@/components/wildfire-risk/WildfireFlowSteps';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { wildfireRisk as copy } from '@/constants/content';
import { wildfireRiskGuide } from '@/constants/tool-education';
import { DATA_SOURCES } from '@/lib/wildfire-risk/config';
import { fetchAddressSuggestions } from '@/lib/wildfire-risk/geocoding';
import { useWildfireRiskCalculator } from '@/hooks/useWildfireRiskCalculator';
import { colors } from '@/constants/theme';

export default function WildfireRiskScreen() {
  const {
    state,
    result,
    status,
    calculating,
    locating,
    updateField,
    useCurrentLocation,
    calculate,
  } = useWildfireRiskCalculator();

  const [suggestions, setSuggestions] = useState<Array<{ display_name: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQuery = useRef('');

  const loadSuggestions = useCallback(async (query: string) => {
    if (query.length < 4) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (query === lastQuery.current) return;
    lastQuery.current = query;

    try {
      const items = await fetchAddressSuggestions(query);
      setSuggestions(items);
      setShowSuggestions(items.length > 0);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    if (suggestTimer.current) clearTimeout(suggestTimer.current);

    const query = state.address.trim();
    if (query.length < 4) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    suggestTimer.current = setTimeout(() => {
      loadSuggestions(query);
    }, 400);

    return () => {
      if (suggestTimer.current) clearTimeout(suggestTimer.current);
    };
  }, [state.address, loadSuggestions]);

  const selectSuggestion = (displayName: string) => {
    updateField('address', displayName);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <ToolScreenShell>
      <ToolScreenHeader title={copy.title} subtitle={copy.subtitle} />

      <SurfaceCard heading={copy.guideHeading}>
        <CollapsibleGuide title={wildfireRiskGuide.overview.title} defaultExpanded>
          <GuideBlock paragraphs={wildfireRiskGuide.overview.paragraphs} />
        </CollapsibleGuide>
        <CollapsibleGuide title={wildfireRiskGuide.steps.title}>
          <WildfireFlowSteps />
        </CollapsibleGuide>
        <CollapsibleGuide title={wildfireRiskGuide.scoreFactors.title}>
          <ScorePieBreakdown />
        </CollapsibleGuide>
        <CollapsibleGuide title={wildfireRiskGuide.ruralTip.title}>
          <GuideBlock paragraphs={wildfireRiskGuide.ruralTip.paragraphs} />
        </CollapsibleGuide>
      </SurfaceCard>

      <SurfaceCard
        heading={copy.checkPropertyHeading}
        headingScale="large"
        variant="action">
        <Text style={styles.hint}>{copy.addressHint}</Text>

        <View style={styles.addressWrap}>
          <Text style={styles.label}>{copy.addressLabel}</Text>
          <TextInput
            value={state.address}
            onChangeText={(text) => updateField('address', text)}
            onFocus={() => {
              if (suggestions.length) setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 180);
            }}
            placeholder={copy.addressPlaceholder}
            placeholderTextColor="rgba(168, 164, 158, 0.6)"
            autoCorrect={false}
            autoCapitalize="words"
            style={styles.addressInput}
          />
          {showSuggestions ? (
            <View style={styles.suggestions}>
              {suggestions.map((item) => (
                <Pressable
                  key={item.display_name}
                  style={styles.suggestionItem}
                  onPress={() => selectSuggestion(item.display_name)}>
                  <Text style={styles.suggestionText}>{item.display_name}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {!state.address.trim() && !state.deviceLocation ? (
            <Pressable
              onPress={useCurrentLocation}
              disabled={calculating || locating}
              style={styles.locationLink}
              hitSlop={8}>
              <Text style={styles.locationLinkText}>
                {locating ? copy.locating : copy.useMyLocation}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {state.deviceLocation ? (
          <Text style={styles.locationHint}>{copy.locationActiveHint}</Text>
        ) : null}

        <CollapsibleGuide title={copy.advancedHeading}>
          <View style={styles.customRow}>
            <Text style={styles.customLabel}>{copy.useCustomWeather}</Text>
            <Switch
              value={state.useCustomWeather}
              onValueChange={(value) => updateField('useCustomWeather', value)}
              trackColor={{ false: 'rgba(240,237,232,0.2)', true: colors.accent }}
              thumbColor={colors.text}
            />
          </View>
          {state.useCustomWeather ? (
            <>
              <FieldInput
                label={copy.windLabel}
                value={state.windOverride}
                onChangeText={(text) => updateField('windOverride', text)}
                unit={copy.windUnit}
              />
              <FieldInput
                label={copy.humidityLabel}
                value={state.humidityOverride}
                onChangeText={(text) => updateField('humidityOverride', text)}
                unit={copy.humidityUnit}
              />
              <FieldInput
                label={copy.tempLabel}
                value={state.tempOverride}
                onChangeText={(text) => updateField('tempOverride', text)}
                unit={copy.tempUnit}
              />
            </>
          ) : null}
        </CollapsibleGuide>

        <PrimaryButton
          label={copy.calculate}
          onPress={calculate}
          disabled={calculating || locating}
          style={styles.submit}
        />

        {status.message ? (
          <View style={styles.statusRow}>
            {status.type === 'loading' ? (
              <ActivityIndicator size="small" color={colors.accent} style={styles.spinner} />
            ) : null}
            <Text
              style={[
                styles.status,
                status.type === 'error' && styles.statusError,
                status.type === 'loading' && styles.statusLoading,
              ]}>
              {status.message}
            </Text>
          </View>
        ) : null}
      </SurfaceCard>

      {result ? <RiskResults result={result} /> : null}

      <SurfaceCard heading={copy.sourcesHeading} style={styles.sourcesCard}>
        {DATA_SOURCES.map((source) => (
          <Pressable key={source.url} onPress={() => Linking.openURL(source.url)}>
            <Text style={styles.sourceLink}>
              {source.label} — {source.note}
            </Text>
          </Pressable>
        ))}
      </SurfaceCard>

      <Text style={styles.disclaimer}>{copy.disclaimer}</Text>

      <CTABanner quiet />
    </ToolScreenShell>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: colors.textMuted,
    marginBottom: ux.spacing.fieldGap,
  },
  locationLink: {
    alignSelf: 'flex-start',
    marginTop: 10,
    minHeight: 36,
    justifyContent: 'center',
  },
  locationLinkText: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: 'rgba(240, 237, 232, 0.5)',
    textDecorationLine: 'underline',
  },
  locationHint: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: 'rgba(88, 160, 122, 0.95)',
    marginTop: -4,
    marginBottom: ux.spacing.fieldGap,
  },
  addressWrap: {
    marginBottom: ux.spacing.fieldGap,
    zIndex: 2,
  },
  label: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.label,
    letterSpacing: 1,
    color: 'rgba(240, 237, 232, 0.65)',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  addressInput: {
    backgroundColor: 'rgba(8, 14, 8, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(240, 237, 232, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 16,
    minHeight: ux.touch.inputMinHeight,
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.body,
    lineHeight: ux.lineHeight.body,
    color: colors.text,
    paddingVertical: 14,
  },
  suggestions: {
    marginTop: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: colors.text,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ux.spacing.fieldGap,
    gap: 12,
  },
  customLabel: {
    flex: 1,
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: colors.textMuted,
  },
  submit: {
    marginBottom: 0,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  spinner: {
    marginRight: 8,
  },
  status: {
    flex: 1,
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    color: colors.textMuted,
  },
  statusError: {
    color: colors.accent,
  },
  statusLoading: {
    color: colors.text,
  },
  sourcesCard: {
    marginTop: ux.spacing.fieldGap,
  },
  sourceLink: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: colors.accent,
    marginBottom: 8,
  },
  disclaimer: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: 'rgba(240, 237, 232, 0.45)',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
});
