import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";

import CaseStudyModal from "../components/CaseStudyModal";
import { projects } from "../constants/projectsData";
import signImage from "../assets/images/projectSign.png";
import { Bird, Island, Plane, Sky } from "../models";

// The flat sign board as a textured plane in 3D space
const SignPlane = () => {
  const texture = useTexture(signImage);
  return (
    <mesh>
      <planeGeometry args={[10, 5.67]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

const ArrowLeftIcon = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M10 50 L45 15 L45 35 L90 35 L90 65 L45 65 L45 85 Z" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M90 50 L55 15 L55 35 L10 35 L10 65 L55 65 L55 85 Z" />
  </svg>
);

const Projects = () => {
  const [index, setIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const project = projects[index];

  const goPrev = () =>
    setIndex((i) => (i - 1 + projects.length) % projects.length);
  const goNext = () => setIndex((i) => (i + 1) % projects.length);

  return (
    <section className="w-full h-screen relative bg-transparent overflow-hidden">
      {/* Blurred backdrop layer */}
      <div className="absolute inset-0 -z-10 blur-md">
        <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[2, 3, 4]} intensity={1} />
          <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />
          <Suspense fallback={null}>
            <Bird />
            <Sky />
            <Island
              isRotating={false}
              setIsRotating={() => {}}
              setCurrentStage={() => {}}
              position={[0, -6.5, -43.4]}
              rotation={[0.1, 4.7077, 0]}
              scale={[1, 1, 1]}
            />
            <Plane
              position={[0, -1.5, -4]}
              rotation={[0, 20.1, 0]}
              scale={[3, 3, 3]}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Sharp foreground layer */}
      <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 3, 4]} intensity={1} />

        <Suspense fallback={null}>
          <SignPlane />

          <Html position={[0, 2.27, 0.01]} center style={{ pointerEvents: "none" }}>
            <h1 className="text-white text-2xl font-bold whitespace-nowrap drop-shadow">
              {project.title}
            </h1>
          </Html>

          <Html position={[0, 1.7, 0.01]} center>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm font-medium underline underline-offset-2 whitespace-nowrap"
              >
                {project.liveUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </Html>

          <Html position={[0, -0.4, 0.01]} center>
            <button
              onClick={() => setSelectedProject(project)}
              className="block w-[420px] rounded overflow-hidden shadow-lg hover:opacity-90 transition-opacity"
            >
              <img
                src={project.heroImage}
                alt={project.title}
                className="w-full h-[300px] object-cover"
              />
            </button>
          </Html>

          <Html position={[-3.9, -0.0, 0.01]} center>
            <button
              onClick={goPrev}
              aria-label="Previous project"
              className="flex items-center justify-center p-2 text-white hover:scale-110 transition-transform"
            >
              <ArrowLeftIcon className="w-24 h-24" />
            </button>
          </Html>

          <Html position={[3.9, -0.0, 0.01]} center>
            <button
              onClick={goNext}
              aria-label="Next project"
              className="flex items-center justify-center p-2 text-white hover:scale-110 transition-transform"
            >
              <ArrowRightIcon className="w-24 h-24" />
            </button>
          </Html>

          {/* Bottom row — arrows sit outside the pagination box, same row alignment */}
          <Html position={[0, -1.95, 0.01]} center>
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={goPrev}
                aria-label="Previous project"
                className="flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <ArrowLeftIcon className="w-16 h-16" />
              </button>

              {/* Pagination box — untouched from before */}
              <div className="flex items-center gap-3.5 px-16 py-6">
                {projects.map((_, i) => (
                  <span
                    key={i}
                    className={`w-10 h-10 transition-colors ${
                      i === index ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                aria-label="Next project"
                className="flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <ArrowRightIcon className="w-16 h-16" />
              </button>
            </div>
          </Html>
        </Suspense>
      </Canvas>

      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Projects;