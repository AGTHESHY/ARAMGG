export interface WindowPosition {
  x: number
  y: number
}

export interface WindowSize {
  width: number
  height: number
}

export type WorkArea = WindowPosition & WindowSize

export function parseWindowPosition(value: unknown): WindowPosition | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const position = value as Partial<WindowPosition>
  if (
    typeof position.x !== 'number' ||
    typeof position.y !== 'number' ||
    !Number.isFinite(position.x) ||
    !Number.isFinite(position.y)
  ) {
    return null
  }

  return {
    x: Math.round(position.x),
    y: Math.round(position.y),
  }
}

export function fitWindowPositionToWorkArea(
  position: WindowPosition,
  size: WindowSize,
  workArea: WorkArea,
): WindowPosition {
  const maxX = workArea.x + Math.max(0, workArea.width - size.width)
  const maxY = workArea.y + Math.max(0, workArea.height - size.height)

  return {
    x: Math.min(Math.max(position.x, workArea.x), maxX),
    y: Math.min(Math.max(position.y, workArea.y), maxY),
  }
}
