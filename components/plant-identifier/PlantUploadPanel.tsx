import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/calculator/PrimaryButton';
import { SurfaceCard } from '@/components/calculator/SurfaceCard';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { plantIdentifier as copy } from '@/constants/content';
import { colors } from '@/constants/theme';
import type { QueuedPhoto } from '@/lib/plant-identifier/types';

type PlantUploadPanelProps = {
  photoQueue: QueuedPhoto[];
  maxPhotos: number;
  onTakePhoto: () => void;
  onPickPhotos: () => void;
  onRemovePhoto: (id: number) => void;
  onIdentify: () => void;
  identifying: boolean;
};

export function PlantUploadPanel({
  photoQueue,
  maxPhotos,
  onTakePhoto,
  onPickPhotos,
  onRemovePhoto,
  onIdentify,
  identifying,
}: PlantUploadPanelProps) {
  const count = photoQueue.length;
  const atMax = count >= maxPhotos;

  const dropzoneTitle =
    count === 0
      ? copy.dropzoneTitleEmpty
      : atMax
        ? copy.dropzoneTitleReady
        : copy.dropzoneTitleMore;

  return (
    <SurfaceCard heading={copy.workspaceHeading}>
      <View style={styles.dropzone}>
        {count === 0 ? <Text style={styles.leafIcon}>🍃</Text> : null}
        <Text style={styles.dropzoneTitle}>{dropzoneTitle}</Text>
        <Text style={styles.lede}>{copy.dropzoneLede}</Text>
        <Text style={styles.sub}>{copy.dropzoneSub}</Text>
        <Text style={styles.sub}>{copy.dropzoneHint}</Text>
        <Text style={styles.note}>{copy.dropzoneNote}</Text>

        {count > 0 ? (
          <View style={styles.queueBlock}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.queueScroll}>
              {photoQueue.map((photo, index) => (
                <View key={photo.id} style={styles.queueItem}>
                  <Image source={{ uri: photo.uri }} style={styles.queueImage} contentFit="cover" />
                  <Pressable
                    onPress={() => onRemovePhoto(photo.id)}
                    style={styles.removeBtn}
                    accessibilityLabel={`Remove photo ${index + 1}`}>
                    <Text style={styles.removeText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
            <Text style={styles.queueCount}>
              {count} of {maxPhotos} photos
            </Text>
          </View>
        ) : null}

        {!atMax ? (
          <View style={styles.actions}>
            <PrimaryButton
              label={count === 0 ? copy.takePhoto : copy.addPhoto}
              onPress={onTakePhoto}
              style={styles.actionBtn}
            />
            <PrimaryButton
              label={count === 0 ? copy.uploadPhotos : copy.addMore}
              onPress={onPickPhotos}
              variant="outline"
              style={styles.actionBtn}
            />
          </View>
        ) : null}

        {count > 0 ? (
          <PrimaryButton
            label={copy.identifyPlant}
            onPress={onIdentify}
            disabled={identifying}
            style={styles.identifyBtn}
          />
        ) : null}
      </View>

      <View style={styles.tips}>
        {copy.tips.map((tip) => (
          <Text key={tip} style={styles.tip}>
            • {tip}
          </Text>
        ))}
      </View>
      <Text style={styles.privacy}>{copy.privacyNote}</Text>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  dropzone: {
    alignItems: 'center',
  },
  leafIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  dropzoneTitle: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.sectionHeading,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 10,
  },
  lede: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.body,
    color: 'rgba(240, 237, 232, 0.85)',
    textAlign: 'center',
    marginBottom: 4,
  },
  sub: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    color: 'rgba(240, 237, 232, 0.65)',
    textAlign: 'center',
    marginBottom: 2,
  },
  note: {
    fontFamily: 'Oswald-Regular',
    fontSize: 11,
    color: 'rgba(240, 237, 232, 0.45)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  queueBlock: {
    width: '100%',
    marginBottom: 12,
  },
  queueScroll: {
    marginBottom: 8,
  },
  queueItem: {
    width: 88,
    height: 66,
    marginRight: 8,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  queueImage: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 18,
    fontFamily: 'Oswald-Bold',
  },
  queueCount: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 0,
  },
  actionBtn: {
    width: '100%',
  },
  identifyBtn: {
    width: '100%',
    marginTop: 4,
  },
  tips: {
    marginTop: 16,
    gap: 6,
  },
  tip: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    color: 'rgba(240, 237, 232, 0.6)',
  },
  privacy: {
    fontFamily: 'Oswald-Regular',
    fontSize: 11,
    color: 'rgba(240, 237, 232, 0.45)',
    marginTop: 12,
    textAlign: 'center',
  },
});
