export interface SettingTab {
  id: number;
  name: string;
  icon?: string; // need to change these optionals
  innerSettings?: SettingTab[];
}

export const settingsTabs = [
  {
    id: 1,
    name: "Account Settings",
    icon: "",
    innerSettings: [],
  },
  {
    id: 2,
    name: "Accessibility Settings",
    icon: "",
    innerSettings: [],
  },
  {
    id: 3,
    name: "Contact",
    icon: "",
    innerSettings: [],
  },
  {
    id: 4,
    name: "Logout",
    icon: "",
    innerSettings: [],
  },
];
