import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { calculatorUx as ux } from '@/constants/calculator-ux';

type GuideBlockProps = {
  paragraphs?: readonly string[];
  steps?: readonly string[];
  bullets?: readonly string[];
  tip?: string;
};

export function GuideBlock({ paragraphs, steps, bullets, tip }: GuideBlockProps) {
  return (
    <View style={styles.block}>
      {paragraphs?.map((paragraph) => (
        <Text key={paragraph} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
      {steps?.map((step, index) => (
        <Text key={step} style={styles.step}>
          {index + 1}. {step}
        </Text>
      ))}
      {bullets?.map((bullet) => (
        <Text key={bullet} style={styles.bullet}>
          • {bullet}
        </Text>
      ))}
      {tip ? <Text style={styles.tip}>Tip: {tip}</Text> : null}
    </View>
  );
}

type CollapsibleGuideProps = {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
};

export function CollapsibleGuide({
  title,
  defaultExpanded = false,
  children,
}: CollapsibleGuideProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View style={styles.section}>
      <Pressable
        onPress={() => setExpanded((current) => !current)}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.chevron}>{expanded ? '−' : '+'}</Text>
      </Pressable>
      {expanded ? children : null}
    </View>
  );
}

type FaqListProps = {
  items: readonly { question: string; answer: string }[];
};

export function FaqList({ items }: FaqListProps) {
  return (
    <View style={styles.block}>
      {items.map((item) => (
        <View key={item.question} style={styles.faqItem}>
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Text style={styles.paragraph}>{item.answer}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: ux.touch.minTarget,
    paddingVertical: 10,
  },
  title: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.guideTitle,
    letterSpacing: 0.4,
    color: 'rgba(240, 237, 232, 0.85)',
    textTransform: 'uppercase',
    flex: 1,
    paddingRight: 12,
  },
  chevron: {
    fontFamily: 'Oswald-Bold',
    fontSize: 22,
    color: '#E8531A',
    lineHeight: 24,
    minWidth: 28,
    textAlign: 'center',
  },
  block: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  paragraph: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.body,
    lineHeight: ux.lineHeight.body,
    color: 'rgba(240, 237, 232, 0.72)',
    marginBottom: 12,
  },
  step: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.body,
    lineHeight: ux.lineHeight.body,
    color: 'rgba(240, 237, 232, 0.72)',
    marginBottom: 10,
    paddingLeft: 2,
  },
  bullet: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    color: 'rgba(240, 237, 232, 0.65)',
    marginBottom: 8,
    paddingLeft: 4,
  },
  tip: {
    fontFamily: 'Oswald-Regular',
    fontSize: ux.type.bodySmall,
    lineHeight: ux.lineHeight.bodySmall,
    fontStyle: 'italic',
    color: 'rgba(232, 83, 26, 0.9)',
    marginTop: 6,
  },
  faqItem: {
    marginBottom: 14,
  },
  faqQuestion: {
    fontFamily: 'Oswald-Bold',
    fontSize: ux.type.bodySmall,
    letterSpacing: 0.2,
    color: 'rgba(240, 237, 232, 0.85)',
    marginBottom: 6,
    lineHeight: ux.lineHeight.bodySmall,
  },
});
