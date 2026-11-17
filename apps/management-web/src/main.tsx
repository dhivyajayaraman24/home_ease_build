export type ManagementArea = "dashboard" | "branches" | "roles" | "reports" | "reconciliation";

export interface ManagementNavigationItem {
  area: ManagementArea;
  label: string;
}

export const managementNavigation: ManagementNavigationItem[] = [
  { area: "dashboard", label: "Dashboard" },
  { area: "branches", label: "Branches" },
  { area: "roles", label: "Roles" },
  { area: "reports", label: "Reports" },
  { area: "reconciliation", label: "Reconciliation" }
];

export function ManagementWebApp() {
  return {
    name: "Pulse Fit Management Portal",
    runtime: "React",
    navigation: managementNavigation
  };
}
