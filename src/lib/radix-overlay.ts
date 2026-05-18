/** True when the event target is inside a Radix portaled overlay (popover, select, etc.). */
export function isRadixPortaledContent(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest("[data-radix-popper-content-wrapper]") ||
      target.closest("[data-radix-select-content]") ||
      target.closest("[data-radix-menu-content]"),
  );
}

export function preventDialogDismissOnPortaledOverlay(event: Event): void {
  if (isRadixPortaledContent(event.target)) {
    event.preventDefault();
  }
}
