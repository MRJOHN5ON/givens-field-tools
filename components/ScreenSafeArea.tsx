import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SCREEN_BOTTOM_BUFFER, SCREEN_SCROLL_BOTTOM_PADDING } from '@/constants/layout';

type ScreenSafeAreaProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

/** Applies top + bottom system insets app-wide. */
export function ScreenSafeArea({ children, style }: ScreenSafeAreaProps) {
  return (
    <SafeAreaView style={[styles.safe, style]} edges={['top', 'bottom']}>
      {children}
    </SafeAreaView>
  );
}

export function getScrollBottomPadding(extra = SCREEN_SCROLL_BOTTOM_PADDING): number {
  return SCREEN_BOTTOM_BUFFER + extra;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});
