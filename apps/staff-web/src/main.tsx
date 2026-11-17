import {
  createAppShell,
  createCard,
  createDataTable,
  createFormField,
  createFilter,
  createTag,
  createToolbar,
  type AppRole,
  type NavigationItem
} from "@pulse-fit/ui";

export type StaffWorkflow = "member-lookup" | "offline-payment" | "qr-validation" | "rosters" | "leads";

export interface StaffNavigationItem {
  workflow: StaffWorkflow;
  label: string;
}

export const staffNavigation: StaffNavigationItem[] = [
  { workflow: "member-lookup", label: "Members" },
  { workflow: "offline-payment", label: "Payments" },
  { workflow: "qr-validation", label: "Check-Ins" },
  { workflow: "rosters", label: "Rosters" },
  { workflow: "leads", label: "Leads" }
];

export const staffShellNavigation: NavigationItem[] = staffNavigation.map((item) => ({
  id: item.workflow,
  label: item.label,
  href: `/staff/${item.workflow}`,
  roles: ["front-desk" as AppRole, "trainer" as AppRole, "branch-manager" as AppRole]
}));

export const staffShell = createAppShell({
  appName: "Staff and Trainer",
  role: "front-desk",
  activeItemId: "member-lookup",
  navigation: staffShellNavigation,
  contentLabel: "Staff workspace placeholder",
  branchLabel: "Downtown Branch",
  content: [
    createCard({
      title: "Front desk queue",
      description: "Member lookup, offline payments, QR validation, rosters, and leads start here.",
      tag: createTag("Ready", "info")
    }),
    createDataTable({
      caption: "Today at a glance",
      columns: [
        { key: "workflow", header: "Workflow", align: "left" },
        { key: "status", header: "Status", align: "left" }
      ],
      rows: [
        {
          id: "qr-validation",
          cells: [
            { columnKey: "workflow", value: "QR validation" },
            { columnKey: "status", value: "Available", tag: createTag("Online", "success") }
          ]
        }
      ],
      toolbar: createToolbar({
        title: "Operational filters",
        filters: [
          createFilter("branch", "Branch", createFormField({ id: "branch", label: "Branch", kind: "select" }))
        ]
      })
    })
  ]
});

export function StaffWebApp() {
  return {
    name: "Pulse Fit Staff Web",
    runtime: "React",
    navigation: staffNavigation,
    shell: staffShell
  };
}
