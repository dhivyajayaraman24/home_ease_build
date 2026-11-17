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

export function MemberApp() {
  return {
    name: "Pulse Fit Member Mobile",
    runtime: "React Native",
    screens: memberAppScreens
  };
}
