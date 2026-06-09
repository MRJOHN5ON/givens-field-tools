import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';

type GrainOverlayProps = {
  opacity?: number;
  style?: StyleProp<ImageStyle>;
};

export function GrainOverlay({ opacity = 0.35, style }: GrainOverlayProps) {
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      <Image
        source={require('@/assets/images/grain.png')}
        style={[StyleSheet.absoluteFill, { opacity }, style]}
        resizeMode="repeat"
      />
    </View>
  );
}
