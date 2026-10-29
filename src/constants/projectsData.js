// Each project's images live in /public/projects/<id>/
// Drop screenshots into that folder using these exact filenames:
//   hero.jpg          -> main case-study image + grid thumbnail
//   gallery-1.jpg ...  -> additional images shown in the case study gallery
// No code changes needed when you add new screenshots — just match the filenames.

const basePath = (id) => `/projects/${id}`;

export const CATEGORIES = ["All", "Web Design", "3D Design", "Graphic Design"];

export const projects = [
  {
    id: "joa-electrical",
    title: "JOA Electrical",
    category: "Web Design",
    tagline: "UI/UX Design",
    description:
      "Designed the user experience and interface for a professional electrical services website, focusing on clear service navigation, strong visual hierarchy, and conversion-focused layouts.",
    overview:
      "JOA Electrical is a licensed residential electrician serving Perth's Northern Suburbs. The site needed to build trust quickly, make it easy to book a job, and clearly present a long list of services and service areas without overwhelming visitors.",
    role: ["UI/UX Design", "Information Architecture", "Responsive Design"],
    tools: ["Figma", "WordPress", "Bricks Builder"],
    process: [
      "Discovery — understand services, service areas, and booking flow",
      "Design — wireframes and visual design in Figma",
      "Build — implemented in WordPress",
      "Refinement — content and layout polish",
      "Launch",
    ],
    results:
      "Live site with a clear service directory, prominent booking calls-to-action, and a structure that highlights the business's 5.0-star review rating.",
    heroImage: `${basePath("joa-electrical")}/hero.jpg`,
    gallery: [
      `${basePath("joa-electrical")}/gallery-1.jpg`,
      `${basePath("joa-electrical")}/gallery-2.jpg`,
      `${basePath("joa-electrical")}/gallery-3.jpg`,
    ],
    liveUrl: "https://joaelectrical.com/",
  },
  {
    id: "north-horizon",
    title: "North Horizon Heli Adventures",
    category: "Web Design",
    tagline: "WordPress Development",
    description:
      "Developed a WordPress website for a helicopter adventure company, presenting scenic flights, exclusive landings, heli swims, and tailored experiences in an engaging digital experience.",
    overview:
      "North Horizon offers scenic helicopter flights and adventure experiences. The site needed to sell the experience visually while making it simple for visitors to browse flight options and enquire.",
    role: ["WordPress Development", "Responsive Design"],
    tools: ["WordPress", "Elementor"],
    process: [
      "Discovery",
      "Design",
      "Development",
      "Refinement",
      "Launch",
    ],
    results: "Live site presenting the full range of flight experiences with a clear enquiry path.",
    heroImage: `${basePath("north-horizon")}/hero.jpg`,
    gallery: [
      `${basePath("north-horizon")}/gallery-1.jpg`,
      `${basePath("north-horizon")}/gallery-2.jpg`,
    ],
    liveUrl: "https://northhorizonheliadventures.com.au/",
  },
  {
    id: "milaboo",
    title: "Milaboo",
    category: "Web Design",
    tagline: "Shopify Development",
    description:
      "Developed and customized a Shopify e-commerce experience, focusing on responsive layouts, product presentation, and a smooth shopping experience.",
    overview:
      "Milaboo needed a Shopify store that presented products clearly and worked smoothly across devices for everyday shoppers.",
    role: ["Shopify Development", "Responsive Design"],
    tools: ["Shopify", "Liquid"],
    process: ["Discovery", "Design", "Development", "Refinement", "Launch"],
    results: "Live Shopify store with a streamlined shopping experience.",
    heroImage: `${basePath("milaboo")}/hero.jpg`,
    gallery: [
      `${basePath("milaboo")}/gallery-1.jpg`,
      `${basePath("milaboo")}/gallery-2.jpg`,
    ],
    liveUrl: "https://milaboo.de/",
  },
  {
    id: "floral-affairs",
    title: "Floral Affairs",
    category: "Web Design",
    tagline: "Shopify Development",
    description:
      "Developed a Shopify e-commerce website for a Melbourne flower business, with a focus on product presentation, responsive design, and a seamless customer journey.",
    overview:
      "Floral Affairs is a Melbourne-based flower business needing an online store that made browsing and ordering arrangements simple and visually appealing.",
    role: ["Shopify Development", "Responsive Design"],
    tools: ["Shopify", "Liquid"],
    process: ["Discovery", "Design", "Development", "Refinement", "Launch"],
    results: "Live Shopify store supporting online orders for the business.",
    heroImage: `${basePath("floral-affairs")}/hero.jpg`,
    gallery: [
      `${basePath("floral-affairs")}/gallery-1.jpg`,
      `${basePath("floral-affairs")}/gallery-2.jpg`,
    ],
    liveUrl: "https://floralaffairs.com.au/",
  },
  {
    id: "brandon-parker",
    title: "Brandon Parker",
    category: "Web Design",
    tagline: "Web Development",
    description:
      "Developed a personal brand website designed to present Brandon Parker's work, background, and professional presence through a clean, focused web experience.",
    overview:
      "A personal brand site built to present Brandon Parker's work and professional background clearly and simply.",
    role: ["Web Development", "Responsive Design"],
    tools: ["WordPress"],
    process: ["Discovery", "Design", "Development", "Refinement", "Launch"],
    results: "Live personal brand website.",
    heroImage: `${basePath("brandon-parker")}/hero.jpg`,
    gallery: [`${basePath("brandon-parker")}/gallery-1.jpg`],
    liveUrl: "https://brandonparker.com/",
  },
  {
    id: "land-ai",
    title: "Land AI",
    category: "Web Design",
    tagline: "GHL AI Web Development",
    description:
      "Developed an AI-focused website experience for Land AI, presenting its done-for-you land acquisition system and AI-powered approach to real estate lead generation.",
    overview:
      "Land AI offers a done-for-you, AI-powered land acquisition and lead-generation system for real estate. The site needed to explain the AI-driven system clearly and drive enquiries.",
    role: ["Web Development", "GoHighLevel (GHL) Build"],
    tools: ["GoHighLevel"],
    process: ["Discovery", "Design", "Development", "Refinement", "Launch"],
    results: "Live site presenting the AI land acquisition system.",
    heroImage: `${basePath("land-ai")}/hero.jpg`,
    gallery: [`${basePath("land-ai")}/gallery-1.jpg`],
    liveUrl: "https://landai.ai/",
  },
];
