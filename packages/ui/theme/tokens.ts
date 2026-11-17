export type UiTone = "brand" | "success" | "warning" | "error" | "info" | "neutral";

export interface UiToken {
  name: string;
  value: string;
  tone: UiTone;
}

export interface ResponsiveGridToken {
  minColumnWidth: number;
  gap: number;
  maxColumns: number;
}

export function createUiToken(name: string, value: string, tone: UiTone = "neutral"): UiToken {
  return { name, value, tone };
}

export const pulseFitPalette = {
  brand: createUiToken("brand.primary", "#0f766e", "brand"),
  brandContrast: createUiToken("brand.contrast", "#ffffff", "brand"),
  surface: createUiToken("surface.default", "#ffffff", "neutral"),
  surfaceRaised: createUiToken("surface.raised", "#f8fafc", "neutral"),
  border: createUiToken("border.default", "#cbd5e1", "neutral"),
  text: createUiToken("text.primary", "#0f172a", "neutral"),
  mutedText: createUiToken("text.muted", "#475569", "neutral"),
  success: createUiToken("state.success", "#15803d", "success"),
  warning: createUiToken("state.warning", "#a16207", "warning"),
  error: createUiToken("state.error", "#b91c1c", "error"),
  info: createUiToken("state.info", "#0369a1", "info"),
  neutral: createUiToken("state.neutral", "#475569", "neutral")
};

export const pulseFitSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

export const pulseFitRadii = {
  control: 6,
  card: 8,
  dialog: 8
};

export const responsiveGrid: ResponsiveGridToken = {
  minColumnWidth: 260,
  gap: pulseFitSpacing.lg,
  maxColumns: 4
};

export const baseUiTokens = [
  pulseFitPalette.brand,
  pulseFitPalette.success,
  pulseFitPalette.warning,
  pulseFitPalette.error,
  pulseFitPalette.info,
  pulseFitPalette.neutral
];
