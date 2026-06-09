import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CTABanner } from '@/components/CTABanner';
import { EmptyStateHint } from '@/components/calculator/EmptyStateHint';
import { FieldInput } from '@/components/calculator/FieldInput';
import { MeasurementReadout } from '@/components/calculator/MeasurementReadout';
import { SurfaceCard } from '@/components/calculator/SurfaceCard';
import { ToolScreenHeader } from '@/components/calculator/ToolScreenHeader';
import { ToolScreenShell } from '@/components/calculator/ToolScreenShell';
import { CollapsibleGuide, FaqList, GuideBlock } from '@/components/calculator/ToolGuide';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { treeHeight as copy } from '@/constants/content';
import { getTreeHeightMethodGuide, treeHeightGuide } from '@/constants/tool-education';
import { useTreeHeightCalculator } from '@/hooks/useTreeHeightCalculator';
import {
  getTreeHeightEmptyStateMessage,
  getTreeHeightFieldErrors,
} from '@/lib/tree-height/form-errors';
import { formatHeightPair } from '@/lib/tree-height/format';
import type {
  LengthUnit,
  TreeHeightMethod,
  TreeHeightResult,
  TreeHeightTier,
} from '@/lib/tree-height/types';

const TIERS: { id: TreeHeightTier; label: string }[] = [
  { id: 'standard', label: copy.tiers.standard },
  { id: 'advanced', label: copy.tiers.advanced },
];

const STANDARD_METHOD_OPTIONS: { id: TreeHeightMethod; label: string }[] = [
  { id: 'angle', label: copy.methods.angle },
  { id: 'line-of-sight', label: copy.methods.lineOfSight },
  { id: 'shadow', label: copy.methods.shadow },
];

const ADVANCED_METHOD_OPTIONS: { id: TreeHeightMethod; label: string }[] = [
  { id: 'clinometer', label: copy.methods.clinometer },
  { id: 'triangulation', label: copy.methods.triangulation },
];

