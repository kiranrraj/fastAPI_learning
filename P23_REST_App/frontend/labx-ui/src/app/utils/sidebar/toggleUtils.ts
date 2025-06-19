// src/app/utils/sidebar/toggleUtils.ts

export function toggleGroupState(
  currentState: Record<string, boolean>,
  groupId: string
): Record<string, boolean> {
  return {
    ...currentState,
    [groupId]: !currentState[groupId],
  };
}
