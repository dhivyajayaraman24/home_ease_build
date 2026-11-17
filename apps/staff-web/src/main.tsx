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

export function StaffWebApp() {
  return {
    name: "Pulse Fit Staff Web",
    runtime: "React",
    navigation: staffNavigation
  };
}
