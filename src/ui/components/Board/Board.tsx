import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SIDE } from '../../../domain/board';
import type { Board as BoardModel, CellIndex, Digit } from '../../../domain/types';
import { computeHighlights } from '../../../state/selectors';
import { useTheme } from '../../theme/ThemeProvider';
import { Cell } from './Cell';

interface Props {
  board: BoardModel;
  selectedIndex: CellIndex | null;
  activeValue: Digit | null;
  onCellPress: (index: CellIndex) => void;
}

export function Board({ board, selectedIndex, activeValue, onCellPress }: Props) {
  const theme = useTheme();
  const { peers, sameValue, conflicts } = useMemo(
    () => computeHighlights(board, selectedIndex, activeValue),
    [board, selectedIndex, activeValue],
  );

  return (
    <View style={[styles.grid, { borderColor: theme.colors.gridLineBold }]}>
      {Array.from({ length: SIDE }).map((_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: SIDE }).map((_, col) => {
            const index = row * SIDE + col;
            return (
              <Cell
                key={index}
                cell={board[index]}
                index={index}
                selected={selectedIndex === index}
                inPeer={selectedIndex !== index && peers.has(index)}
                sameValue={selectedIndex !== index && sameValue.has(index)}
                conflict={conflicts.has(index)}
                onPress={onCellPress}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { width: '100%', aspectRatio: 1 },
  row: { flexDirection: 'row', flex: 1 },
});
