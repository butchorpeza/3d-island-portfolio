import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

import planeScene from "../assets/3d/plane.glb";

// 3D Model — animation now always plays on its own, independent of scroll/isRotating
export function Plane(props) {
  const ref = useRef();
  const { scene, animations } = useGLTF(planeScene);
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    // Optional chaining (?.) prevents a crash if this clip name doesn't
    // exist on your model (e.g. different name, or no animation at all)
    actions["Take 001"]?.play();

    return () => {
      actions["Take 001"]?.stop();
    };
  }, [actions]);

  return (
    <mesh {...props} ref={ref}>
      <primitive object={scene} />
    </mesh>
  );
}