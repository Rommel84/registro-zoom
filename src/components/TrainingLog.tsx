import { useEffect, useState } from "react";
import { originalRegister } from "@/lib/original-register";

declare global {
  interface Window { LTRegister?: typeof originalRegister }
}

export function TrainingLog() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    window.LTRegister = originalRegister;
    setReady(true);
    return () => { delete window.LTRegister; };
  }, []);
  return ready ? <iframe title="Registro allenamenti Liberi Tutti" src="/original-register.html" className="block h-dvh w-full border-0" /> : null;
}
