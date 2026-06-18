import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CTABanner } from '@/components/CTABanner';
import { ToolScreenHeader } from '@/components/calculator/ToolScreenHeader';
import { ToolScreenShell } from '@/components/calculator/ToolScreenShell';
import { CollapsibleGuide, GuideBlock } from '@/components/calculator/ToolGuide';
import { PlantErrorPanel } from '@/components/plant-identifier/PlantErrorPanel';
import { PlantFlowSteps } from '@/components/plant-identifier/PlantFlowSteps';
import { PlantLoadingPanel } from '@/components/plant-identifier/PlantLoadingPanel';
import { PlantResultsPanel } from '@/components/plant-identifier/PlantResultsPanel';
import { PlantSidebar } from '@/components/plant-identifier/PlantSidebar';
import { PlantUploadPanel } from '@/components/plant-identifier/PlantUploadPanel';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { plantIdentifier as copy } from '@/constants/content';
import { plantIdentifierGuide } from '@/constants/tool-education';
import { usePlantIdentifier } from '@/hooks/usePlantIdentifier';
import { PLANT_IDENTIFIER_CONFIG } from '@/lib/plant-identifier/config';
import { colors } from '@/constants/theme';

export default function PlantIdentifierScreen() {
  const router = useRouter();
  const {
    view,
    photoQueue,
    results,
    resultPhotos,
    cta,
    error,
    loadingHint,
    quotaRemaining,
    identifying,
    maxPhotos,
    takePhoto,
    pickPhotos,
    removePhoto,
    identify,
    resetFresh,
    retryFromError,
  } = usePlantIdentifier();

  const showQuota =
    typeof quotaRemaining === 'number' &&
    quotaRemaining >= 0 &&
    quotaRemaining <= PLANT_IDENTIFIER_CONFIG.quotaWarnThreshold;

  return (
    <ToolScreenShell>
      <ToolScreenHeader title={copy.title} subtitle={copy.subtitle} />

      <PlantFlowSteps />

      {view === 'upload' ? (
        <PlantUploadPanel
          photoQueue={photoQueue}
          maxPhotos={maxPhotos}
          onTakePhoto={takePhoto}
          onPickPhotos={pickPhotos}
          onRemovePhoto={removePhoto}
          onIdentify={identify}
          identifying={identifying}
        />
      ) : null}

      {view === 'loading' ? (
        <PlantLoadingPanel
          previewUri={photoQueue[0]?.uri || resultPhotos[0]}
          hint={loadingHint}
        />
      ) : null}

      {view === 'results' ? (
        <PlantResultsPanel
          results={results}
          resultPhotos={resultPhotos}
          cta={cta}
          onTryAgain={resetFresh}
        />
      ) : null}

      {view === 'error' && error ? (
        <PlantErrorPanel message={error} onTryAgain={retryFromError} />
      ) : null}

      {view !== 'loading' ? <PlantSidebar /> : null}

      {showQuota ? (
        <Text style={styles.quota}>
          {quotaRemaining === 0
            ? 'Daily identification limit reached — check back tomorrow.'
            : `${quotaRemaining} identifications left today on our shared quota.`}
        </Text>
      ) : null}

      <Text style={styles.disclaimer}>{copy.disclaimer}</Text>

      {view === 'upload' ? (
        <Text style={styles.crosslink}>
          Also try our{' '}
          <Text style={styles.crosslinkAccent} onPress={() => router.push('/wildfire-risk')}>
            Wildfire Risk Calculator
          </Text>
          ,{' '}
          <Text style={styles.crosslinkAccent} onPress={() => router.push('/tree-height')}>
            Tree Height Calculator
          </Text>
          , and{' '}
          <Text style={styles.crosslinkAccent} onPress={() => router.push('/cord-calculator')}>
            Firewood Cord Calculator
          </Text>
          .
        </Text>
      ) : null}

      <CollapsibleGuide title={copy.guideHeading}>
        <GuideBlock steps={plantIdentifierGuide.overview.steps} />
      </CollapsibleGuide>
      <CollapsibleGuide title={plantIdentifierGuide.privacy.title}>
        <GuideBlock paragraphs={plantIdentifierGuide.privacy.paragraphs} />
      </CollapsibleGuide>

      <CTABanner quiet />
    </ToolScreenShell>
  );
}

const styles = StyleSheet.create({
  quota: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 12,
  },
  disclaimer: {
    fontFamily: 'Oswald-Regular',
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(240, 237, 232, 0.45)',
    textAlign: 'center',
    marginBottom: 12,
  },
  crosslink: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: 'rgba(240, 237, 232, 0.55)',
    textAlign: 'center',
    marginBottom: 16,
  },
  crosslinkAccent: {
    color: colors.accent,
    fontFamily: 'Oswald-Bold',
  },
});
