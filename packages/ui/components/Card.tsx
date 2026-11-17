import type { TagModel } from "./Tag";

export interface CardAction {
  id: string;
  label: string;
  intent?: "primary" | "secondary" | "danger";
}

export interface CardModel {
  component: "Card";
  title: string;
  description?: string;
  metric?: string;
  tag?: TagModel;
  actions: CardAction[];
}

export function createCard(input: Omit<CardModel, "component" | "actions"> & { actions?: CardAction[] }): CardModel {
  return {
    component: "Card",
    title: input.title,
    description: input.description,
    metric: input.metric,
    tag: input.tag,
    actions: input.actions ?? []
  };
}
