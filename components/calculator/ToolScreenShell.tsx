import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { GrainOverlay } from '@/components/GrainOverlay';
import { getScrollBottomPadding, ScreenSafeArea } from '@/components/ScreenSafeArea';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { colors } from '@/constants/theme';

type ToolScreenShellProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function ToolScreenShell({ children, footer }: ToolScreenShellProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#141f14', colors.background, '#0a120a']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <GrainOverlay opacity={0.06} />
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
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: ux.spacing.cardPadding,
    paddingBottom: getScrollBottomPadding(),
  },
});
