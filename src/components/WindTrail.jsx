import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * WindTrail — horizontal streaking "speed line" particles that move
 * left-to-right (matching the plane's horizontal orientation), rendered
 * as soft glowing sprites (radial gradient) instead of sharp solid bars,
 * for a smoother, more premium "motion blur" look.
 */
const PARTICLE_COUNT = 100;

// Build a soft, BLURRED radial-gradient texture once, reused by every particle
function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.6)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  // Extra blur pass on top of the gradient for a softer, hazier streak
  ctx.filter = "blur(38px)";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function WindTrail({ isRotating }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const glowTexture = useMemo(() => createGlowTexture(), []);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      x: -100 + Math.random() * -40,
      y: (Math.random() - 0.5) * 90,
      z: -40 + (Math.random() - 0.5) * 16,
      speed: 0.6 + Math.random() * 1.2,
      length: 2 + Math.random() * 2.5,
    }));
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const targetOpacity = isRotating ? 0.1 : 0;
    meshRef.current.material.opacity +=
      (targetOpacity - meshRef.current.material.opacity) * 0.06;

    particles.forEach((p, i) => {
      if (isRotating) {
        p.x += p.speed;
        if (p.x > 100) {
          p.x = -140;
          p.y = (Math.random() - 0.5) * 90;
          p.z = -40 + (Math.random() - 0.5) * 16;
        }
      }

      dummy.position.set(p.x, p.y, p.z);
      // Wide + short + soft-edged (via the glow texture) reads as a
      // gentle streak/blur rather than a hard-edged bar
      dummy.scale.set(p.length * (isRotating ? 3 : 0.5), 0.35, 0.35);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]} renderOrder={999}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={glowTexture}
        color='#ffffff'
        transparent
        opacity={0}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}