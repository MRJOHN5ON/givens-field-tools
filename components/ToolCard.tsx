import { Image, type ImageContentPosition, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

type ToolCardProps = {
  title: string;
  description: string;
  route: string;
  image: ImageSource;
  contentPosition?: ImageContentPosition;
  tall?: boolean;
  style?: object;
};

const TILE_HEIGHT = {
  standard: 232,
  tall: 256,
} as const;

export function ToolCard({
  title,
  description,
  route,
  image,
  contentPosition = 'center',
  tall = false,
  style,
}: ToolCardProps) {
  const router = useRouter();
  const height = tall ? TILE_HEIGHT.tall : TILE_HEIGHT.standard;

  return (
    <Pressable
      onPress={() => router.push(route as '/cord-calculator' | '/tree-height')}
      style={({ pressed }) => [
        styles.tile,
        styles.tileShadow,
        { height },
        style,
        pressed && styles.pressed,
      ]}>
      <View style={styles.media}>
        <Image
          source={image}
          style={styles.image}
          contentFit="cover"
          contentPosition={contentPosition}
          transition={200}
        />
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(6, 10, 6, 0.55)', 'rgba(6, 10, 6, 0.97)']}
        locations={[0.35, 0.7, 1]}
        style={styles.footerPanel}
        pointerEvents="none">
        <View style={styles.footerRow}>
          <View style={styles.copy}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'rgba(240, 237, 232, 0.1)',
  },
  tileShadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.38,
      shadowRadius: 18,
    },
    android: {
      elevation: 10,
    },
    default: {
      boxShadow: '0 10px 28px rgba(0, 0, 0, 0.45)',
    },
  }),
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.988 }],
  },
  media: {
    ...StyleSheet.absoluteFill,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footerPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 108,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 36,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontFamily: 'Oswald-Bold',
    fontSize: 22,
    letterSpacing: -0.7,
    color: colors.text,
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: 'Oswald-Regular',
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.15,
    color: 'rgba(240, 237, 232, 0.78)',
    marginTop: 5,
  },
  chevron: {
    fontFamily: 'Oswald-Regular',
    fontSize: 30,
    lineHeight: 30,
    color: colors.accent,
    marginBottom: 2,
  },
});
