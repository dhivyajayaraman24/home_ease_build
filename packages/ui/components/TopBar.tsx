import type { AppRole } from "./SideNav";
import type { TagModel } from "./Tag";

export interface TopBarAction {
  id: string;
  label: string;
  icon: string;
}

export interface TopBarModel {
  component: "TopBar";
  brandName: string;
  appName: string;
  role: AppRole;
  branchLabel?: string;
  statusTag?: TagModel;
  actions: TopBarAction[];
}

export function createTopBar(input: Omit<TopBarModel, "component" | "actions"> & {
  actions?: TopBarAction[];
}): TopBarModel {
  return {
    component: "TopBar",
    brandName: input.brandName,
    appName: input.appName,
    role: input.role,
    branchLabel: input.branchLabel,
    statusTag: input.statusTag,
    actions: input.actions ?? []
  };
}
