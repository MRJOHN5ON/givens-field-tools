import { StyleSheet, Text, View } from 'react-native';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { colors } from '@/constants/theme';
import { wood } from '@/constants/wood-theme';

type EmptyStateHintProps = {
  message: string;
  tone?: 'default' | 'wood';
};

export function EmptyStateHint({ message, tone = 'default' }: EmptyStateHintProps) {
  const isWood = tone === 'wood';

  return (
    <View style={[styles.wrap, isWood && styles.wrapWood]}>
      <Text style={[styles.text, isWood && styles.textWood]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(240, 237, 232, 0.14)',
    backgroundColor: 'rgba(12, 20, 12, 0.65)',
    paddingHorizontal: ux.spacing.cardPadding,
    paddingVertical: 16,
    marginBottom: ux.spacing.fieldGap,
  },
  wrapWood: {
    borderColor: wood.borderMuted,
    backgroundColor: 'rgba(26, 18, 12, 0.55)',
  },
  text: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: 'rgba(240, 237, 232, 0.65)',
    textAlign: 'center',
  },
  textWood: {
    color: wood.textMuted,
  },
});
