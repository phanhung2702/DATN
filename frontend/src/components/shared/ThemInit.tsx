import { useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";

export default function ThemeInit() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}
