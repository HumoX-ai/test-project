import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useLoginMutation, setCredentials } from "@/entities/user";
import { Loader2, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Email noto'g'ri"),
  password: z.string().min(1, "Parol majburiy"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "john@mail.com", password: "changeme" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data).unwrap();

      // Get profile immediately
      const response = await fetch(
        `${import.meta.env.VITE_PRODUCTS_API_BASE_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${result.access_token}` },
        }
      );
      const user = await response.json();

      // Save everything at once
      dispatch(setCredentials({ user, tokens: result }));
      navigate("/projects");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const errorMessage =
    error && "status" in error
      ? error.status === 401
        ? "Email yoki parol noto'g'ri"
        : "Kirish muvaffaqiyatsiz"
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Qaytganingiz bilan</h1>
        <p className="text-muted-foreground text-sm">
          Davomini ko'rish uchun kiring
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="size-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Parol</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Kirilmoqda...
            </>
          ) : (
            "Kirish"
          )}
        </Button>
      </div>
    </form>
  );
}
