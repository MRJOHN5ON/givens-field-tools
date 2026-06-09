import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CTABanner } from '@/components/CTABanner';
import { CordCalculatorShell } from '@/components/calculator/CordCalculatorShell';
import { EmptyStateHint } from '@/components/calculator/EmptyStateHint';
import { FieldInput } from '@/components/calculator/FieldInput';
import { MeasurementReadout } from '@/components/calculator/MeasurementReadout';
import { PrimaryButton } from '@/components/calculator/PrimaryButton';
import { ToolScreenHeader } from '@/components/calculator/ToolScreenHeader';
import { WoodSurfaceCard } from '@/components/calculator/WoodSurfaceCard';
import { CollapsibleGuide, GuideBlock } from '@/components/calculator/ToolGuide';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { cordCalculator as copy } from '@/constants/content';
import { wood } from '@/constants/wood-theme';
import { cordCalculatorGuide } from '@/constants/tool-education';
import { useCordCalculator } from '@/hooks/useCordCalculator';
import { formatBtusMillions } from '@/lib/cord-calculator/calculations';
import {
  getCordLogEmptyStateMessage,
  getCordLogFieldErrors,
} from '@/lib/cord-calculator/form-errors';
import { WOOD_SPECIES } from '@/lib/cord-calculator/species';
import type { LogCalculationResult, LogTotals, WoodSpeciesId } from '@/lib/cord-calculator/types';

