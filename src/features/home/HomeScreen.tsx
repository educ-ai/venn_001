import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'theme/ThemeContext';

export function HomeScreen(): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>HomeScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
