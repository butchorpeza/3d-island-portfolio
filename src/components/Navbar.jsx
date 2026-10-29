import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

const HamburgerIcon = ({ isOpen }) => (
  <div className="button-inner">
    <div className="icon-container">
      <div className="flex h-4 w-6 flex-col justify-between">
        <span
          className={`line h-0.5 w-full bg-current transition-transform duration-300 ease-out ${
            isOpen ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`line h-0.5 w-full bg-current transition-opacity duration-200 ease-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`line h-0.5 w-full bg-current transition-transform duration-300 ease-out ${
            isOpen ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-6 px-6 py-5 sm:px-8">
        <NavLink to="/" className="font-poppins text-lg font-semibold leading-tight tracking-tight text-slate-900">
          BUTCHs
          <br />
          WORLD
        </NavLink>
      </header>

      {/* Fixed toggle button — sits above the panel at all times (higher
          z-index than both header and panel) so it stays clickable and
          morphs hamburger <-> X in place, bruno-simon style. */}
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed top-6 right-0 z-[60] flex h-14 w-14 items-center justify-center bg-gradient-to-br from-[#4a1f1f] to-[#2a1512] text-white transition-transform hover:scale-105"
      >
        <HamburgerIcon isOpen={isOpen} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in panel — full screen, frosted brown/white blur so the 3D
          scene shows through softly behind it. */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-white/25 via-[#4a3628]/60 to-[#2a1a12]/85 backdrop-blur-2xl transition-opacity duration-500 ease-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute top-6 left-6">
          <span className="font-poppins text-lg font-semibold leading-tight tracking-tight text-white">
            BUTCHs
            <br />
            WORLD
          </span>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `text-3xl font-semibold transition-colors ${
                  isActive ? "text-blue-400" : "text-white hover:text-slate-200"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="pb-6 text-center text-sm text-white/70">
          &copy; 2026, Butch Orpeza
        </div>
      </div>
    </>
  );
};

export default Navbar;