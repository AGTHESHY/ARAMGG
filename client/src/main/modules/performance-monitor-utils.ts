const DEFAULT_SAMPLE_INTERVAL_MS = 10000
const MIN_SAMPLE_INTERVAL_MS = 5000
const MAX_SAMPLE_INTERVAL_MS = 60000

export function resolvePerformanceSampleInterval(rawValue: unknown): number {
    const parsed = Number(rawValue)
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return DEFAULT_SAMPLE_INTERVAL_MS
    }

    return Math.min(MAX_SAMPLE_INTERVAL_MS, Math.max(MIN_SAMPLE_INTERVAL_MS, Math.round(parsed)))
}
