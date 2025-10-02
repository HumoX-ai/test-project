import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { logout } from "@/entities/user";
import { LogOut } from "lucide-react";
import { ModeToggle } from "@/shared/components";

interface HeaderProps {
  userName?: string;
}

export function Header({ userName }: HeaderProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 sm:px-4">
      <div className="container flex h-12 sm:h-14 md:h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/projects"
            className={`text-sm sm:text-base font-semibold hover:text-primary transition-colors ${
              location.pathname === "/projects"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Loyihalar
          </Link>
          <Link
            to="/tasks"
            className={`text-sm sm:text-base font-semibold hover:text-primary transition-colors ${
              location.pathname === "/tasks"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Vazifalar
          </Link>
          <Link
            to="/statistics"
            className={`text-sm sm:text-base font-semibold hover:text-primary transition-colors ${
              location.pathname === "/statistics"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Statistika
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {userName && (
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              Xush kelibsiz,{" "}
              <span className="font-medium text-foreground">{userName}</span>
            </span>
          )}
          <ModeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="h-8 px-2 sm:px-3"
          >
            <LogOut className="size-3 sm:size-4" />
            <span className="hidden md:block ml-1 sm:ml-2">Chiqish</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
