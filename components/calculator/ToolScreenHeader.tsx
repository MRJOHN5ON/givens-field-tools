import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { images } from '@/constants/images';
import { colors } from '@/constants/theme';
import { wood } from '@/constants/wood-theme';

type ToolScreenHeaderProps = {
  title: string;
  subtitle: string;
  variant?: 'default' | 'wood';
};

export function ToolScreenHeader({
  title,
  subtitle,
  variant = 'default',
}: ToolScreenHeaderProps) {
  const router = useRouter();
  const isWood = variant === 'wood';

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => router.back()} style={styles.back} hitSlop={16}>
        <Text style={styles.backText}>← BACK</Text>
      </Pressable>

      <View style={[styles.card, isWood && styles.cardWood]}>
        <LinearGradient
          colors={
            isWood
              ? [...wood.headerGradient]
              : ['rgba(12, 20, 12, 0.92)', 'rgba(10, 18, 10, 0.96)']
          }
          style={StyleSheet.absoluteFill}
        />
        <Image
          source={images.logo}
          style={styles.logo}
          contentFit="contain"
          contentPosition="center"
        />
        <Text style={[styles.title, isWood && styles.titleWood]}>{title}</Text>
        <View style={[styles.rule, isWood && styles.ruleWood]} />
        <Text style={[styles.subtitle, isWood && styles.subtitleWood]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 24,
    paddingTop: 4,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: 14,
    minHeight: ux.touch.minTarget,
    justifyContent: 'center',
  },
  backText: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.back,
    letterSpacing: 1.2,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(240, 237, 232, 0.12)',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    alignItems: 'center',
  },
  cardWood: {
    borderColor: wood.border,
  },
  logo: {
    width: 168,
    height: 58,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.screenTitle,
    letterSpacing: -0.7,
    color: colors.text,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  titleWood: {
    color: wood.text,
  },
  rule: {
    width: 32,
    height: 2,
    backgroundColor: colors.accent,
    marginVertical: 12,
  },
  ruleWood: {
    backgroundColor: wood.oak,
    width: 40,
  },
  subtitle: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.screenSubtitle,
    lineHeight: ux.lineHeight.subtitle,
    color: 'rgba(240, 237, 232, 0.75)',
    textAlign: 'center',
    maxWidth: 320,
  },
  subtitleWood: {
    color: wood.textMuted,
  },
});
