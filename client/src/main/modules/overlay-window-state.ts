export type OverlayWindowVisibility = {
    isVisible(): boolean
}

export function shouldRaiseOverlayWindow(window: OverlayWindowVisibility): boolean {
    return !window.isVisible()
}
