import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { galaxies } from "../data/galaxies";

// Helper to compute galaxy world position at time t
export function getGalaxyWorldPos(galaxyId: string, t: number): THREE.Vector3 {
  const g = galaxies.find((x) => x.id === galaxyId);
  if (!g) return new THREE.Vector3(0, 0, 0);
  const angle = t * g.orbitSpeed * 3.5;
  const x = Math.cos(angle) * g.orbitRadius;
  const z = Math.sin(angle) * g.orbitRadius;
  const y = Math.sin(angle) * g.orbitRadius * Math.sin(g.inclination);
  return new THREE.Vector3(x, y, z);
}

// Helper to compute sub-planet world position at time t
export function getPlanetWorldPos(
  galaxyId: string,
  planetName: string,
  t: number
): THREE.Vector3 {
  const g = galaxies.find((x) => x.id === galaxyId);
  if (!g) return new THREE.Vector3(0, 0, 0);
  const gpos = getGalaxyWorldPos(galaxyId, t);

  const p = g.planets.find((x) => x.name === planetName);
  if (!p) return gpos;

  const angle = t * p.orbitSpeed * 12;
  const px = Math.cos(angle) * p.orbitRadius;
  const pz = Math.sin(angle) * p.orbitRadius;
  return gpos.clone().add(new THREE.Vector3(px, 0, pz));
}

// How close to zoom in
const GALAXY_ZOOM_OFFSET = 5.5;
const PLANET_ZOOM_OFFSET = 1.8;

// Overview position (default universe overview)
const OVERVIEW_POSITION = new THREE.Vector3(0, 5, 24);
const OVERVIEW_TARGET   = new THREE.Vector3(0, 0, 0);

// Transition durations in seconds
const INTRO_DURATION  = 2.2;
const ZOOM_DURATION   = 1.5;
const RETURN_DURATION = 1.3;

type Phase = "intro" | "zoom-in" | "zoom-out" | "idle";

type CameraControllerProps = {
  selectedGalaxyId: string | null;
  selectedPlanetName: string | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
};

export default function CameraController({
  selectedGalaxyId,
  selectedPlanetName,
  controlsRef,
}: CameraControllerProps) {
  const { camera } = useThree();

  const phaseRef = useRef<Phase>("intro");
  const elapsed = useRef(0);
  const prevGalaxy = useRef<string | null>(null);
  const prevPlanet = useRef<string | null>(null);

  // Animation starting snapshots
  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());

  // Real-time tracking reference for previous frame
  const prevTrackingTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Initialize camera overview on mount (intro phase)
  useEffect(() => {
    camera.position.set(0, 15, 35);
    startPos.current.set(0, 15, 35);
    elapsed.current = 0;
    phaseRef.current = "intro";

    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  }, [camera, controlsRef]);

  // Handle selection updates
  useEffect(() => {
    const isGalaxyChanged = selectedGalaxyId !== prevGalaxy.current;
    const isPlanetChanged = selectedPlanetName !== prevPlanet.current;

    if (!isGalaxyChanged && !isPlanetChanged) return;

    prevGalaxy.current = selectedGalaxyId;
    prevPlanet.current = selectedPlanetName;

    // Snapshot start configuration
    startPos.current.copy(camera.position);
    if (controlsRef.current) {
      startTarget.current.copy(controlsRef.current.target);
    } else {
      startTarget.current.copy(OVERVIEW_TARGET);
    }

    elapsed.current = 0;

    if (selectedGalaxyId) {
      // Zooming to either Planet or Galaxy
      phaseRef.current = "zoom-in";
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
        controlsRef.current.enabled = false;
      }
    } else {
      // Returning to universe overview
      phaseRef.current = "zoom-out";
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    }
  }, [selectedGalaxyId, selectedPlanetName, camera.position, controlsRef]);

  useFrame(({ clock }, delta) => {
    const phase = phaseRef.current;
    const tSec = clock.getElapsedTime();

    // ── Get the current destination coordinates at the exact frame time ──
    let currentTargetCoords = new THREE.Vector3(0, 0, 0);
    let cameraOffset = new THREE.Vector3(0, 0.5, 1);

    if (selectedPlanetName && selectedGalaxyId) {
      // Dynamic sub-planet target coordinates
      currentTargetCoords = getPlanetWorldPos(selectedGalaxyId, selectedPlanetName, tSec);
      cameraOffset.set(0, planetOffsetHeight(selectedPlanetName), PLANET_ZOOM_OFFSET);
    } else if (selectedGalaxyId) {
      // Dynamic galaxy center target coordinates
      currentTargetCoords = getGalaxyWorldPos(selectedGalaxyId, tSec);
      cameraOffset.set(0, 1.5, GALAXY_ZOOM_OFFSET);
    } else {
      currentTargetCoords.copy(OVERVIEW_TARGET);
      cameraOffset.copy(OVERVIEW_POSITION);
    }

    // ── Transition animations ──
    if (phase !== "idle") {
      let duration = ZOOM_DURATION;
      let ease = (x: number) => x;

      if (phase === "intro") {
        duration = INTRO_DURATION;
        ease = easeOutCubic;
        currentTargetCoords.copy(OVERVIEW_TARGET);
        cameraOffset.copy(OVERVIEW_POSITION);
      } else if (phase === "zoom-in") {
        duration = ZOOM_DURATION;
        ease = easeInOutCubic;
      } else {
        duration = RETURN_DURATION;
        ease = easeOutCubic;
        currentTargetCoords.copy(OVERVIEW_TARGET);
        cameraOffset.copy(OVERVIEW_POSITION);
      }

      elapsed.current = Math.min(elapsed.current + delta, duration);
      const rawProgress = elapsed.current / duration;
      const progress = ease(rawProgress);

      // Target position for the camera at this frame (destination target + offset)
      const frameEndPos = currentTargetCoords.clone().add(cameraOffset);

      // Interpolate camera position
      camera.position.lerpVectors(startPos.current, frameEndPos, progress);

      // Interpolate looking target
      const frameLookAt = new THREE.Vector3();
      frameLookAt.lerpVectors(startTarget.current, currentTargetCoords, progress);
      camera.lookAt(frameLookAt);

      if (controlsRef.current) {
        controlsRef.current.target.copy(frameLookAt);
      }

      // Check if finished
      if (rawProgress >= 1) {
        phaseRef.current = "idle";
        camera.position.copy(frameEndPos);
        camera.lookAt(currentTargetCoords);
        if (controlsRef.current) {
          controlsRef.current.target.copy(currentTargetCoords);
          controlsRef.current.enabled = true;
          if (!selectedGalaxyId) {
            controlsRef.current.autoRotate = true;
          }
        }
        prevTrackingTarget.current.copy(currentTargetCoords);
      }
    } else {
      // ── ACTIVE REAL-TIME TRACKING (IDLE PHASE) ──
      // If locked onto a moving galaxy or sub-planet, shift both the camera position
      // and controls target by the object's displacement from the previous frame.
      const displace = currentTargetCoords.clone().sub(prevTrackingTarget.current);
      camera.position.add(displace);

      if (controlsRef.current) {
        controlsRef.current.target.add(displace);
        controlsRef.current.update();
      }

      prevTrackingTarget.current.copy(currentTargetCoords);
    }
  });

  return null;
}

// Helpers for specific heights
function planetOffsetHeight(name: string): number {
  if (name === "Achievements" || name === "LinkedIn") return 0.15;
  return 0.25;
}

// Easing helpers
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
