export type SubPlanetData = {
  name: string;
  label: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  emoji: string;
  path: string; // The URL routing path, e.g., "/resume" or "/resume#education"
};

export type GalaxyData = {
  id: string;
  name: string;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  inclination: number; // inclination angle relative to X-Z plane in radians
  startAngle: number; // Starting angle offset in radians to disperse galaxies
  emoji: string;
  tagline: string;
  planets: SubPlanetData[];
};
