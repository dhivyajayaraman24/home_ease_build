import {
  createAppShell,
  createCard,
  createDataTable,
  createTag,
  createToolbar,
  type AppRole,
  type NavigationItem
} from "@pulse-fit/ui";

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

export const managementShellNavigation: NavigationItem[] = managementNavigation.map((item) => ({
  id: item.area,
  label: item.label,
  href: `/management/${item.area}`,
  roles: ["branch-manager" as AppRole, "owner-admin" as AppRole]
}));

export const managementShell = createAppShell({
  appName: "Management Portal",
  role: "owner-admin",
  activeItemId: "dashboard",
  navigation: managementShellNavigation,
  contentLabel: "Management dashboard placeholder",
  content: [
    createCard({
      title: "Brand overview",
      description: "Memberships, revenue, bookings, check-ins, leads, and branch performance will appear here.",
      metric: "Centralized gym brand",
      tag: createTag("Live shell", "success")
    }),
    createDataTable({
      caption: "Branch performance preview",
      columns: [
        { key: "branch", header: "Branch", align: "left" },
        { key: "status", header: "Status", align: "left" }
      ],
      rows: [
        {
          id: "downtown",
          cells: [
            { columnKey: "branch", value: "Downtown Branch" },
            { columnKey: "status", value: "Reporting pending", tag: createTag("Preview", "warning") }
          ]
        }
      ],
      toolbar: createToolbar({
        title: "Dashboard actions",
        actions: [{ id: "export", label: "Export", icon: "download", intent: "secondary" }]
      })
    })
  ]
});

export function ManagementWebApp() {
  return {
    name: "Pulse Fit Management Portal",
    runtime: "React",
    navigation: managementNavigation,
    shell: managementShell
  };
}
