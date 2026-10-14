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
      "I am a B.S. Information Systems (Systemvetenskap) student at Uppsala University and the founder/full-stack developer behind Nationsmaten.se, reaching over 1,600 monthly active users and 23,000+ page views during semester peaks across Uppsala's 13 student nations.",
      "My technical background spans full-stack web platforms, machine learning desktop overlays, financial analytics, and modern AI tool integrations (including the Esatto GenAI hackathon), using C#, Python, PHP, JavaScript, SQL, and OCaml.",
      "Beyond software engineering, I am passionate about AI vibecoding, playing piano and guitar, reading, and deep strategic tabletop board games (Mage Knight and Dune: Imperium)."
    ],
    socials: [
      { name: "GitHub", url: "https://github.com/DustyKevin44", icon: "github" },
      { name: "Nationsmaten.se", url: "https://nationsmaten.se", icon: "external-link" },
      { name: "Email", url: "mailto:kevin.ferm6@gmail.com", icon: "mail" }
    ],
    stats: [
      { label: "Active Platform Users", value: "1.6k+ MAU" },
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
      tagline: "Production web platforms, real-time ML & financial analytics",
      coordinates: { x: 0, y: 0, zoom: 1.15 },
      cameraOffset: { x: 200, y: 0 },
      color: "#34d399", // Emerald Mint
      secondaryColor: "#059669",
      icon: "code",
      summary: "Hands-on software engineering spanning live multi-tenant web applications, real-time game client ML overlays, and statistical quantitative finance.",
      items: [
        {
          title: "Nationsmaten.se",
          role: "Founder & Full-Stack Developer",
          period: "Oct 2025 – Present",
          badge: "Featured Production Platform",
          category: "Full-Stack Web Platform",
          description: "Built and scaled a daily dining aggregator centralizing lunch and pub menus across all 13 Uppsala student nations. Reached over 1,600 monthly active users and 23,000+ page views during semester peaks.",
          metrics: "1.6k+ Peak MAU • 23k+ Views • 13 Student Nations",
          tags: ["PHP", "JavaScript", "SQL", "cPanel", "phpMyAdmin", "Full-Stack Architecture"],
          demoUrl: "https://nationsmaten.se",
          githubUrl: "https://github.com/DustyKevin44"
        },
        {
          title: "League Win Predictor",
          role: "Creator & ML Developer",
          period: "2024",
          badge: "Real-Time Machine Learning",
          category: "Game AI & Desktop App",
          description: "Real-time win probability predictor for League of Legends powered by a Random Forest machine learning model. Interfaces live with Riot's local Client API (127.0.0.1:2999) to display an in-game prediction overlay.",
          metrics: "Real-Time Riot API • Random Forest Model • Live Overlay",
          tags: ["Python", "Scikit-Learn", "Machine Learning", "Riot Games API", "PyInstaller"],
          githubUrl: "https://github.com/DustyKevin44/LeagueWinrateProgram"
        },
        {
          title: "Stock Closeness & Market Analytics AI",
          role: "Quantitative Developer",
          period: "2024",
          badge: "Algorithmic Finance",
          category: "Quantitative Analysis & C#",
          description: "Quantitative financial analysis program calculating Pearson correlation and cointegration scores on equity return series to detect paired trading opportunities and market divergence using AlphaVantage data.",
          metrics: "Cointegration & Pearson Scoring • AlphaVantage API • Timeseries Data",
          tags: ["C#", ".NET", "Statistical Analysis", "AlphaVantage API", "Financial Engineering"],
          githubUrl: "https://github.com/DustyKevin44/StockClosenessAI"
        }
      ],
      // Core Technical Stack
      techStack: {
        languages: ["C#", "Python", "PHP", "JavaScript", "HTML", "CSS", "SQL", "OCaml", "Tailwind CSS"],
        tools: ["Git / GitHub", "phpMyAdmin", "cPanel", "Visio", "PowerApps"]
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
      tagline: "Vibecoding, acoustic music & literature",
      coordinates: { x: -360, y: 280, zoom: 1.25 },
      cameraOffset: { x: 200, y: 0 },
      color: "#38bdf8", // Sky Cyan
      secondaryColor: "#0284c7",
      icon: "sparkles",
      summary: "Creative passions in and out of the flow state: AI vibecoding, acoustic music, and classic literature.",
      items: [
        {
          title: "Vibecoding & Creative AI",
          icon: "sparkles",
          badge: "Flow State & AI Prototyping",
          description: "Exploring creative flow with modern AI pair programmers—rapidly turning spontaneous ideas, interactive experiments, and mechanics into functional software at the speed of thought."
        },
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
      tagline: "Strategic tabletop games",
      coordinates: { x: 380, y: 280, zoom: 1.25 },
      cameraOffset: { x: 200, y: 0 },
      color: "#f43f5e", // Rose Coral
      secondaryColor: "#e11d48",
      icon: "dice",
      summary: "Deep strategic tabletop gaming focusing on tactical deck-building and asymmetrical strategy.",
      items: [
        {
          title: "Favorite Board Games",
          icon: "dice",
          badge: "Tabletop Strategy",
          description: "Avid tabletop strategist and board game player focusing on deep asymmetrical deck-building and tactical adventure games.",
          favoriteGames: ["Mage Knight", "Dune: Imperium"]
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
