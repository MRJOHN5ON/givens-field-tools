import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/calculator/PrimaryButton';
import { SurfaceCard } from '@/components/calculator/SurfaceCard';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { plantIdentifier as copy } from '@/constants/content';
import { colors } from '@/constants/theme';

type PlantErrorPanelProps = {
  message: string;
  onTryAgain: () => void;
};

export function PlantErrorPanel({ message, onTryAgain }: PlantErrorPanelProps) {
  return (
    <SurfaceCard variant="action">
      <View style={styles.wrap}>
        <Text style={styles.icon}>⚠</Text>
        <Text style={styles.lead}>{copy.errorLead}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <PrimaryButton label={copy.retry} onPress={onTryAgain} variant="outline" />
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 28,
    color: colors.accent,
    marginBottom: 12,
  },
  lead: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.sectionHeading,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.body,
    lineHeight: ux.lineHeight.body,
    color: 'rgba(240, 237, 232, 0.75)',
    textAlign: 'center',
  },
});