export default function TreeHeightScreen() {
  const { state, tier, result, setMethod, setTier, setUnit, updateField } =
    useTreeHeightCalculator();

  const unitLabel = state.unit === 'ft' ? copy.feet : copy.meters;
  const heights = result ? formatHeightPair(result) : null;
  const methodGuide = getTreeHeightMethodGuide(state.method);
  const fieldErrors = useMemo(() => getTreeHeightFieldErrors(state), [state]);
  const emptyStateMessage = useMemo(
    () => (result ? null : getTreeHeightEmptyStateMessage(state, fieldErrors)),
    [state, result, fieldErrors],
  );
  const methodOptions = tier === 'standard' ? STANDARD_METHOD_OPTIONS : ADVANCED_METHOD_OPTIONS;

  return (
    <ToolScreenShell>
      <ToolScreenHeader title={copy.title} subtitle={copy.subtitle} />

      <SurfaceCard heading={copy.guideHeading}>
        <CollapsibleGuide title={treeHeightGuide.overview.title} defaultExpanded>
          <GuideBlock steps={treeHeightGuide.overview.steps} />
        </CollapsibleGuide>
        <CollapsibleGuide title={treeHeightGuide.chooseMethod.title}>
          <GuideBlock paragraphs={treeHeightGuide.chooseMethod.paragraphs} />
        </CollapsibleGuide>
        <CollapsibleGuide title={treeHeightGuide.tips.title}>
          <GuideBlock bullets={treeHeightGuide.tips.items} />
        </CollapsibleGuide>
        <CollapsibleGuide title={treeHeightGuide.faq.title}>
          <FaqList items={treeHeightGuide.faq.items} />
        </CollapsibleGuide>
      </SurfaceCard>

      <SurfaceCard heading={copy.tierHeading}>
        <View style={styles.tierRow}>
          {TIERS.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => setTier(entry.id)}
              style={[styles.tierChip, tier === entry.id && styles.tierChipActive]}>
              <Text style={[styles.tierText, tier === entry.id && styles.tierTextActive]}>
                {entry.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard heading={copy.methodHeading}>
        <View style={styles.methodRow}>
          {methodOptions.map((method) => (
            <Pressable
              key={method.id}
              onPress={() => setMethod(method.id)}
              style={[
                styles.methodChip,
                state.method === method.id && styles.methodChipActive,
              ]}>
              <Text
                style={[
                  styles.methodText,
                  state.method === method.id && styles.methodTextActive,
                ]}>
                {method.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.unitRow}>
          {(['ft', 'm'] as LengthUnit[]).map((unit) => (
            <Pressable
              key={unit}
              onPress={() => setUnit(unit)}
              style={[styles.unitChip, state.unit === unit && styles.unitChipActive]}>
              <Text style={styles.unitText}>{unit}</Text>
            </Pressable>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard heading={copy.methodGuideHeading}>
        <Text style={styles.methodSummary}>{methodGuide.summary}</Text>
        <GuideBlock steps={methodGuide.steps} tip={methodGuide.tip} />
      </SurfaceCard>

      {state.method === 'angle' ? (
        <>
          <SurfaceCard heading={copy.distanceHeading}>
            <FieldInput
              label={copy.distanceLabel}
              value={state.distance}
              onChangeText={(value) => updateField('distance', value)}
              unit={unitLabel}
              error={fieldErrors.distance}
            />
          </SurfaceCard>
          <SurfaceCard heading={copy.angleHeading}>
            <Text style={styles.fieldHint}>{copy.angleHint}</Text>
            <FieldInput
              label={copy.angleLabel}
              value={state.angle}
              onChangeText={(value) => updateField('angle', value)}
              unit="°"
              error={fieldErrors.angle}
            />
            <Text style={styles.fieldHint}>{copy.eyeHeightHint}</Text>
            <FieldInput
              label={copy.eyeHeightLabel}
              value={state.eyeHeight}
              onChangeText={(value) => updateField('eyeHeight', value)}
              unit={unitLabel}
              error={fieldErrors.eyeHeight}
            />
          </SurfaceCard>
        </>
      ) : null}

      {state.method === 'line-of-sight' ? (
        <>
          <SurfaceCard heading={copy.distanceHeading}>
            <FieldInput
              label={copy.distanceLabel}
              value={state.distance}
              onChangeText={(value) => updateField('distance', value)}
              unit={unitLabel}
              error={fieldErrors.distance}
            />
          </SurfaceCard>
          <SurfaceCard heading={copy.lineOfSightHeading}>
            <Text style={styles.fieldHint}>{copy.lineOfSightHint}</Text>
            <FieldInput
              label={copy.lineOfSightLabel}
              value={state.lineOfSight}
              onChangeText={(value) => updateField('lineOfSight', value)}
              unit={unitLabel}
              error={fieldErrors.lineOfSight}
            />
          </SurfaceCard>
        </>
      ) : null}

      {state.method === 'shadow' ? (
        <SurfaceCard heading={copy.shadowHeading}>
          <FieldInput
            label={copy.userHeightLabel}
            value={state.userHeight}
            onChangeText={(value) => updateField('userHeight', value)}
            unit={unitLabel}
            error={fieldErrors.userHeight}
          />
          <FieldInput
            label={copy.userShadowLabel}
            value={state.userShadowLength}
            onChangeText={(value) => updateField('userShadowLength', value)}
            unit={unitLabel}
            error={fieldErrors.userShadowLength}
          />
          <FieldInput
            label={copy.treeShadowLabel}
            value={state.treeShadowLength}
            onChangeText={(value) => updateField('treeShadowLength', value)}
            unit={unitLabel}
            error={fieldErrors.treeShadowLength}
          />
        </SurfaceCard>
      ) : null}

      {state.method === 'clinometer' ? (
        <>
          <SurfaceCard heading={copy.distanceHeading}>
            <FieldInput
              label={copy.distanceLabel}
              value={state.distance}
              onChangeText={(value) => updateField('distance', value)}
              unit={unitLabel}
              error={fieldErrors.distance}
            />
          </SurfaceCard>
          <SurfaceCard heading={copy.angleHeading}>
            <Text style={styles.fieldHint}>{copy.angleHint}</Text>
            <FieldInput
              label={copy.angleLabel}
              value={state.angle}
              onChangeText={(value) => updateField('angle', value)}
              unit="°"
              error={fieldErrors.angle}
            />
            <Text style={styles.fieldHint}>{copy.clinometerEyeHeightHint}</Text>
            <FieldInput
              label={copy.eyeHeightLabel}
              value={state.eyeHeight}
              onChangeText={(value) => updateField('eyeHeight', value)}
              unit={unitLabel}
              error={fieldErrors.eyeHeight}
            />
          </SurfaceCard>
        </>
      ) : null}

      {state.method === 'triangulation' ? (
        <>
          <SurfaceCard heading={copy.triangulationHeading}>
            <FieldInput
              label={copy.distanceLabel}
              value={state.distance}
              onChangeText={(value) => updateField('distance', value)}
              unit={unitLabel}
              error={fieldErrors.distance}
            />
            <FieldInput
              label={copy.angleLabel}
              value={state.angle}
              onChangeText={(value) => updateField('angle', value)}
              unit="°"
              error={fieldErrors.angle}
            />
          </SurfaceCard>
          <SurfaceCard heading={copy.triangulationHeading2}>
            <FieldInput
              label={copy.distance2Label}
              value={state.distance2}
              onChangeText={(value) => updateField('distance2', value)}
              unit={unitLabel}
              error={fieldErrors.distance2}
            />
            <FieldInput
              label={copy.angle2Label}
              value={state.angle2}
              onChangeText={(value) => updateField('angle2', value)}
              unit="°"
              error={fieldErrors.angle2}
            />
          </SurfaceCard>
        </>
      ) : null}

      <Text style={styles.disclaimer}>{treeHeightGuide.disclaimer}</Text>

      {!result && emptyStateMessage ? <EmptyStateHint message={emptyStateMessage} /> : null}

      {result ? (
        <MeasurementReadout
          label={copy.resultLabel}
          value={result.estimatedHeight.toFixed(1)}
          unit={unitLabel}
          stats={buildResultStats(result, heights)}
        />
      ) : null}

      <CTABanner quiet />
    </ToolScreenShell>
  );
}

function buildResultStats(
  result: TreeHeightResult,
  heights: ReturnType<typeof formatHeightPair> | null,
) {
  const stats: { label: string; value: string }[] = [];

  if (heights) {
    stats.push({
      label: copy.alternateHeightLabel,
      value: heights.alternate,
    });
  }

  if (result.rawInputs.angle !== null) {
    stats.push({
      label: copy.angleLabel,
      value: `${result.rawInputs.angle.toFixed(1)}°`,
    });
  }

  if (result.rawInputs.angle2 !== null) {
    stats.push({
      label: copy.angle2Label,
      value: `${result.rawInputs.angle2.toFixed(1)}°`,
    });
  }

  if (result.rawInputs.distance !== null) {
    stats.push({
      label: copy.distanceLabel,
      value: `${result.rawInputs.distance.toFixed(1)} ${result.unit}`,
    });
  }

  if (result.rawInputs.distance2 !== null) {
    stats.push({
      label: copy.distance2Label,
      value: `${result.rawInputs.distance2.toFixed(1)} ${result.unit}`,
    });
  }

  if (result.rawInputs.lineOfSight !== null) {
    stats.push({
      label: copy.lineOfSightLabel,
      value: `${result.rawInputs.lineOfSight.toFixed(1)} ${result.unit}`,
    });
  }

  const notes = [...result.precisionNotes, ...result.warnings];
  if (notes.length > 0) {
    stats.push({
      label: copy.warningsLabel,
      value: notes.join(' '),
    });
  }

  return stats;
}

const styles = StyleSheet.create({
  methodSummary: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.body,
    lineHeight: ux.lineHeight.body,
    color: 'rgba(240, 237, 232, 0.72)',
    marginBottom: 12,
  },
  fieldHint: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: 'rgba(240, 237, 232, 0.65)',
    marginBottom: 14,
  },
  disclaimer: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: 'rgba(240, 237, 232, 0.5)',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: -4,
    paddingHorizontal: 8,
  },
  tierRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  tierChip: {
    flex: 1,
    paddingHorizontal: ux.touch.chipPaddingH,
    paddingVertical: ux.touch.chipPaddingV,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(240, 237, 232, 0.18)',
    minHeight: ux.touch.minTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierChipActive: {
    borderColor: '#E8531A',
    backgroundColor: 'rgba(232, 83, 26, 0.14)',
  },
  tierText: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.chip,
    color: 'rgba(240, 237, 232, 0.75)',
    textTransform: 'uppercase',
  },
  tierTextActive: {
    color: '#F0EDE8',
  },
  methodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  methodChip: {
    paddingHorizontal: ux.touch.chipPaddingH,
    paddingVertical: ux.touch.chipPaddingV,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(240, 237, 232, 0.18)',
    minHeight: ux.touch.minTarget,
    justifyContent: 'center',
  },
  methodChipActive: {
    borderColor: '#E8531A',
    backgroundColor: 'rgba(232, 83, 26, 0.14)',
  },
  methodText: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.chip,
    color: 'rgba(240, 237, 232, 0.75)',
    textTransform: 'uppercase',
  },
  methodTextActive: {
    color: '#F0EDE8',
  },
  unitRow: {
    flexDirection: 'row',
    gap: 10,
  },
  unitChip: {
    paddingHorizontal: 20,
    paddingVertical: ux.touch.chipPaddingV,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(240, 237, 232, 0.18)',
    minHeight: ux.touch.minTarget,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitChipActive: {
    borderColor: '#E8531A',
    backgroundColor: 'rgba(232, 83, 26, 0.14)',
  },
  unitText: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.chip,
    color: '#F0EDE8',
    textTransform: 'uppercase',
  },
});
