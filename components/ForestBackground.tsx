import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { imageFocal, images } from '@/constants/images';

type ForestBackgroundProps = ViewProps & {
  children?: React.ReactNode;
};

export function ForestBackground({ children, style, ...props }: ForestBackgroundProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <Image
        source={images.forestPrimary}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition={imageFocal.forestPrimary}
      />
      <Image
        source={images.forestSecondary}
        style={[StyleSheet.absoluteFill, styles.secondaryForest]}
        contentFit="cover"
        contentPosition={imageFocal.forestSecondary}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.15)', 'rgba(15,26,15,0.88)']}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(15,26,15,0.55)', 'transparent', 'rgba(15,26,15,0.55)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', 'rgba(15,26,15,0.98)']}
        locations={[0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1A0F',
  },
  secondaryForest: {
    opacity: 0.32,
  },
});
