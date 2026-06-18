import { StyleSheet, Text, View } from 'react-native';
import { SurfaceCard } from '@/components/calculator/SurfaceCard';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { plantIdentifier as copy } from '@/constants/content';
import { colors } from '@/constants/theme';

export function PlantSidebar() {
  return (
    <View>
      <SurfaceCard heading={copy.speciesLibraryHeading}>
        <Text style={styles.lede}>{copy.speciesLibraryLede}</Text>
        {copy.speciesLibraryTopics.map((topic) => (
          <Text key={topic} style={styles.topic}>
            • {topic}
          </Text>
        ))}
      </SurfaceCard>

      <SurfaceCard heading={copy.fieldTipsHeading}>
        {copy.fieldTips.map((tip) => (
          <Text key={tip} style={styles.tip}>
            • {tip}
          </Text>
        ))}
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  lede: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: 'rgba(240, 237, 232, 0.72)',
    marginBottom: 12,
  },
  topic: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    color: 'rgba(240, 237, 232, 0.65)',
    marginBottom: 6,
  },
  tip: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: 'rgba(240, 237, 232, 0.65)',
    marginBottom: 8,
  },
});
