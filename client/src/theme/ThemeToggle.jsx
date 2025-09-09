import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`btn btn-outline ${className}`}
      title={isDark ? "Cambiar a claro" : "Cambiar a oscuro"}
    >
      {isDark ? <Sun size={16}/> : <Moon size={16}/>}
      <span>{isDark ? "Claro" : "Oscuro"}</span>
    </button>
  );
}
