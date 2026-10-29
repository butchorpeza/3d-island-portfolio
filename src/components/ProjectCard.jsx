import { useId } from "react";

// White "clay" frame — the shadow is what separates the card from the white
// page background, not a color fill. Override per-project by adding
// accentColor: "#hex" in projectsData.js if you want a project to stand out.
const SITE_ACCENT = "#FFFFFF";

// Layered shadow classes for a soft, raised clay/3D look: a tight shadow for
// contact right under the card, plus a wide soft one for the ambient lift.
// Shadow deepens on hover so the lift reads as physical, not just color.
const CLAY_SHADOW =
  "shadow-[0_1px_2px_rgba(15,23,42,0.06),0_10px_20px_-6px_rgba(15,23,42,0.12),0_28px_48px_-20px_rgba(15,23,42,0.18)]";
const CLAY_SHADOW_HOVER =
  "hover:shadow-[0_1px_2px_rgba(15,23,42,0.06),0_16px_28px_-8px_rgba(15,23,42,0.16),0_36px_64px_-20px_rgba(15,23,42,0.24)]";

const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ProjectCard = ({ project, onView }) => {
  const accent = project.accentColor || SITE_ACCENT;
  const pathId = useId();
  const badgeText = project.badge || project.category;

  return (
    <div
      className={`group cursor-pointer rounded-[28px] p-3 pb-4 border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-1.5 ${CLAY_SHADOW} ${CLAY_SHADOW_HOVER}`}
      style={{ backgroundColor: accent }}
      onClick={() => onView(project)}
    >
      {/* Media zone: image or video only — no text lives on top of it */}
      <div className="relative overflow-hidden rounded-[20px] bg-black aspect-[4/3]">
        {project.previewVideo ? (
          <video
            src={project.previewVideo}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Hover scrim + spinning "click to open" badge, stays confined to the media */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
          <div className="relative w-24 h-24 scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_8s_linear_infinite]">
              <defs>
                <path
                  id={pathId}
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text fill="white" fontSize="7.5" letterSpacing="2" fontWeight="600">
                <textPath href={`#${pathId}`} startOffset="0%">
                  CLICK TO OPEN &#8226; CLICK TO OPEN &#8226;
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 m-auto w-9 h-9 flex items-center justify-center rounded-full bg-white text-slate-900">
              <EyeIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Name / category pills — live below the media, inside the colored frame */}
      <div className="mt-3 flex items-center justify-between gap-2 px-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="max-w-[60%] truncate rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          {project.title}
        </span>
        {badgeText && (
          <span className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            &#8226; {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
