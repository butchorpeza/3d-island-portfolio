/**
 * IMPORTANT: Loading glTF models into a Three.js scene is a lot of work.
 * Before we can configure or animate our model’s meshes, we need to iterate through
 * each part of our model’s meshes and save them separately.
 *
 * But luckily there is an app that turns gltf or glb files into jsx components
 * For this model, visit https://gltf.pmnd.rs/
 * And get the code. And then add the rest of the things.
 * YOU DON'T HAVE TO WRITE EVERYTHING FROM SCRATCH
 */

import { a } from "@react-spring/three";
import { useEffect, useMemo, useRef } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import islandScene from "../assets/3d/island.glb";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

// World-anchored diamond markers — children of the island group, so they
// physically sit at these local coordinates and rotate with the island.
// NOTE: these [x, y, z] positions come from real clicks logged via
// ClickLogger and converted to local space — but which click matched which
// landmark wasn't confirmed, so these are still a "best guess" pass. Once
// you see it running, tell me which ones are off and which way to nudge them.
const STAGE_MARKERS = [
  { stage: 2, label: "About", icon: <UserIcon />, position: [-411.0, 59.5, 203.6] },
  { stage: 3, label: "Projects", icon: <FolderIcon />, position: [-436.0, 144.7, -48.1] },
  { stage: 4, label: "Contact", icon: <ChatIcon />, position: [-437.8, 145.2, -19.0] },
];

const DiamondMarker = ({ label, icon, isActive }) => (
  <Html center distanceFactor={12} zIndexRange={[10, 0]}>
    <div className="flex items-center pointer-events-none select-none">
      {isActive && (
        <span className="mr-[-14px] flex items-center rounded-full bg-gradient-to-br from-[#4a1f1f] to-[#2a1512] py-2 pl-4 pr-6 text-xs font-semibold uppercase tracking-wide text-white shadow-md whitespace-nowrap">
          {label}
        </span>
      )}
      <div
        className={`flex h-9 w-9 rotate-45 items-center justify-center rounded-md border-2 transition-all duration-300 ${
          isActive
            ? "border-[#2a1512] bg-gradient-to-br from-[#4a1f1f] to-[#2a1512]"
            : "border-white/90 bg-white"
        }`}
      >
        {isActive && <span className="-rotate-45 text-white">{icon}</span>}
      </div>
    </div>
  </Html>
);

