import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSettingsStore } from '../../../state/settingsStore';
import { THEMES } from '../../theme/themes';
import { useTheme } from '../../theme/ThemeProvider';

export function ThemePicker() {
  const theme = useTheme();
  const themeKey = useSettingsStore((s) => s.themeKey);
  const setThemeKey = useSettingsStore((s) => s.setThemeKey);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.textMuted }]}>Theme</Text>
      <View style={styles.row}>
        {THEMES.map((t) => {
          const selected = t.key === themeKey;
          return (
            <Pressable
              key={t.key}
              onPress={() => setThemeKey(t.key)}
              style={[
                styles.swatch,
                {
                  backgroundColor: t.colors.background,
                  borderColor: selected ? t.colors.primary : t.colors.gridLine,
                  borderWidth: selected ? 3 : 1,
                },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: t.colors.primary }]} />
              <Text style={[styles.name, { color: t.colors.text }]}>{t.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  title: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: {
    width: 96,
    height: 64,
    borderRadius: 12,
    padding: 8,
    justifyContent: 'space-between',
  },
  dot: { width: 16, height: 16, borderRadius: 8 },
  name: { fontSize: 12, fontWeight: '600' },
});
