import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { brand, home } from '@/constants/content';
import { images } from '@/constants/images';
import { colors } from '@/constants/theme';

export function HomeHero() {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(10, 18, 10, 0.78)', 'rgba(12, 20, 12, 0.9)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inner}>
        <Image
          source={images.logo}
          style={styles.logo}
          contentFit="contain"
          contentPosition="center"
        />
        <Text style={styles.serviceLine}>{brand.tagline}</Text>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>{home.title}</Text>
        <Text style={styles.tagline}>{home.tagline}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 28,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(240, 237, 232, 0.14)',
  },
  inner: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 26,
  },
  logo: {
    width: 168,
    height: 58,
    marginBottom: 14,
  },
  serviceLine: {
    fontFamily: 'Oswald-Regular',
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: 'rgba(240, 237, 232, 0.82)',
    textAlign: 'center',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.accent,
    marginTop: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Oswald-Bold',
    fontSize: 30,
    letterSpacing: -0.8,
    textTransform: 'uppercase',
    color: colors.text,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'Oswald-Light',
    fontSize: 14,
    fontStyle: 'italic',
    letterSpacing: 0.3,
    color: 'rgba(240, 237, 232, 0.72)',
    textAlign: 'center',
    marginTop: 6,
  },
});
