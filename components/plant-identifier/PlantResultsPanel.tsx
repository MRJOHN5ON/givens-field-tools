import { Image } from 'expo-image';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/calculator/PrimaryButton';
import { SurfaceCard } from '@/components/calculator/SurfaceCard';
import { PlantResultCard } from '@/components/plant-identifier/PlantResultCard';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { contact, plantIdentifier as copy } from '@/constants/content';
import { colors } from '@/constants/theme';
import { ctaVariantForRisk } from '@/lib/plant-identifier/theme';
import type { CtaConfig, ProcessedMatch } from '@/lib/plant-identifier/types';

type PlantResultsPanelProps = {
  results: ProcessedMatch[];
  resultPhotos: string[];
  cta: CtaConfig | null;
  onTryAgain: () => void;
};

export function PlantResultsPanel({ results, resultPhotos, cta, onTryAgain }: PlantResultsPanelProps) {
  const ctaVariant = cta ? ctaVariantForRisk(cta.risk) : 'moderate';

  return (
    <View>
      <SurfaceCard>
        <Text style={styles.eyebrow}>{copy.resultsEyebrow}</Text>
        <Text style={styles.heading}>{copy.resultsHeading}</Text>

        {resultPhotos.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photos}>
            {resultPhotos.map((uri, index) => (
              <Image
                key={`${uri}-${index}`}
                source={{ uri }}
                style={styles.photo}
                contentFit="cover"
              />
            ))}
          </ScrollView>
        ) : null}

        {results.map((match) => (
          <PlantResultCard key={`${match.rank}-${match.commonName}`} match={match} />
        ))}
      </SurfaceCard>

      {cta ? (
        <Pressable
          onPress={() => Linking.openURL(`tel:${contact.phoneRaw}`)}
          style={[
            styles.cta,
            ctaVariant === 'high' && styles.ctaHigh,
            ctaVariant === 'moderate' && styles.ctaModerate,
            ctaVariant === 'low' && styles.ctaLow,
          ]}>
          <Text style={styles.ctaKicker}>{copy.ctaKicker}</Text>
          <Text style={styles.ctaLead}>{cta.lead}</Text>
          <Text style={styles.ctaAction}>{cta.action} →</Text>
        </Pressable>
      ) : null}

      <PrimaryButton label={copy.tryAgain} onPress={onTryAgain} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: 'Oswald-Bold',
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.accent,
    marginBottom: 4,
  },
  heading: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.guideTitle,
    color: colors.text,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  photos: {
    marginBottom: 16,
  },
  photo: {
    width: 120,
    height: 90,
    borderRadius: 6,
    marginRight: 8,
  },
  cta: {
    borderRadius: 10,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 12,
  },
  ctaHigh: {
    borderColor: 'rgba(232, 83, 26, 0.55)',
    backgroundColor: 'rgba(232, 83, 26, 0.1)',
  },
  ctaModerate: {
    borderColor: 'rgba(212, 160, 23, 0.55)',
    backgroundColor: 'rgba(212, 160, 23, 0.1)',
  },
  ctaLow: {
    borderColor: 'rgba(107, 158, 107, 0.55)',
    backgroundColor: 'rgba(107, 158, 107, 0.1)',
  },
  ctaKicker: {
    fontFamily: 'Oswald-Bold',
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: 6,
  },
  ctaLead: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.body,
    color: colors.text,
    marginBottom: 4,
  },
  ctaAction: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.button,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
