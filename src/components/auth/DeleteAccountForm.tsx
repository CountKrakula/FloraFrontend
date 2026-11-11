import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { deleteAccount } from "@/service/AuthService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

export const DeleteAccountForm = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await deleteAccount(password);
      setAuthenticated(false);
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Misslyckades att radera kontot. Kontrollera lösenordet."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ett oväntat fel uppstod.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-destructive">
          Delete Account
        </h2>
        <p className="text-sm text-muted-foreground">
          Detta val går inte att ångra. Ange ditt lösenord för att bekräfta att
          du vill radera ditt konto.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Ange ditt lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        variant="destructive"
        className="w-full"
        disabled={isLoading || !password}
      >
        {isLoading ? "Raderar konto..." : "Bekräfta och radera konto"}
      </Button>
    </form>
  );
};