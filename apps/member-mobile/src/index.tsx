import { createAppShell, createCard, createTag, type AppRole, type NavigationItem } from "@pulse-fit/ui";

export type MemberAppRoute = "home" | "membership" | "bookings" | "check-in" | "notifications";

export interface MemberAppScreen {
  route: MemberAppRoute;
  title: string;
}

export const memberAppScreens: MemberAppScreen[] = [
  { route: "home", title: "Today" },
  { route: "membership", title: "Membership" },
  { route: "bookings", title: "Classes" },
  { route: "check-in", title: "Check-In QR" },
  { route: "notifications", title: "Notifications" }
];

export const memberNavigation: NavigationItem[] = memberAppScreens.map((screen) => ({
  id: screen.route,
  label: screen.title,
  href: `/${screen.route}`,
  roles: ["member" as AppRole]
}));

export const memberShell = createAppShell({
  appName: "Member Mobile",
  role: "member",
  activeItemId: "home",
  navigation: memberNavigation,
  contentLabel: "Member home placeholder",
  content: [
    createCard({
      title: "Membership snapshot",
      description: "Renewal, class bookings, QR check-in, and notifications will appear here.",
      tag: createTag("Active", "success")
    })
  ]
});

export function MemberApp() {
  return {
    name: "Pulse Fit Member Mobile",
    runtime: "React Native",
    screens: memberAppScreens,
    shell: memberShell
  };
}