export function Island({
  isRotating,
  setIsRotating,
  setCurrentStage,
  currentStage,
  currentFocusPoint,
  season = "default", // "default" | "spring"
  isNight = false,
  ...props
}) {
  const islandRef = useRef();
  // Get access to the Three.js renderer and viewport
  const { gl, viewport, camera, raycaster, pointer, scene } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  // --- TEMPORARY: local-space click logger for placing STAGE_MARKERS ---
  // Click directly on a landmark (well, workshop, dock) in the running app
  // and the console will print the exact LOCAL [x, y, z] to paste into
  // STAGE_MARKERS below, plus the name of whatever mesh was actually hit
  // (so we can confirm it's really the island and not the sky/plane/bird).
  // Remove this whole useEffect once all three marker positions are set.
  useEffect(() => {
    const handleClick = () => {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      if (!hits[0]) return;
      const hit = hits[0];
      const local = islandRef.current.worldToLocal(hit.point.clone());
      console.log(
        `Hit "${hit.object.name || hit.object.type}" — local position: [${local.x.toFixed(2)}, ${local.y.toFixed(2)}, ${local.z.toFixed(2)}]`
      );
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [camera, raycaster, pointer, scene]);
  // --- end temporary logger ---

  // Use a ref for the last touch x position (mobile only now — no mouse-click drag)
  const lastX = useRef(0);
  // Use a ref for rotation speed
  const rotationSpeed = useRef(0);
  // Define a damping factor to control rotation damping
  const dampingFactor = 0.99; // closer to 1 = longer, more premium-feeling glide
  // Timeout ref used to briefly flag "isRotating" after a wheel/scroll event
  // (this is what wakes up Sky/Plane, which only animate when isRotating is true)
  const wheelTimeout = useRef(null);

  // --- Season tinting ---
  const baseColor = useMemo(
    () => materials.PaletteMaterial001.color.clone(),
    [materials]
  );
  const springColor = useMemo(() => new THREE.Color("#ffd6e8"), []); // soft blossom pink

  // Warm point lights scattered around the island — off by day, they fade
  // in at night to look like windows/lanterns glowing in the dark.
  const nightLightRefs = useRef([]);
  const NIGHT_LIGHT_POSITIONS = useMemo(
    () => [
      [3.2, 2.2, -1.8],
      [-4.5, 1.8, 2.6],
      [0.6, 2.6, 6.4],
      [-2.0, 1.6, -5.5],
    ],
    []
  );

  useFrame(() => {
    const seasonTarget = season === "spring" ? springColor : baseColor;
    // Dim the island's own surface a bit at night, on top of whatever
    // season tint is already active, so it reads as moonlit rather than
    // just "the same colors with lights added."
    const finalTarget = isNight
      ? seasonTarget.clone().multiplyScalar(0.55)
      : seasonTarget;
    materials.PaletteMaterial001.color.lerp(finalTarget, 0.03);

    // Fade the warm night lights in/out smoothly rather than snapping.
    const targetIntensity = isNight ? 3 : 0;
    nightLightRefs.current.forEach((light) => {
      if (!light) return;
      light.intensity = THREE.MathUtils.lerp(
        light.intensity,
        targetIntensity,
        0.04
      );
    });
  });

  // Handle keydown events (kept — arrow keys still rotate the island)
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  // Touch events for mobile devices (kept — this is the mobile equivalent
  // of scrolling, since phones don't have a scroll wheel over the canvas)
  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  }

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  }

  const handleTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;

      islandRef.current.rotation.y += delta * 0.01 * Math.PI;
      lastX.current = clientX;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  }

  // Handle mouse wheel / scroll event — the ONLY way desktop rotation is
  // triggered now (no more mouse click/drag at all). Adds momentum instead
  // of snapping rotation directly, so useFrame's damping loop can glide it
  // smoothly. Also briefly sets isRotating so Sky/Plane (which only animate
  // when isRotating is true) respond to scrolling.
  const handleWheel = (event) => {
    event.preventDefault();

    // Flipped so scroll DOWN = forward, scroll UP = backward.
    const direction = event.deltaY > 0 ? -1 : 1;

    const magnitude = Math.min(Math.abs(event.deltaY), 100);
    // Much smaller than before — a typical mouse wheel fires deltaY ~100
    // per tick, which was hitting max speed almost instantly. This keeps
    // even a hard scroll feeling slow and deliberate.
    const speedIncrement = (magnitude / 100) * 0.0012;

    rotationSpeed.current += direction * speedIncrement;

    // Hard ceiling on speed — even spamming the scroll wheel can't exceed this
    const maxSpeed = 0.006;
    rotationSpeed.current = Math.max(
      -maxSpeed,
      Math.min(maxSpeed, rotationSpeed.current)
    );

    setIsRotating(true);
    clearTimeout(wheelTimeout.current);
    wheelTimeout.current = setTimeout(() => setIsRotating(false), 200);
  };

  useEffect(() => {
    // NOTE: pointerdown/pointerup/pointermove (mouse click-drag) are
    // intentionally NOT registered anymore — scroll and touch are the
    // only ways to rotate the island now, so clicking never interferes.
    const canvas = gl.domElement;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);
      clearTimeout(wheelTimeout.current);
    };
  }, [gl]);

  // This function is called on each frame update
  useFrame(() => {
    islandRef.current.rotation.y += rotationSpeed.current;
    rotationSpeed.current *= dampingFactor;

    if (Math.abs(rotationSpeed.current) < 0.001) {
      rotationSpeed.current = 0;
    }

    if (isRotating) {
      const rotation = islandRef.current.rotation.y;

      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }
    }
  });

  return (
    // {Island 3D model from: https://sketchfab.com/3d-models/foxs-islands-163b68e09fcc47618450150be7785907}
    <a.group ref={islandRef} {...props}>
      <mesh
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />

      {NIGHT_LIGHT_POSITIONS.map((pos, i) => (
        <pointLight
          key={i}
          ref={(el) => (nightLightRefs.current[i] = el)}
          position={pos}
          color="#ffb86b"
          intensity={0}
          distance={7}
          decay={2}
        />
      ))}

      {STAGE_MARKERS.map(({ stage, label, icon, position }) => (
        <group key={stage} position={position}>
          <DiamondMarker
            label={label}
            icon={icon}
            isActive={currentStage === stage}
          />
        </group>
      ))}
    </a.group>
  );
}