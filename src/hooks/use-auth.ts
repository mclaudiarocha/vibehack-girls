import { useEffect, useState } from "react";
import { getSession, type IrisSession } from "@/lib/auth";

export function useAuth(): IrisSession | null {
  const [session, setSession] = useState<IrisSession | null>(() => getSession());
  useEffect(() => {
    const sync = () => setSession(getSession());
    window.addEventListener("iris:auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("iris:auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return session;
}