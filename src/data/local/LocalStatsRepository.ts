import type { KeyValueStore } from '../kv/KeyValueStore';
import type {
  AggregateStats,
  GameEvent,
  StatsRepository,
} from '../repositories/StatsRepository';

const STATS_KEY = 'stats:aggregate';

/**
 * Records events locally and maintains a small aggregate. The same call sites
 * will later target a backend StatsRepository — only the wiring changes.
 */
export class LocalStatsRepository implements StatsRepository {
  constructor(private readonly kv: KeyValueStore) {}

  recordEvent(event: GameEvent & { at: number }): void {
    if (event.type !== 'game_completed') return;
    const stats = this.getStats();
    stats.gamesCompleted += 1;
    const best = stats.bestTimes[event.difficulty];
    if (best === undefined || event.elapsed < best) {
      stats.bestTimes[event.difficulty] = event.elapsed;
    }
    this.kv.set(STATS_KEY, JSON.stringify(stats));
  }

  getStats(): AggregateStats {
    const raw = this.kv.getString(STATS_KEY);
    if (!raw) return { gamesCompleted: 0, bestTimes: {} };
    try {
      return JSON.parse(raw) as AggregateStats;
    } catch {
      return { gamesCompleted: 0, bestTimes: {} };
    }
  }
}
