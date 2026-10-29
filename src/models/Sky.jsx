import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import skyScene from "../assets/3d/sky.glb";

const BLUR_AMOUNT = 20; // increase for more blur, decrease for less

// 3D Model from: https://sketchfab.com/3d-models/phoenix-bird-844ba0cf144a413ea92c779f18912042
export function Sky({ isRotating }) {
  const sky = useGLTF(skyScene);
  const skyRef = useRef();

  useEffect(() => {
    sky.scene.traverse((child) => {
      if (!child.isMesh || !child.material?.map) return;

      const texture = child.material.map;

      // Guard: only blur the ORIGINAL source image once. Without this,
      // re-running this effect (hot reload, re-mount, etc.) would blur
      // an already-blurred canvas texture, making blur changes behave
      // unpredictably or seem to have "no effect."
      const sourceImage = texture.userData.originalImage || texture.image;
      if (!sourceImage || !sourceImage.width) return;

      const canvas = document.createElement("canvas");
      canvas.width = sourceImage.width;
      canvas.height = sourceImage.height;
      const ctx = canvas.getContext("2d");
      ctx.filter = `blur(${BLUR_AMOUNT}px)`;
      ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

      const blurredTexture = new THREE.CanvasTexture(canvas);
      blurredTexture.wrapS = texture.wrapS;
      blurredTexture.wrapT = texture.wrapT;
      blurredTexture.anisotropy = 16;
      blurredTexture.minFilter = THREE.LinearMipmapLinearFilter;
      blurredTexture.magFilter = THREE.LinearFilter;
      blurredTexture.generateMipmaps = true;
      blurredTexture.needsUpdate = true;
      // Remember the true original so future re-runs re-blur from
      // scratch instead of stacking blur on top of blur.
      blurredTexture.userData.originalImage = sourceImage;

      child.material.map = blurredTexture;
      child.material.needsUpdate = true;
    });
  }, [sky]);

  useFrame((_, delta) => {
    // Sky always rotates gently on its own, independent of scrolling
    skyRef.current.rotation.y += 0.1 * delta;
  });

  return (
    <mesh ref={skyRef}>
      <primitive object={sky.scene} />
    </mesh>
  );
}