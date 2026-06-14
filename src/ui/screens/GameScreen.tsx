import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { canUndo as historyCanUndo } from '../../domain/history';
import { useGameStore } from '../../state/gameStore';
import { useSettingsStore } from '../../state/settingsStore';
import { remainingCounts } from '../../state/selectors';
import { useGameTimer } from '../hooks/useGameTimer';
import { useTheme } from '../theme/ThemeProvider';
import { Board } from '../components/Board/Board';
import { Controls } from '../components/Controls/Controls';
import { GameHeader } from '../components/Header/GameHeader';
import { NumberPad } from '../components/NumberPad/NumberPad';

export function GameScreen() {
  const router = useRouter();
  const theme = useTheme();
  const c = theme.colors;
  const insets = useSafeAreaInsets();
  useGameTimer();

  const s = useGameStore();
  const maxMistakes = useSettingsStore((st) => st.maxMistakes);

  if (!s.puzzle) {
    // No active game (e.g. deep link) — bounce home.
    return (
      <View style={[styles.flex, styles.center, { backgroundColor: c.background }]}>
        <Pressable onPress={() => router.replace('/')}>
          <Text style={{ color: c.primary, fontSize: 16 }}>Back to menu</Text>
        </Pressable>
      </View>
    );
  }

  const paused = s.status === 'paused';
  const remaining = remainingCounts(s.board);
  const activeValue =
    s.selectedDigit ?? (s.selectedIndex !== null ? s.board[s.selectedIndex].value : null);

  const overlayText = s.status === 'won' ? 'Solved! 🎉' : s.status === 'lost' ? 'Out of mistakes' : null;

  return (
    <View
      style={[
        styles.flex,
        { backgroundColor: c.background, paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <GameHeader
        difficulty={s.difficulty}
        mistakes={s.mistakes}
        maxMistakes={maxMistakes}
        elapsed={s.elapsed}
        paused={paused}
        fastMode={s.fastMode}
        onBack={() => router.replace('/')}
        onTogglePause={() => s.setPaused(!paused)}
        onToggleFastMode={s.toggleFastMode}
      />

      <View style={styles.boardWrap}>
        {paused ? (
          <Pressable
            onPress={() => s.setPaused(false)}
            style={[styles.pausedBox, { backgroundColor: c.surface, borderColor: c.gridLine }]}
          >
            <Text style={{ color: c.textMuted, fontSize: 18 }}>Paused — tap to resume</Text>
          </Pressable>
        ) : (
          <Board
            board={s.board}
            selectedIndex={s.selectedIndex}
            activeValue={activeValue}
            onCellPress={s.selectCell}
          />
        )}

        {overlayText && (
          <View style={[styles.overlay, { backgroundColor: c.surface, borderColor: c.gridLine }]}>
            <Text style={[styles.overlayText, { color: c.text }]}>{overlayText}</Text>
            <Pressable
              onPress={() => router.replace('/')}
              style={[styles.overlayBtn, { backgroundColor: c.primary }]}
            >
              <Text style={styles.overlayBtnText}>New game</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        <Controls
          pencilMode={s.pencilMode}
          canUndo={historyCanUndo(s.history)}
          onUndo={s.undo}
          onErase={s.erase}
          onFastPencil={s.fastPencil}
          onTogglePencil={s.togglePencil}
        />
        <NumberPad remaining={remaining} activeDigit={s.selectedDigit} onPress={s.pressDigit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  boardWrap: { paddingHorizontal: 8, marginTop: 12 },
  pausedBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 8,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  overlayText: { fontSize: 28, fontWeight: '800' },
  overlayBtn: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28 },
  overlayBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  bottom: { marginTop: 'auto', paddingHorizontal: 8, paddingBottom: 8 },
});
