import { LinearGradient } from 'expo-linear-gradient';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { cta, contact } from '@/constants/content';
import { colors } from '@/constants/theme';

type CTABannerProps = {
  quiet?: boolean;
};

export function CTABanner({ quiet = false }: CTABannerProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${contact.phoneRaw}`);
  };

  const handleVisitSite = () => {
    Linking.openURL(contact.siteUrl);
  };

  return (
    <View style={[styles.container, quiet && styles.containerQuiet]}>
      <LinearGradient
        colors={['rgba(12, 20, 12, 0.88)', 'rgba(10, 18, 10, 0.94)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.inner, quiet && styles.innerQuiet]}>
        <Text style={[styles.banner, quiet && styles.bannerQuiet]}>{cta.banner}</Text>
        <Pressable onPress={handleCall} style={styles.callBlock}>
          <Text style={[styles.callAction, quiet && styles.callActionQuiet]}>
            {cta.callToAction}
          </Text>
          <Text style={[styles.phone, quiet && styles.phoneQuiet]}>{contact.phone}</Text>
        </Pressable>
        <Pressable onPress={handleVisitSite} style={styles.siteButton}>
          <Text style={styles.siteLink}>{contact.siteLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(240, 237, 232, 0.1)',
  },
  containerQuiet: {
    marginTop: 8,
    borderColor: 'rgba(240, 237, 232, 0.07)',
    opacity: 0.88,
  },
  inner: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  innerQuiet: {
    paddingVertical: 12,
  },
  banner: {
    fontFamily: 'Oswald-Bold',
    fontSize: 12,
    letterSpacing: 1.2,
    color: 'rgba(240, 237, 232, 0.85)',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  bannerQuiet: {
    fontSize: 10,
    letterSpacing: 1.4,
    color: 'rgba(240, 237, 232, 0.55)',
  },
  callBlock: {
    alignItems: 'center',
    marginTop: 10,
  },
  callAction: {
    fontFamily: 'Oswald-Bold',
    fontSize: 15,
    letterSpacing: -0.3,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  callActionQuiet: {
    fontSize: 12,
    color: 'rgba(232, 83, 26, 0.8)',
  },
  phone: {
    fontFamily: 'Oswald-Bold',
    fontSize: 20,
    letterSpacing: 0.4,
    color: colors.text,
    marginTop: 2,
  },
  phoneQuiet: {
    fontSize: 16,
    color: 'rgba(240, 237, 232, 0.75)',
  },
  siteButton: {
    marginTop: 12,
    paddingVertical: 4,
  },
  siteLink: {
    fontFamily: 'Oswald-Regular',
    fontSize: 10,
    letterSpacing: 1.6,
    color: 'rgba(240, 237, 232, 0.5)',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
