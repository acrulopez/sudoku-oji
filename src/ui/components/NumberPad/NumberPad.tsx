import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DIGITS } from '../../../domain/types';
import type { Digit } from '../../../domain/types';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  remaining: Record<Digit, number>;
  activeDigit: Digit | null;
  onPress: (digit: Digit) => void;
}

export function NumberPad({ remaining, activeDigit, onPress }: Props) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <View style={styles.row}>
      {DIGITS.map((d) => {
        const done = remaining[d] === 0;
        const active = activeDigit === d;
        return (
          <Pressable
            key={d}
            disabled={done}
            onPress={() => onPress(d)}
            style={styles.button}
          >
            <Text
              style={[
                styles.digit,
                { color: active ? c.primary : done ? c.textMuted : c.text },
                done && styles.faded,
              ]}
            >
              {d}
            </Text>
            {!done && (
              <Text style={[styles.count, { color: c.textMuted }]}>
                {remaining[d]}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  button: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  digit: { fontSize: 34, fontWeight: '400' },
  faded: { opacity: 0.35 },
  count: { fontSize: 12, marginTop: -2 },
});
