import { Navigate } from "react-router";
import { useAuth } from "@/entities/user";
import { LoginForm } from "@/features/auth";
import { Card } from "@/components/ui/card";

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  // Agar authenticated bo'lsa, /projects ga redirect qil
  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <LoginForm />
      </Card>
    </div>
  );
}
