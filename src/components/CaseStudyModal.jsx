import { useEffect } from "react";

const CaseStudyModal = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl min-h-full sm:min-h-0 sm:my-10 sm:rounded-3xl shadow-2xl relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-xl text-slate-700"
        >
          ×
        </button>

        <img
          src={project.heroImage}
          alt={project.title}
          className="w-full h-[280px] sm:h-[420px] object-cover sm:rounded-t-3xl"
        />

        <div className="p-8 sm:p-12 flex flex-col gap-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-poppins font-semibold text-slate-900">
              {project.title}
            </h2>
            <p className="text-blue-600 font-medium mt-2">
              {project.tagline} · {project.category}
            </p>
          </div>

          <div>
            <h4 className="uppercase text-xs tracking-widest text-slate-400 font-semibold mb-2">
              Overview
            </h4>
            <p className="text-slate-700 leading-relaxed">{project.overview}</p>
          </div>

          {project.role?.length > 0 && (
            <div>
              <h4 className="uppercase text-xs tracking-widest text-slate-400 font-semibold mb-2">
                My Role
              </h4>
              <ul className="flex flex-wrap gap-2">
                {project.role.map((r) => (
                  <li
                    key={r}
                    className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.process?.length > 0 && (
            <div>
              <h4 className="uppercase text-xs tracking-widest text-slate-400 font-semibold mb-3">
                Process
              </h4>
              <ol className="grid sm:grid-cols-2 gap-3">
                {project.process.map((step, i) => (
                  <li key={step} className="text-slate-700">
                    <span className="text-blue-600 font-semibold mr-2">
                      {String(i + 1).padStart(2, "0")} —
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {project.tools?.length > 0 && (
            <div>
              <h4 className="uppercase text-xs tracking-widest text-slate-400 font-semibold mb-2">
                Tools
              </h4>
              <ul className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <li
                    key={tool}
                    className="text-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.gallery?.length > 0 && (
            <div>
              <h4 className="uppercase text-xs tracking-widest text-slate-400 font-semibold mb-3">
                Gallery
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.gallery.map((img) => (
                  <img
                    key={img}
                    src={img}
                    alt={`${project.title} detail`}
                    className="w-full rounded-xl object-cover aspect-[4/3]"
                  />
                ))}
              </div>
            </div>
          )}

          {project.results && (
            <div>
              <h4 className="uppercase text-xs tracking-widest text-slate-400 font-semibold mb-2">
                Results
              </h4>
              <p className="text-slate-700 leading-relaxed">{project.results}</p>
            </div>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start inline-flex items-center gap-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-full"
            >
              Visit Live Website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseStudyModal;
