import React from 'react';
import Svg, { Line, Polygon } from 'react-native-svg';
import { StyleSheet } from 'react-native';
import { colOf, rowOf } from '../../../domain/board';
import type { ChainLink } from '../../../domain/hints';
import type { CellIndex, Digit } from '../../../domain/types';

interface Props {
  links: ChainLink[];
  /** Rendered side length of the (square) board, in px. */
  size: number;
  /** Stroke/fill color for the arrows. */
  color: string;
}

/**
 * Draws chain arrows over the board for a Smart Hint. Each link connects two
 * candidate centers; strong links are solid, weak links dashed, and every link
 * carries an arrowhead at its `to` end. Purely presentational — pointer events
 * pass straight through to the cells beneath.
 */
function ChainOverlayComponent({ links, size, color }: Props) {
  const cell = size / 9;
  const sub = cell / 3;

  // Center of a candidate digit within its cell's 3x3 notes grid.
  const center = (index: CellIndex, digit: Digit) => ({
    x: colOf(index) * cell + (((digit - 1) % 3) + 0.5) * sub,
    y: rowOf(index) * cell + (Math.floor((digit - 1) / 3) + 0.5) * sub,
  });

  // Pull the line back from each candidate so it points at, not through, the
  // badge; size the arrowhead relative to the sub-cell.
  const gap = sub * 0.42;
  const head = sub * 0.5;
  const strokeWidth = Math.max(1.5, size * 0.006);

  return (
    <Svg
      width={size}
      height={size}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {links.map((link, i) => {
        const a = center(link.from.index, link.from.digit);
        const b = center(link.to.index, link.to.digit);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;

        // Shortened endpoints (skip the candidate badges).
        const x1 = a.x + ux * gap;
        const y1 = a.y + uy * gap;
        const x2 = b.x - ux * gap;
        const y2 = b.y - uy * gap;

        // Arrowhead triangle at the `to` end.
        const px = -uy;
        const py = ux;
        const tip = `${x2},${y2}`;
        const left = `${x2 - ux * head + px * head * 0.6},${y2 - uy * head + py * head * 0.6}`;
        const right = `${x2 - ux * head - px * head * 0.6},${y2 - uy * head - py * head * 0.6}`;

        return (
          <React.Fragment key={i}>
            <Line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={link.strong ? undefined : [sub * 0.35, sub * 0.3]}
            />
            <Polygon points={`${tip} ${left} ${right}`} fill={color} />
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

export const ChainOverlay = React.memo(ChainOverlayComponent);
