import type { UiTone } from "../theme/tokens";

export type TagTone = Extract<UiTone, "success" | "warning" | "error" | "info" | "neutral">;

export interface TagModel {
  component: "Tag";
  label: string;
  tone: TagTone;
  accessibleLabel: string;
}

export function createTag(label: string, tone: TagTone = "neutral", accessibleLabel = label): TagModel {
  return {
    component: "Tag",
    label,
    tone,
    accessibleLabel
  };
}

export const tagToneLabels: Record<TagTone, string> = {
  success: "Success",
  warning: "Warning",
  error: "Error",
  info: "Info",
  neutral: "Neutral"
};
