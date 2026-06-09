import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CTABanner } from '@/components/CTABanner';
import { ForestBackground } from '@/components/ForestBackground';
import { GrainOverlay } from '@/components/GrainOverlay';
import { HomeHero } from '@/components/HomeHero';
import { getScrollBottomPadding, ScreenSafeArea } from '@/components/ScreenSafeArea';
import { ToolCard } from '@/components/ToolCard';
import { contact, home, tools } from '@/constants/content';
import { imageFocal, images } from '@/constants/images';

export default function HomeScreen() {
  return (
    <ForestBackground>
      <ScreenSafeArea>
        <GrainOverlay opacity={0.07} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <HomeHero />

          <View style={styles.toolsBlock}>
            <Text style={styles.toolsLabel}>{home.toolsHeading}</Text>
            <ToolCard
              title={tools.cordCalculator.title}
              description={tools.cordCalculator.description}
              route={tools.cordCalculator.route}
              image={images.toolCordCalculator}
              contentPosition={imageFocal.cordCalculator}
              tall
              style={styles.tileSpacing}
            />
            <ToolCard
              title={tools.treeHeight.title}
              description={tools.treeHeight.description}
              route={tools.treeHeight.route}
              image={images.toolTreeHeight}
              contentPosition={imageFocal.treeHeight}
              tall
              style={styles.tileSpacing}
            />
            <ToolCard
              title={tools.wildfireRisk.title}
              description={tools.wildfireRisk.description}
              route={tools.wildfireRisk.route}
              image={images.toolWildfireRisk}
              contentPosition={imageFocal.wildfireRisk}
            />
          </View>

          <CTABanner />

          <Pressable
            onPress={() => Linking.openURL(contact.privacyPolicyUrl)}
            style={styles.privacyLink}
            accessibilityRole="link">
            <Text style={styles.privacyLinkText}>{home.privacyLabel}</Text>
          </Pressable>
        </ScrollView>
      </ScreenSafeArea>
    </ForestBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: getScrollBottomPadding(),
    paddingTop: 10,
  },
  toolsBlock: {
    marginTop: 4,
  },
  toolsLabel: {
    fontFamily: 'Oswald-Bold',
    fontSize: 10,
    letterSpacing: 2.4,
    color: 'rgba(240, 237, 232, 0.55)',
    textTransform: 'uppercase',
    marginBottom: 12,
    textAlign: 'center',
  },
  tileSpacing: {
    marginBottom: 16,
  },
  privacyLink: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  privacyLinkText: {
    fontFamily: 'Oswald-Regular',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(240, 237, 232, 0.45)',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(240, 237, 232, 0.25)',
  },
});
