import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { GrainOverlay } from '@/components/GrainOverlay';
import { getScrollBottomPadding, ScreenSafeArea } from '@/components/ScreenSafeArea';
import { imageFocal, images } from '@/constants/images';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { wood } from '@/constants/wood-theme';

type CordCalculatorShellProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function CordCalculatorShell({ children, footer }: CordCalculatorShellProps) {
  return (
    <View style={styles.root}>
      <Image
        source={images.cordWoodBackground}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition={imageFocal.cordWoodBackground}
      />
      <LinearGradient
        colors={[
          'rgba(22, 15, 9, 0.42)',
          'rgba(18, 12, 7, 0.62)',
          'rgba(14, 10, 6, 0.82)',
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(14, 10, 6, 0.35)', 'transparent', 'rgba(14, 10, 6, 0.35)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <GrainOverlay opacity={0.05} />
      <ScreenSafeArea>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          {footer}
        </KeyboardAvoidingView>
      </ScreenSafeArea>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: wood.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: ux.spacing.cardPadding,
    paddingBottom: getScrollBottomPadding(),
  },
});
