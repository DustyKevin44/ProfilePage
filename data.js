/**
 * =====================================================================
 * DEVELOPER PORTFOLIO DATA CONFIGURATION
 * =====================================================================
 * Drives all content, credentials, coordinates, and landmarks across
 * the interactive archipelago. Editing this file updates the site
 * without modifying rendering or camera code.
 * =====================================================================
 */

const PORTFOLIO_DATA = {
  // Developer profile information
  profile: {
    name: "Kevin Ferm",
    title: "Information Systems Student & Full-Stack Developer",
    tagline: "Student at Uppsala University & founder of Nationsmaten.se. Passionate about full-stack engineering, AI prototypes, and clean software architectures.",
    status: "Open to opportunities & projects",
    location: "Uppsala, Sweden",
    avatar: "assets/avatar.svg",
    initials: "KF",
    bio: [
      "I am a B.S. Information Systems (Systemvetenskap) student at Uppsala University and the founder/full-stack developer behind Nationsmaten.se, serving 500+ monthly users across Uppsala's 13 student nations.",
      "My technical background spans full-stack web platforms, modern AI tool integrations (including the Esatto GenAI hackathon), C#, Python, PHP, JavaScript, SQL, and OCaml.",
      "Beyond software development, I am passionate about telephoto photography (Nikon D7100), piano and guitar, European backpacking (Interrail), and deep tabletop strategy gaming (Mage Knight and Dune: Imperium)."
    ],
    socials: [
      { name: "GitHub", url: "https://github.com/DustyKevin44", icon: "github" },
      { name: "Nationsmaten.se", url: "https://nationsmaten.se", icon: "external-link" },
      { name: "Email", url: "mailto:kevin.ferm6@gmail.com", icon: "mail" }
    ],
    stats: [
      { label: "Active Platform Users", value: "500+" },
      { label: "Student Nations", value: "13" },
      { label: "University Timeline", value: "2025–2028" },
      { label: "Gymnasiet Honors", value: "Summa Cum Laude" }
    ]
  },

  // 5 Exploratory Districts (Keys 1 - 5)
  zones: [
    {
      id: "academy",
      key: "1",
      number: 1,
      name: "The Academy District",
      category: "Education",
      tagline: "Academic foundation, systems engineering & honors",
      coordinates: { x: -400, y: -220, zoom: 1.25 },
      cameraOffset: { x: 200, y: 0 },
      color: "#fbbf24", // Amber Gold
      secondaryColor: "#d97706",
      icon: "graduation-cap",
      summary: "Higher education in Information Systems at Uppsala University, complemented by a summa cum laude diploma in Information and Media Technology.",
      items: [
        {
          degree: "Bachelor of Science in Information Systems (Systemvetenskap)",
          institution: "Uppsala University",
          period: "2025 — 2028",
          location: "Uppsala, Sweden",
          status: "Current Degree",
          highlights: [
            "Specializing in enterprise systems analysis, software engineering methodologies, data architecture, and organizational IT solutions.",
            "Building high-impact student software platforms in the vibrant academic ecosystem of Uppsala."
          ]
        },
        {
          degree: "Information and Media Technology",
          institution: "Alströmergymnasiet",
          period: "2022 — 2025",
          location: "Alingsås, Sweden",
          gpa: "Graduated Summa Cum Laude",
          highlights: [
            "Graduated summa cum laude for outstanding academic excellence.",
            "Awarded the prestigious Nils Trolle-Lindgren Stipend for academic excellence.",
            "Teknikcollege certified, validating comprehensive quality standards in technology and mathematics education."
          ],
          coursework: [
            "Information & Media Technology",
            "Software & Programming Fundamentals",
            "Web Development & Digital Design",
            "Advanced Mathematics & Technology"
          ]
        }
      ]
    },

    {
      id: "workshop",
      key: "2",
      number: 2,
      name: "The Workshop / Forge",
      category: "Projects & Tech Stack",
      tagline: "Production web platforms, AI hackathon prototypes & core stack",
      coordinates: { x: 0, y: 0, zoom: 1.15 },
      cameraOffset: { x: 200, y: 0 },
      color: "#34d399", // Emerald Mint
      secondaryColor: "#059669",
      icon: "code",
      summary: "Hands-on software engineering spanning live multi-tenant web applications, AI API integrations, and 3D prototyping workflows.",
      items: [
        {
          title: "Nationsmaten.se",
          role: "Founder & Full-Stack Developer",
          period: "Oct 2025 — Present",
          badge: "Featured Production Platform",
          category: "Full-Stack Web Platform",
          description: "Built a platform from scratch using PHP, JavaScript, and SQL to aggregate dining menus from all 13 Uppsala student nations, serving 500+ monthly users.",
          metrics: "500+ Monthly Users • 13 Student Nations Menus Aggregated",
          tags: ["PHP", "JavaScript", "SQL", "cPanel", "phpMyAdmin", "Full-Stack Architecture"],
          demoUrl: "https://nationsmaten.se",
          githubUrl: "https://github.com/DustyKevin44"
        }
      ],
      // Core Technical Stack
      techStack: {
        languages: ["C#", "Python", "PHP", "JavaScript", "HTML", "CSS", "SQL", "OCaml", "Tailwind CSS"],
        tools: ["Git / GitHub", "phpMyAdmin", "cPanel", "Visio", "PowerApps", "Bambu Lab A1 Mini (3D Printing)"]
      }
    },

    {
      id: "skyline",
      key: "3",
      number: 3,
      name: "The Corporate Skyline",
      category: "Work Experience",
      tagline: "Venture development, high-volume service & teamwork",
      coordinates: { x: 420, y: -220, zoom: 1.25 },
      cameraOffset: { x: 200, y: 0 },
      color: "#818cf8", // Electric Indigo
      secondaryColor: "#4f46e5",
      icon: "briefcase",
      summary: "Commercial venture creation, business development, and fast-paced collaborative service operations under pressure.",
      items: [
        {
          role: "Summer Entrepreneur",
          company: "Camp Entrepreneur",
          period: "June 2024 — Aug 2024",
          location: "Alingsås, Sweden",
          description: "Completed an intensive business development and marketing program in Alingsås, studying local industry models and taking a small summer venture from concept to execution.",
          achievements: [
            "Conducted local market analysis and formulated viable commercial business strategies.",
            "Took an independent summer business venture from concept and branding through to sales and fulfillment.",
            "Trained in customer acquisition, marketing pipelines, and entrepreneurial budgeting."
          ],
          technologies: ["Business Development", "Marketing Strategy", "Concept Execution", "Customer Outreach"]
        },
        {
          role: "Team Member",
          company: "Max Burgers",
          period: "May 2025 — Aug 2025",
          location: "Sweden",
          description: "Delivered customer service in a high-pressure environment, maintaining food safety standards and collaborating with team members to optimize workflow efficiency.",
          achievements: [
            "Delivered prompt, high-standard customer service during intense peak rush periods.",
            "Maintained strict hygiene, sanitation, and food safety protocols in a fast-paced kitchen.",
            "Collaborated closely with colleagues across stations to minimize wait times and maximize order throughput."
          ],
          technologies: ["Workflow Optimization", "Customer Relations", "High-Volume Teamwork", "Food Safety"]
        }
      ]
    },

    {
      id: "studio",
      key: "4",
      number: 4,
      name: "The Studio",
      category: "Creative Hobbies & Lifestyle",
      tagline: "Photography, acoustic music, literature & European travel",
      coordinates: { x: -360, y: 280, zoom: 1.25 },
      cameraOffset: { x: 200, y: 0 },
      color: "#38bdf8", // Sky Cyan
      secondaryColor: "#0284c7",
      icon: "camera",
      summary: "Creative passions away from the terminal: high-detail photography, instrumental music, reading, and backpacking across Europe.",
      items: [
        {
          title: "Piano, Guitar & Reading",
          icon: "music",
          badge: "Acoustic & Literature",
          description: "Playing piano and guitar alongside an avid dedication to reading across technical topics, philosophy, and classic storytelling."
        }
      ]
    },

    {
      id: "gameden",
      key: "5",
      number: 5,
      name: "The Game Den",
      category: "Tabletop & Board Games",
      tagline: "Strategic tabletop games, custom 3D printing & D&D",
      coordinates: { x: 380, y: 280, zoom: 1.25 },
      cameraOffset: { x: 200, y: 0 },
      color: "#f43f5e", // Rose Coral
      secondaryColor: "#e11d48",
      icon: "dice",
      summary: "Deep strategic tabletop gaming, custom 3D printed organization inserts, and collaborative campaign storytelling.",
      items: [
        {
          title: "Board Game Collection & Custom Inserts",
          icon: "dice",
          badge: "Strategy & 3D Design",
          description: "Avid collector and tabletop strategist. Crafts custom inserts and organizes components with precise tolerances using a Bambu Lab A1 Mini 3D printer.",
          favoriteGames: ["Mage Knight", "Dune: Imperium"],
          customWork: "Custom 3D-printed box organizers and component trays designed for swift game setup."
        }
      ]
    }
  ],

  // Visual theme settings
  islandTheme: {
    oceanBackground: "#070b14",
    gridColor: "rgba(56, 189, 248, 0.04)",
    landFill: "#0f172a",
    landBorder: "#1e293b",
    contourColor: "rgba(148, 163, 184, 0.08)"
  }
};

// Make accessible to browser window
if (typeof window !== "undefined") {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}

// Support ES modules if loaded via import
if (typeof module !== "undefined" && module.exports) {
  module.exports = PORTFOLIO_DATA;
}
