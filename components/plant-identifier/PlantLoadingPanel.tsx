import { Image } from 'expo-image';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SurfaceCard } from '@/components/calculator/SurfaceCard';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { plantIdentifier as copy } from '@/constants/content';
import { colors } from '@/constants/theme';

type PlantLoadingPanelProps = {
  previewUri?: string;
  hint?: string | null;
};

export function PlantLoadingPanel({ previewUri, hint }: PlantLoadingPanelProps) {
  return (
    <SurfaceCard>
      <View style={styles.wrap}>
        <View style={styles.stage}>
          {previewUri ? (
            <Image source={{ uri: previewUri }} style={styles.preview} contentFit="cover" />
          ) : (
            <View style={styles.previewPlaceholder} />
          )}
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        </View>
        <Text style={styles.title}>{copy.loadingTitle}</Text>
        <Text style={styles.hint}>{hint || copy.loadingHint}</Text>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  stage: {
    width: 256,
    height: 192,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(143, 169, 143, 0.15)',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 10, 6, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.sectionHeading,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  hint: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
