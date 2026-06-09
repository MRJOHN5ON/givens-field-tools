import { Link, Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { ScreenSafeArea } from '@/components/ScreenSafeArea';
import { colors } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <ScreenSafeArea style={styles.container}>
        <Text style={styles.title}>Screen not found</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Back to Field Tools</Text>
        </Link>
      </ScreenSafeArea>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Oswald-Bold',
    fontSize: 20,
    letterSpacing: -0.4,
    textTransform: 'uppercase',
    color: colors.text,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    fontFamily: 'Oswald-Regular',
    fontSize: 14,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
});
