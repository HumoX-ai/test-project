import { StoreProvider } from "./StoreProvider";
import { ThemeProvider } from "./ThemeProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </StoreProvider>
  );
}
