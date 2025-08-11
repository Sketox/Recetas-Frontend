import * as Icons from "@heroicons/react/24/solid";

export const availableIcons = [
  "face-smile",
  "user-circle",
  "bolt",
  "sparkles",
  "sun",
  "fire",
  "heart",
  "cake",
  "rocket-launch",
];

export function formatIconName(iconName: string): keyof typeof Icons {
  const formatted = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("") + "Icon";

  return formatted as keyof typeof Icons;
}

export function getIconComponent(iconName: string) {
  const formattedName = formatIconName(iconName);
  return Icons[formattedName] || Icons.UserCircleIcon;
}

export function getRandomIcon(): string {
  const index = Math.floor(Math.random() * availableIcons.length);
  return availableIcons[index];
}
