export type UiTone = "brand" | "success" | "warning" | "danger" | "neutral";

export interface UiToken {
  name: string;
  value: string;
  tone: UiTone;
}

export function createUiToken(name: string, value: string, tone: UiTone = "neutral"): UiToken {
  return { name, value, tone };
}

export const baseUiTokens = [
  createUiToken("brand.primary", "#0f766e", "brand"),
  createUiToken("state.success", "#15803d", "success"),
  createUiToken("state.warning", "#a16207", "warning"),
  createUiToken("state.danger", "#b91c1c", "danger")
];
