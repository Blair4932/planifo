export interface SettingTab {
  name: string;
  icon?: string; // need to change these optionals
  innerSettings?: SettingTab[];
}

export const settingTabs = {
  accountSettings: {
    name: "Account Settings",
    icon: "",
    innerSettings: [],
  },
  accessibilitySettings: {
    name: "Accessibility Settings",
    icon: "",
    innerSettings: [],
  },
  contact: {
    name: "Contact",
    icon: "",
    innerSettings: [],
  },
  logout: {
    name: "Logout",
    icon: "",
    innerSettings: [],
  },
};
