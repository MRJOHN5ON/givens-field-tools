import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { calculatorUx as ux } from '@/constants/calculator-ux';
import { colors } from '@/constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
  style?: object;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'solid',
  style,
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 18, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18, stiffness: 320 });
      }}
      style={[
        styles.base,
        variant === 'solid' ? styles.solid : styles.outline,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}>
      <Text
        style={[
          styles.label,
          variant === 'outline' ? styles.labelOutline : styles.labelSolid,
        ]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    minHeight: ux.touch.buttonMinHeight,
    paddingHorizontal: 22,
    marginBottom: ux.spacing.fieldGap,
  },
  solid: {
    backgroundColor: colors.accent,
  },
  outline: {
    backgroundColor: 'rgba(232, 83, 26, 0.08)',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.button,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  labelSolid: {
    color: colors.text,
  },
  labelOutline: {
    color: colors.accent,
  },
});
