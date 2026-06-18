import type { ImageContentPosition } from 'expo-image';

export const images = {
  forestPrimary: require('@/assets/images/forest-bg-primary.jpg'),
  forestSecondary: require('@/assets/images/forest-bg-secondary.jpg'),
  logo: require('@/assets/images/givens-logo.png'),
  toolCordCalculator: require('@/assets/images/tool-cord-calculator.jpg'),
  cordWoodBackground: require('@/assets/images/cord-wood-bg.jpg'),
  toolTreeHeight: require('@/assets/images/tool-tree-height.jpg'),
  toolWildfireRisk: require('@/assets/images/tool-wildfire-risk.png'),
  toolPlantIdentifier: require('@/assets/images/tool-plant-identifier.png'),
} as const;

export const imageFocal = {
  cordCalculator: { top: '38%', left: '50%' } satisfies ImageContentPosition,
  cordWoodBackground: 'center' as const,
  treeHeight: { top: '22%', left: '50%' } satisfies ImageContentPosition,
  wildfireRisk: { top: '40%', left: '50%' } satisfies ImageContentPosition,
  plantIdentifier: { top: '35%', left: '50%' } satisfies ImageContentPosition,
  forestPrimary: 'top' as const,
  forestSecondary: 'center' as const,
} as const;
