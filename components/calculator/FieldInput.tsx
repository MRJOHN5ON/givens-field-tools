import { StyleSheet, Text, TextInput, View } from 'react-native';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { colors } from '@/constants/theme';
import { wood } from '@/constants/wood-theme';

type FieldInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  unit?: string;
  flex?: number;
  tone?: 'default' | 'wood';
  error?: string | null;
};

export function FieldInput({
  label,
  value,
  onChangeText,
  unit = 'ft',
  flex,
  tone = 'default',
  error = null,
}: FieldInputProps) {
  const isWood = tone === 'wood';
  const hasError = Boolean(error);

  return (
    <View style={[styles.wrap, flex !== undefined && { flex }]}>
      <Text style={[styles.label, isWood && styles.labelWood]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          isWood && styles.inputRowWood,
          hasError && styles.inputRowError,
          hasError && isWood && styles.inputRowErrorWood,
        ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="rgba(168, 164, 158, 0.6)"
          style={styles.input}
        />
        <View style={styles.unitSlot}>
          <Text style={[styles.unit, isWood && styles.unitWood]}>{unit}</Text>
        </View>
      </View>
      {hasError ? <Text style={[styles.error, isWood && styles.errorWood]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: ux.spacing.fieldGap,
  },
  label: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.label,
    letterSpacing: 1,
    color: 'rgba(240, 237, 232, 0.65)',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 14, 8, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(240, 237, 232, 0.12)',
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 14,
    minHeight: ux.touch.inputMinHeight,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.input,
    letterSpacing: -0.5,
    color: colors.text,
    paddingVertical: 12,
    paddingRight: 8,
  },
  unitSlot: {
    flexShrink: 0,
    justifyContent: 'center',
    minWidth: 36,
    paddingLeft: 4,
  },
  unit: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.inputUnit,
    letterSpacing: 0.4,
    color: 'rgba(240, 237, 232, 0.55)',
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  labelWood: {
    color: wood.textMuted,
  },
  inputRowWood: {
    backgroundColor: wood.inputBg,
    borderColor: wood.borderMuted,
  },
  unitWood: {
    color: wood.textSoft,
  },
  inputRowError: {
    borderColor: 'rgba(232, 83, 26, 0.55)',
  },
  inputRowErrorWood: {
    borderColor: 'rgba(212, 160, 84, 0.65)',
  },
  error: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.caption,
    lineHeight: ux.lineHeight.caption,
    color: colors.accent,
    marginTop: 8,
  },
  errorWood: {
    color: wood.amber,
  },
});
