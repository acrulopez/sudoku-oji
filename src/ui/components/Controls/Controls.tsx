import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ToolProps {
  label: string;
  icon: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  onPress: () => void;
}

function Tool({ label, icon, active, disabled, badge, onPress }: ToolProps) {
  const theme = useTheme();
  const c = theme.colors;
  const color = active ? c.primary : disabled ? c.textMuted : c.text;
  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.tool}>
      <View>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
        {badge !== undefined && (
          <View style={[styles.badge, { backgroundColor: active ? c.primary : c.textMuted }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

interface Props {
  pencilMode: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onErase: () => void;
  onFastPencil: () => void;
  onTogglePencil: () => void;
}

export function Controls({
  pencilMode,
  canUndo,
  onUndo,
  onErase,
  onFastPencil,
  onTogglePencil,
}: Props) {
  return (
    <View style={styles.row}>
      <Tool label="Undo" icon="↶" disabled={!canUndo} onPress={onUndo} />
      <Tool label="Erase" icon="⌫" onPress={onErase} />
      <Tool label="Fast Pencil" icon="✏︎⚡" onPress={onFastPencil} />
      <Tool
        label="Pencil"
        icon="✏︎"
        active={pencilMode}
        badge={pencilMode ? 'ON' : 'OFF'}
        onPress={onTogglePencil}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  tool: { alignItems: 'center', gap: 4, minWidth: 64 },
  icon: { fontSize: 24 },
  label: { fontSize: 13 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -16,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
});
