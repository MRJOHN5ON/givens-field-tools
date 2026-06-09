import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { wood } from '@/constants/wood-theme';

type WoodSurfaceCardProps = ViewProps & {
  heading?: string;
  children: React.ReactNode;
};

export function WoodSurfaceCard({ heading, children, style, ...props }: WoodSurfaceCardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      <LinearGradient colors={[...wood.cardGradient]} style={StyleSheet.absoluteFill} />
      <View style={styles.plankAccent} />
      {heading ? <Text style={styles.heading}>{heading}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: wood.border,
    padding: ux.spacing.cardPadding,
    marginBottom: ux.spacing.fieldGap,
  },
  plankAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: wood.oak,
    opacity: 0.45,
  },
  heading: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.sectionHeading,
    letterSpacing: 1.8,
    color: wood.oak,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
});