export default function CordCalculatorScreen() {
  const {
    logs,
    totals,
    activeLog,
    activeLogId,
    activeLogHasMeasurements,
    hasAnyMeasurements,
    setActiveLogId,
    updateLogField,
    setLogSpecies,
    renameLog,
    finalizeLogName,
    addLog,
    removeLog,
    clearLog,
    resetAllLogs,
  } = useCordCalculator();

  const activeLogIndex = logs.findIndex((log) => log.id === activeLogId);
  const logResult = activeLog?.results ?? null;
  const fieldErrors = useMemo(
    () => (activeLog ? getCordLogFieldErrors(activeLog) : null),
    [activeLog],
  );
  const emptyStateMessage = useMemo(() => {
    if (!activeLog || !fieldErrors || logResult) return null;
    return getCordLogEmptyStateMessage(activeLog, fieldErrors);
  }, [activeLog, fieldErrors, logResult]);

  const confirmResetAllLogs = () => {
    Alert.alert(copy.resetAllConfirmTitle, copy.resetAllConfirmMessage, [
      { text: copy.resetAllCancelAction, style: 'cancel' },
      { text: copy.resetAllConfirmAction, style: 'destructive', onPress: resetAllLogs },
    ]);
  };

  if (!activeLog || !fieldErrors) {
    return null;
  }

  return (
    <CordCalculatorShell>
      <ToolScreenHeader title={copy.title} subtitle={copy.subtitle} variant="wood" />

      <WoodSurfaceCard heading={copy.guideHeading}>
        <CollapsibleGuide
          title={cordCalculatorGuide.gettingStarted.title}
          defaultExpanded>
          <GuideBlock steps={cordCalculatorGuide.gettingStarted.steps} />
        </CollapsibleGuide>
        <CollapsibleGuide title={cordCalculatorGuide.whatIsACord.title}>
          <GuideBlock paragraphs={cordCalculatorGuide.whatIsACord.paragraphs} />
        </CollapsibleGuide>
        <CollapsibleGuide title={cordCalculatorGuide.measuringLog.title}>
          <GuideBlock
            paragraphs={cordCalculatorGuide.measuringLog.paragraphs}
            bullets={cordCalculatorGuide.measuringLog.tips}
          />
        </CollapsibleGuide>
        <CollapsibleGuide title={cordCalculatorGuide.species.title}>
          <GuideBlock paragraphs={cordCalculatorGuide.species.paragraphs} />
        </CollapsibleGuide>
      </WoodSurfaceCard>

      <WoodSurfaceCard heading={copy.logsHeading}>
        <Text style={styles.nameLabel}>{copy.logNameLabel}</Text>
        <TextInput
          key={activeLog.id}
          value={activeLog.name}
          onChangeText={(name) => renameLog(activeLog.id, name)}
          onBlur={() =>
            finalizeLogName(activeLog.id, activeLog.name, activeLogIndex)
          }
          style={styles.nameInput}
          placeholder={copy.logNamePlaceholder}
          placeholderTextColor={wood.textSoft}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="done"
          clearButtonMode="while-editing"
        />
        <Text style={styles.nameHint}>{copy.logNameHint}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.logTabs}>
            {logs.map((log, index) => {
              const tabLabel = log.name.trim() || `Log ${index + 1}`;
              return (
                <Pressable
                  key={log.id}
                  onPress={() => setActiveLogId(log.id)}
                  style={[
                    styles.logTab,
                    log.id === activeLogId && styles.logTabActive,
                  ]}>
                  <Text
                    style={[
                      styles.logTabText,
                      log.id === activeLogId && styles.logTabTextActive,
                    ]}
                    numberOfLines={1}>
                    {tabLabel}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.logActions}>
          <PrimaryButton label={copy.addLog} onPress={addLog} variant="outline" />
          {activeLogHasMeasurements ? (
            <PrimaryButton
              label={copy.clearLog}
              onPress={() => clearLog(activeLog.id)}
              variant="outline"
            />
          ) : null}
          {logs.length > 1 ? (
            <PrimaryButton
              label={copy.removeLog}
              onPress={() => removeLog(activeLog.id)}
              variant="outline"
              style={styles.removeButton}
            />
          ) : null}
          {hasAnyMeasurements || logs.length > 1 ? (
            <PrimaryButton
              label={copy.resetAllLogs}
              onPress={confirmResetAllLogs}
              variant="outline"
              style={styles.removeButton}
            />
          ) : null}
        </View>
      </WoodSurfaceCard>

      <WoodSurfaceCard heading={copy.dimensionsHeading}>
        <FieldInput
          label={copy.bottomDiameterLabel}
          value={activeLog.bottomDiameter}
          onChangeText={(value) => updateLogField(activeLog.id, 'bottomDiameter', value)}
          unit={copy.unitIn}
          tone="wood"
          error={fieldErrors.bottomDiameter}
        />
        <Text style={styles.hint}>{copy.bottomDiameterHint}</Text>
        <FieldInput
          label={copy.topDiameterLabel}
          value={activeLog.topDiameter}
          onChangeText={(value) => updateLogField(activeLog.id, 'topDiameter', value)}
          unit={copy.unitIn}
          tone="wood"
          error={fieldErrors.topDiameter}
        />
        <Text style={styles.hint}>{copy.topDiameterHint}</Text>
        <FieldInput
          label={copy.heightLabel}
          value={activeLog.height}
          onChangeText={(value) => updateLogField(activeLog.id, 'height', value)}
          unit={copy.unitFt}
          tone="wood"
          error={fieldErrors.height}
        />
        <Text style={styles.hint}>{copy.heightHint}</Text>
      </WoodSurfaceCard>

      <WoodSurfaceCard heading={copy.speciesHeading}>
        <Text style={styles.hint}>{copy.speciesHint}</Text>
        <Text style={styles.inlineGuide}>{cordCalculatorGuide.species.paragraphs[0]}</Text>
        <View style={styles.speciesList}>
          {WOOD_SPECIES.map((species) => {
            const selected = activeLog.speciesId === species.id;
            return (
              <Pressable
                key={species.id}
                onPress={() =>
                  setLogSpecies(
                    activeLog.id,
                    selected ? null : (species.id as WoodSpeciesId),
                  )
                }
                style={[styles.speciesChip, selected && styles.speciesChipSelected]}>
                <Text style={[styles.speciesText, selected && styles.speciesTextSelected]}>
                  {species.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </WoodSurfaceCard>

      {!logResult && emptyStateMessage ? (
        <EmptyStateHint message={emptyStateMessage} tone="wood" />
      ) : null}

      {logResult ? (
        <MeasurementReadout
          label={`${activeLog.name} — ${copy.resultLabel}`}
          value={logResult.cords.toFixed(2)}
          unit={copy.cordsLabel}
          stats={buildLogStats(logResult)}
          tone="wood"
        />
      ) : null}

      {totals.calculatedLogCount > 0 ? (
        <MeasurementReadout
          label={copy.totalsHeading}
          value={totals.totalCords.toFixed(2)}
          unit={copy.cordsLabel}
          accent={false}
          stats={buildTotalStats(totals)}
          tone="wood"
        />
      ) : null}

      <Text style={styles.note}>{copy.note}</Text>
      <CTABanner quiet />
    </CordCalculatorShell>
  );
}

type ReadoutStat = { label: string; value: string };

function buildLogStats(logResult: LogCalculationResult): ReadoutStat[] {
  const stats: ReadoutStat[] = [
    {
      label: copy.volumeLabel,
      value: `${logResult.volumeCubicInches.toFixed(0)} cu in`,
    },
    {
      label: copy.faceCordsLabel,
      value: logResult.faceCords.toFixed(2),
    },
  ];

  if (logResult.btusMillions !== null) {
    stats.push({
      label: copy.btuLabel,
      value: formatBtusMillions(logResult.btusMillions),
    });
  } else {
    stats.push({
      label: copy.btuLabel,
      value: copy.noSpecies,
    });
  }

  if (logResult.heatingContext) {
    stats.push({
      label: 'Heating Context',
      value: logResult.heatingContext,
    });
  }

  return stats;
}

function buildTotalStats(totals: LogTotals): ReadoutStat[] {
  const stats: ReadoutStat[] = [
    {
      label: copy.totalFaceCordsLabel,
      value: totals.totalFaceCords.toFixed(2),
    },
    {
      label: copy.volumeLabel,
      value: `${totals.totalVolumeCubicInches.toFixed(0)} cu in`,
    },
    {
      label: 'Logs Calculated',
      value: `${totals.calculatedLogCount} / ${totals.logCount}`,
    },
  ];

  if (totals.totalBtusMillions !== null) {
    stats.push({
      label: copy.totalBtuLabel,
      value: formatBtusMillions(totals.totalBtusMillions),
    });
  }

  return stats;
}

const styles = StyleSheet.create({
  nameLabel: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.label,
    letterSpacing: 1,
    color: wood.textMuted,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  nameHint: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: wood.textSoft,
    marginBottom: 16,
  },
  logTabs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  logTab: {
    paddingHorizontal: ux.touch.chipPaddingH,
    paddingVertical: ux.touch.chipPaddingV,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: wood.borderMuted,
    backgroundColor: 'rgba(26, 18, 12, 0.55)',
    minHeight: ux.touch.minTarget,
    justifyContent: 'center',
  },
  logTabActive: {
    borderColor: wood.amber,
    backgroundColor: 'rgba(212, 160, 84, 0.18)',
  },
  logTabText: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.chip,
    color: wood.textMuted,
    textTransform: 'uppercase',
  },
  logTabTextActive: {
    color: wood.text,
    fontFamily: 'Oswald-Bold',
  },
  nameInput: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.nameInput,
    color: wood.text,
    backgroundColor: wood.inputBg,
    borderWidth: 1,
    borderColor: wood.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    minHeight: ux.touch.inputMinHeight,
  },
  logActions: {
    gap: 10,
  },
  removeButton: {
    marginBottom: 0,
  },
  hint: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: wood.textSoft,
    marginBottom: 12,
  },
  inlineGuide: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: wood.textSoft,
    marginBottom: 14,
  },
  speciesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  speciesChip: {
    paddingHorizontal: ux.touch.chipPaddingH,
    paddingVertical: ux.touch.chipPaddingV,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: wood.borderMuted,
    backgroundColor: 'rgba(26, 18, 12, 0.5)',
    minHeight: ux.touch.minTarget,
    justifyContent: 'center',
  },
  speciesChipSelected: {
    borderColor: wood.cedar,
    backgroundColor: 'rgba(166, 123, 91, 0.24)',
  },
  speciesText: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.chip,
    color: wood.textMuted,
  },
  speciesTextSelected: {
    color: wood.text,
    fontFamily: 'Oswald-Bold',
  },
  note: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: wood.textSoft,
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
