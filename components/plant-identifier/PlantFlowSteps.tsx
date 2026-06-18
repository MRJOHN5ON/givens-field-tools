import { StyleSheet, Text, View } from 'react-native';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { colors } from '@/constants/theme';

const STEPS = [
  {
    id: 'photo',
    title: '1. Photo',
    body: 'Leaves, bark, or the whole plant',
  },
  {
    id: 'identify',
    title: '2. Identify',
    body: 'Top species matches with confidence',
  },
  {
    id: 'notes',
    title: '3. Fire notes',
    body: 'Montana risk, invasives & mitigation',
  },
] as const;

export function PlantFlowSteps() {
  return (
    <View style={styles.wrap}>
      {STEPS.map((step) => (
        <View key={step.id} style={styles.step}>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.body}>{step.body}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  step: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(143, 169, 143, 0.08)',
  },
  title: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    letterSpacing: 0.4,
    color: colors.accent,
    marginBottom: 4,
  },
  body: {
    fontFamily: 'Oswald-Regular',
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(240, 237, 232, 0.68)',
  },
});
