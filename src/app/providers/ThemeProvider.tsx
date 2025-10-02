import { ThemeProvider as BaseThemeProvider } from "@/shared/components/theme-provider";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <BaseThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {children}
    </BaseThemeProvider>
  );
}
