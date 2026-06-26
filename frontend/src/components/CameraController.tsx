/**
 * CameraController.tsx
 *
 * Milestone 4 — Camera System
 * ----------------------------
 * Drives two phases of camera motion inside the R3F Canvas:
 *
 * 1. INTRO  — gentle pull-in from Z=22 → Z=10 on mount (2 s, cubic ease-out)
 * 2. ZOOM   — smooth fly-to when a planet is selected, ease-back on deselect
 *
 * OrbitControls is disabled during a zoom transition so the two systems don't
 * fight each other.  Once the camera arrives at the target, controls re-enable
 * so the user can still orbit around the selected planet.
 */

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// ─── Planet position registry ────────────────────────────────────────────────
// Keep in sync with data/planets.ts positions.
const PLANET_POSITIONS: Record<string, [number, number, number]> = {
  Resume:        [0,    3.5,  0  ],
  Experience:    [-5,   1.5,  -2 ],
  Projects:      [5,    1.5,  -2 ],
  Skills:        [-5,  -2,    -1 ],
  "AI Mayank":   [5,   -2,    -1 ],
  "Physics Lab": [-3,  -4,    -3 ],
  Contact:       [3,   -4,    -3 ],
};

// How far in front of the planet to position the camera (world units)
const ZOOM_OFFSET = 3.2;

// Overview position (matches the default camera & CameraIntro end pos)
const OVERVIEW_POSITION = new THREE.Vector3(0, 0, 10);
const OVERVIEW_TARGET   = new THREE.Vector3(0, 0, 0);

// Animation durations in seconds
const INTRO_DURATION  = 2.0;   // pull-in on first mount
const ZOOM_DURATION   = 1.6;   // fly-to planet
const RETURN_DURATION = 1.4;   // return to overview

// Easing helpers
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "intro" | "zoom-in" | "zoom-out" | "idle";

type Props = {
  selectedPlanet: string | null;
  /** Ref forwarded from SpaceScene so we can pause / resume auto-rotate */
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
};

export default function CameraController({ selectedPlanet, controlsRef }: Props) {
  const { camera } = useThree();

  const phaseRef     = useRef<Phase>("intro");
  const elapsed      = useRef(0);
  const prevPlanet   = useRef<string | null>(null);

  // Snapshot of where the camera was when the animation began
  const startPos     = useRef(new THREE.Vector3());
  const startTarget  = useRef(new THREE.Vector3());

  // Destination for current animation
  const endPos       = useRef(new THREE.Vector3());
  const endTarget    = useRef(new THREE.Vector3());

  // ── Init intro ──────────────────────────────────────────────────────────────
  useEffect(() => {
    camera.position.set(0, 0, 22);
    startPos.current.set(0, 0, 22);
    endPos.current.copy(OVERVIEW_POSITION);
    startTarget.current.copy(OVERVIEW_TARGET);
    endTarget.current.copy(OVERVIEW_TARGET);
    elapsed.current = 0;
    phaseRef.current = "intro";

    // Disable controls during intro
    if (controlsRef.current) controlsRef.current.enabled = false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── React to planet selection changes ──────────────────────────────────────
  useEffect(() => {
    if (selectedPlanet === prevPlanet.current) return;
    prevPlanet.current = selectedPlanet;

    // Snapshot current camera state as animation start
    startPos.current.copy(camera.position);

    if (selectedPlanet) {
      // ── ZOOM IN ──
      const ppos = PLANET_POSITIONS[selectedPlanet];
      if (!ppos) return;

      const planetVec = new THREE.Vector3(...ppos);

      // Camera sits in front of the planet (toward the viewer)
      const dir = new THREE.Vector3(0, 0, 1); // default: come from +Z side
      // Actually position the camera offset from the planet in the scene's
      // XZ plane so it doesn't clip the black hole at origin.
      const fromOrigin = planetVec.clone().normalize();
      const offset = fromOrigin.multiplyScalar(ZOOM_OFFSET);
      endPos.current.copy(planetVec).add(offset);
      endTarget.current.copy(planetVec);

      phaseRef.current = "zoom-in";

      // Kill auto-rotate while zoomed
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
        controlsRef.current.enabled = false;
      }
    } else {
      // ── ZOOM OUT / RETURN ──
      endPos.current.copy(OVERVIEW_POSITION);
      endTarget.current.copy(OVERVIEW_TARGET);
      phaseRef.current = "zoom-out";

      if (controlsRef.current) controlsRef.current.enabled = false;
    }

    elapsed.current = 0;
  }, [selectedPlanet]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Animation loop ─────────────────────────────────────────────────────────
  useFrame((state, delta) => {
    const phase = phaseRef.current;
    if (phase === "idle") return;

    let duration: number;
    let easeFn: (t: number) => number;

    switch (phase) {
      case "intro":
        duration = INTRO_DURATION;
        easeFn   = easeOutCubic;
        break;
      case "zoom-in":
        duration = ZOOM_DURATION;
        easeFn   = easeInOutCubic;
        break;
      case "zoom-out":
        duration = RETURN_DURATION;
        easeFn   = easeOutCubic;
        break;
      default:
        return;
    }

    elapsed.current = Math.min(elapsed.current + delta, duration);
    const rawT = elapsed.current / duration;
    const t    = easeFn(rawT);

    // Interpolate position
    camera.position.lerpVectors(startPos.current, endPos.current, t);

    // Smoothly rotate camera to look at the target
    const currentLookAt = new THREE.Vector3();
    currentLookAt.lerpVectors(startTarget.current, endTarget.current, t);
    camera.lookAt(currentLookAt);

    // Also update the controls' target so it doesn't snap on re-enable
    if (controlsRef.current) {
      (controlsRef.current as any).target.lerpVectors(
        startTarget.current,
        endTarget.current,
        t
      );
    }

    // ── Transition complete ──
    if (rawT >= 1) {
      phaseRef.current = "idle";
      camera.position.copy(endPos.current);
      camera.lookAt(endTarget.current);

      if (controlsRef.current) {
        (controlsRef.current as any).target.copy(endTarget.current);
        controlsRef.current.enabled = true;

        // Restore auto-rotate only when back at overview
        if (!selectedPlanet) {
          controlsRef.current.autoRotate = true;
        }
      }
    }
  });

  return null;
}
