import type { CardAction } from "./Card";

export type DialogSize = "sm" | "md" | "lg";

export interface DialogModel {
  component: "Dialog";
  id: string;
  title: string;
  description?: string;
  size: DialogSize;
  open: boolean;
  actions: CardAction[];
}

export function createDialog(input: Omit<DialogModel, "component" | "size" | "open" | "actions"> & {
  actions?: CardAction[];
  open?: boolean;
  size?: DialogSize;
}): DialogModel {
  return {
    component: "Dialog",
    id: input.id,
    title: input.title,
    description: input.description,
    size: input.size ?? "md",
    open: input.open ?? false,
    actions: input.actions ?? []
  };
}
