import store from './app-store.ts'

export const USER_PREFERENCE_KEYS = {
    showChampionDetails: 'championInsight.showDetails',
    hideChampionInsightOnGameStart: 'championInsight.hideOnGameStart',
    championInsightAlwaysOnTop: 'championInsight.alwaysOnTop',
    showAugmentTopOverlay: 'augments.showTopOverlay',
    showAugmentSidePanel: 'augments.showSidePanel',
    showTeammateWinrate: 'teammateWinrate.enabled',
    showLobbyStats: 'lobbyStats.enabled',
    showTeammateParticleEffects: 'teammateWinrate.particleEffects',
    showAramBenchSwap: 'aramBenchSwap.enabled',
}

export function getBooleanPreference(key: string, defaultValue = true): boolean {
    const value = store.get(key)
    if (value == null) {
        return defaultValue
    }

    return value !== false
}

export function shouldShowChampionDetails(): boolean {
    return getBooleanPreference(USER_PREFERENCE_KEYS.showChampionDetails, true)
}

export function shouldHideChampionInsightOnGameStart(): boolean {
    return getBooleanPreference(USER_PREFERENCE_KEYS.hideChampionInsightOnGameStart, true)
}

export function shouldKeepChampionInsightOnTop(): boolean {
    return getBooleanPreference(USER_PREFERENCE_KEYS.championInsightAlwaysOnTop, false)
}

export function shouldShowAugmentTopOverlay(): boolean {
    return getBooleanPreference(USER_PREFERENCE_KEYS.showAugmentTopOverlay, true)
}

export function shouldShowAugmentSidePanel(): boolean {
    return getBooleanPreference(USER_PREFERENCE_KEYS.showAugmentSidePanel, true)
}

export function shouldShowTeammateWinrate(): boolean {
    return getBooleanPreference(USER_PREFERENCE_KEYS.showTeammateWinrate, true)
}

export function shouldShowLobbyStats(): boolean {
    return getBooleanPreference(USER_PREFERENCE_KEYS.showLobbyStats, true)
}

export function shouldShowTeammateParticleEffects(): boolean {
    return getBooleanPreference(USER_PREFERENCE_KEYS.showTeammateParticleEffects, true)
}

export function shouldShowAramBenchSwap(): boolean {
    return getBooleanPreference(USER_PREFERENCE_KEYS.showAramBenchSwap, true)
}
