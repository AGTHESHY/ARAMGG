import { computed, ref, unref, type MaybeRef } from 'vue'
import { normalizeTooltipText } from '../service/overlay-formatters.ts'
import { useI18n } from 'vue-i18n'

interface RarityOption {
  key: string
  label: string
}

interface AugmentTooltipSource {
  id?: string | number
  augmentId?: string | number
  name?: string
  rarity?: string
  rarityName?: string
  rarityDisplayName?: string
  iconPath?: string
  iconUrl?: string
  description?: unknown
  tooltip?: unknown
  shortDesc?: unknown
  shortDescription?: unknown
}

interface TooltipState {
  visible: boolean
  augment: AugmentTooltipSource | null
  x: number
  y: number
}

function getTooltipPoint(event: MouseEvent | FocusEvent) {
  if (event.type !== 'focus' && event instanceof MouseEvent) {
    return { x: event.clientX, y: event.clientY }
  }

  const rect = event.currentTarget instanceof HTMLElement
    ? event.currentTarget.getBoundingClientRect()
    : null
  return rect ? { x: rect.right, y: rect.top } : { x: 0, y: 0 }
}

export function useAugmentTooltip(
  rarityOptions: MaybeRef<ReadonlyArray<RarityOption>>,
  resolveAugmentIconUrl: (path: string) => string,
) {
  const { t } = useI18n()
  const augmentTooltip = ref<TooltipState>({ visible: false, augment: null, x: 0, y: 0 })

  const getTooltipText = (augment: AugmentTooltipSource) =>
    normalizeTooltipText(augment.description) ||
    normalizeTooltipText(augment.tooltip) ||
    normalizeTooltipText(augment.shortDesc) ||
    normalizeTooltipText(augment.shortDescription)

  const augmentTooltipDetail = computed(() => {
    const augment = augmentTooltip.value.visible ? augmentTooltip.value.augment : null
    if (!augment) return null

    const iconPath = augment.iconPath || augment.iconUrl || ''
    return {
      id: augment.augmentId || augment.id || '',
      name: augment.name || t('augment.unknownAugment'),
      rarityLabel:
        augment.rarityDisplayName ||
        augment.rarityName ||
        unref(rarityOptions).find((option) => option.key === augment.rarity)?.label ||
        '',
      iconUrl: iconPath ? resolveAugmentIconUrl(iconPath) : '',
      description: getTooltipText(augment),
    }
  })

  const augmentTooltipStyle = computed(() => {
    const width = 300
    const estimatedHeight = 220
    const margin = 12
    const offset = 14
    let left = augmentTooltip.value.x + offset
    let top = augmentTooltip.value.y + offset

    if (typeof window !== 'undefined') {
      if (left + width > window.innerWidth - margin) {
        left = augmentTooltip.value.x - width - offset
      }
      if (top + estimatedHeight > window.innerHeight - margin) {
        top = window.innerHeight - estimatedHeight - margin
      }
    }

    return {
      left: `${Math.max(margin, left)}px`,
      top: `${Math.max(margin, top)}px`,
    }
  })

  const showAugmentTooltip = (event: MouseEvent | FocusEvent, augment: AugmentTooltipSource) => {
    const point = getTooltipPoint(event)
    augmentTooltip.value = { visible: true, augment, x: point.x, y: point.y }
  }

  const moveAugmentTooltip = (event: MouseEvent) => {
    if (!augmentTooltip.value.visible) return
    const point = getTooltipPoint(event)
    augmentTooltip.value = { ...augmentTooltip.value, x: point.x, y: point.y }
  }

  const hideAugmentTooltip = () => {
    augmentTooltip.value = { ...augmentTooltip.value, visible: false }
  }

  return {
    augmentTooltipDetail,
    augmentTooltipStyle,
    showAugmentTooltip,
    moveAugmentTooltip,
    hideAugmentTooltip,
  }
}
