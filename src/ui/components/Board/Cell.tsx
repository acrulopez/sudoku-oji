import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DIGITS } from '../../../domain/types';
import type { Cell as CellModel, CellIndex } from '../../../domain/types';
import { colOf, rowOf } from '../../../domain/board';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  cell: CellModel;
  index: CellIndex;
  selected: boolean;
  inPeer: boolean;
  sameValue: boolean;
  conflict: boolean;
  onPress: (index: CellIndex) => void;
}

function CellComponent({
  cell,
  index,
  selected,
  inPeer,
  sameValue,
  conflict,
  onPress,
}: Props) {
  const theme = useTheme();
  const c = theme.colors;

  const r = rowOf(index);
  const col = colOf(index);

  let background = c.surface;
  if (sameValue) background = c.sameValue;
  if (inPeer) background = c.highlight;
  if (selected) background = c.selected;

  // Bold separators between 3x3 boxes.
  const borderStyle = {
    borderTopWidth: r % 3 === 0 ? 2 : StyleSheet.hairlineWidth,
    borderLeftWidth: col % 3 === 0 ? 2 : StyleSheet.hairlineWidth,
    borderRightWidth: col === 8 ? 2 : 0,
    borderBottomWidth: r === 8 ? 2 : 0,
    borderTopColor: r % 3 === 0 ? c.gridLineBold : c.gridLine,
    borderLeftColor: col % 3 === 0 ? c.gridLineBold : c.gridLine,
    borderRightColor: c.gridLineBold,
    borderBottomColor: c.gridLineBold,
  };

  const valueColor = selected
    ? '#FFFFFF'
    : conflict
      ? c.error
      : cell.given
        ? c.text
        : c.userValue;

  return (
    <Pressable
      onPress={() => onPress(index)}
      style={[styles.cell, { backgroundColor: background }, borderStyle]}
    >
      {cell.value !== null ? (
        <Text style={[styles.value, { color: valueColor }]}>{cell.value}</Text>
      ) : cell.notes.size > 0 ? (
        <View style={styles.notes}>
          {DIGITS.map((d) => (
            <Text
              key={d}
              style={[
                styles.note,
                {
                  color: selected ? 'rgba(255,255,255,0.85)' : c.note,
                  opacity: cell.notes.has(d) ? 1 : 0,
                },
              ]}
            >
              {d}
            </Text>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { fontSize: 26, fontWeight: '400' },
  notes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    padding: 1,
  },
  note: {
    width: '33.33%',
    height: '33.33%',
    fontSize: 9,
    textAlign: 'center',
  },
});

export const Cell = React.memo(CellComponent);
