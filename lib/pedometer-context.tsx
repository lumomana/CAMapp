import { createContext, useContext, ReactNode } from "react";
import { usePedometer } from "@/hooks/use-pedometer";

// Type identique au retour de usePedometer
type PedometerContextValue = ReturnType<typeof usePedometer>;

const PedometerContext = createContext<PedometerContextValue | null>(null);

export function PedometerProvider({ children }: { children: ReactNode }) {
  const pedometer = usePedometer();
  return (
    <PedometerContext.Provider value={pedometer}>
      {children}
    </PedometerContext.Provider>
  );
}

export function usePedometerContext(): PedometerContextValue {
  const ctx = useContext(PedometerContext);
  if (!ctx) throw new Error("usePedometerContext must be used within PedometerProvider");
  return ctx;
}
