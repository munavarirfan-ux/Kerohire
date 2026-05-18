/** Shared nav model for sidebar (used by `navigationByRole` + AppShell icon registry). */

export type NavIconKey =
  | "layoutDashboard"
  | "briefcase"
  | "users"
  | "waypoints"
  | "graduationCap"
  | "mic2"
  | "calendar"
  | "databaseZap"
  | "building2"
  | "globe2"
  | "clipboardList"
  | "fileText"
  | "barChart3"
  | "shield"
  | "settings";

export type NavItemConfig = {
  href: string;
  label: string;
  icon: NavIconKey;
};

export type NavGroupConfig = {
  label: string;
  items: NavItemConfig[];
};
