import type { CardModel } from "./Card";
import type { DataTableModel } from "./DataTable";
import type { DialogModel } from "./Dialog";
import type { FormFieldModel } from "./FormField";
import { createSideNav, type AppRole, type NavigationItem, type SideNavModel } from "./SideNav";
import { createTopBar, type TopBarModel } from "./TopBar";
import { responsiveGrid } from "../theme/tokens";

export type ShellContentBlock = CardModel | DataTableModel | DialogModel | FormFieldModel;

export interface SkipLinkModel {
  href: string;
  label: string;
}

export interface ResponsiveGridModel {
  minColumnWidth: number;
  gap: number;
  maxColumns: number;
}

export interface AppShellModel {
  component: "AppShell";
  role: AppRole;
  topBar: TopBarModel;
  sideNav: SideNavModel;
  skipLink: SkipLinkModel;
  grid: ResponsiveGridModel;
  contentLabel: string;
  content: ShellContentBlock[];
}

export interface AppShellInput {
  appName: string;
  role: AppRole;
  activeItemId: string;
  navigation: NavigationItem[];
  contentLabel: string;
  content: ShellContentBlock[];
  branchLabel?: string;
}

export function createSkipLink(label = "Skip to main content", href = "#main-content"): SkipLinkModel {
  return { href, label };
}

export function createAppShell(input: AppShellInput): AppShellModel {
  return {
    component: "AppShell",
    role: input.role,
    topBar: createTopBar({
      brandName: "Pulse Fit",
      appName: input.appName,
      role: input.role,
      branchLabel: input.branchLabel
    }),
    sideNav: createSideNav({
      role: input.role,
      items: input.navigation,
      activeItemId: input.activeItemId
    }),
    skipLink: createSkipLink(),
    grid: responsiveGrid,
    contentLabel: input.contentLabel,
    content: input.content
  };
}
