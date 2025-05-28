import { createContext, useContext, useState, ReactNode } from "react";

type PuntosContextType = {
  puntos: number;
  setPuntos: (p: number) => void;
};

const defaultValue: PuntosContextType = {
  puntos: 0,
  setPuntos: () => {},
};

export const PuntosContext = createContext<PuntosContextType>(defaultValue);
export const usePuntos = () => useContext(PuntosContext);

export function PuntosProvider({ children }: { children: ReactNode }) {
  const [puntos, setPuntos] = useState(0);
  return (
    <PuntosContext.Provider value={{ puntos, setPuntos }}>
      {children}
    </PuntosContext.Provider>
  );
}