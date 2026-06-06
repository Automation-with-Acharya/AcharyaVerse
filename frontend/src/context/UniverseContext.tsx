import { createContext } from "react";

export type UniverseContextType = {
  selectedPlanet: string | null;
  setSelectedPlanet: (
    planet: string | null
  ) => void;
};

export const UniverseContext =
  createContext<UniverseContextType>({
    selectedPlanet: null,
    setSelectedPlanet: () => {},
  });