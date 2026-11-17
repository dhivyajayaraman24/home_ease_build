export type AppRole = "member" | "front-desk" | "trainer" | "branch-manager" | "owner-admin";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  roles: AppRole[];
}

export interface SideNavModel {
  component: "SideNav";
  role: AppRole;
  items: NavigationItem[];
  activeItemId: string;
}

export function createRoleAwareNavigation(items: NavigationItem[], role: AppRole): NavigationItem[] {
  return items.filter((item) => item.roles.includes(role));
}

export function createSideNav(input: Omit<SideNavModel, "component" | "items"> & {
  items: NavigationItem[];
}): SideNavModel {
  return {
    component: "SideNav",
    role: input.role,
    items: createRoleAwareNavigation(input.items, input.role),
    activeItemId: input.activeItemId
  };
}
