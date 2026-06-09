import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { colors } from '@/constants/theme';

type SurfaceCardProps = ViewProps & {
  heading?: string;
  headingScale?: 'default' | 'large';
  variant?: 'default' | 'action';
  children: React.ReactNode;
};

const GRADIENTS = {
  default: ['rgba(18, 28, 18, 0.95)', 'rgba(12, 20, 12, 0.98)'] as const,
  action: ['rgba(36, 24, 16, 0.96)', 'rgba(18, 22, 14, 0.98)'] as const,
};

export function SurfaceCard({
  heading,
  headingScale = 'default',
  variant = 'default',
  children,
  style,
  ...props
}: SurfaceCardProps) {
  const isAction = variant === 'action';

  return (
    <View style={[styles.card, isAction && styles.cardAction, style]} {...props}>
      <LinearGradient colors={[...GRADIENTS[variant]]} style={StyleSheet.absoluteFill} />
      {heading ? (
        <Text
          style={[
            styles.heading,
            headingScale === 'large' && styles.headingLarge,
            isAction && styles.headingAction,
          ]}>
          {heading}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(240, 237, 232, 0.12)',
    padding: ux.spacing.cardPadding,
    marginBottom: ux.spacing.fieldGap,
  },
  heading: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.sectionHeading,
    letterSpacing: 1.8,
    color: 'rgba(240, 237, 232, 0.6)',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  headingLarge: {
    fontSize: ux.type.guideTitle,
    letterSpacing: 1.2,
    color: 'rgba(240, 237, 232, 0.78)',
  },
  cardAction: {
    borderColor: 'rgba(232, 83, 26, 0.42)',
    borderWidth: 1.5,
  },
  headingAction: {
    color: colors.text,
  },
});
