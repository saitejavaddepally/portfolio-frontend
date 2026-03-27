// ResumeParser.js

export function parseResume(text) {
  if (typeof text !== "string") return emptyPortfolio();

  const cleaned = cleanText(text);
  const sections = detectSections(cleaned);

  return {
    personalInfo: extractPersonalInfo(cleaned),
    professionalSummary: extractSummary(sections.summary),
    skills: extractSkills(sections.skills || cleaned),
    experience: extractExperience(sections.experience),
    education: extractEducation(sections.education),
    projects: extractProjects(sections.projects),
    certifications: extractCertifications(sections.certifications),
  };
}

/* ================= CLEAN ================= */

function cleanText(text) {
  return text
    .replace(/\u0000/g, "")
    .replace(/•/g, "")
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ================= SECTION ENGINE ================= */

const SECTION_KEYWORDS = [
  "SUMMARY",
  "PROFILE",
  "EXPERIENCE",
  "WORK EXPERIENCE",
  "EDUCATION",
  "SKILLS",
  "PROJECTS",
  "CERTIFICATIONS",
  "KEY ACHIEVEMENTS",
  "CONTACT",
  "CONTACTS",
  "LANGUAGES",
];

function detectSections(text) {
  const sections = {};
  const upperText = text.toUpperCase();

  let indices = [];

  SECTION_KEYWORDS.forEach(keyword => {
    const index = upperText.indexOf(keyword);
    if (index !== -1) {
      indices.push({ keyword, index });
    }
  });

  indices.sort((a, b) => a.index - b.index);

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].index;
    const end = indices[i + 1]?.index || text.length;
    const sectionName = indices[i].keyword.toLowerCase().replace(" ", "");

    sections[sectionName] = text.substring(start, end).trim();
  }

  return sections;
}

/* ================= PERSONAL INFO ================= */

function extractPersonalInfo(text) {
  return {
    fullName: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    linkedin: extractLinkedIn(text),
    github: extractGitHub(text),
    portfolioWebsite: extractWebsite(text),
  };
}

function extractName(text) {
  const firstLine = text.split("  ")[0];
  return firstLine.length < 50 ? firstLine.trim() : "";
}

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  return match ? match[0] : "";
}

function extractPhone(text) {
  const match = text.match(/\+?\d{10,15}/);
  return match ? match[0] : "";
}

function extractLinkedIn(text) {
  const match = text.match(/https?:\/\/(www\.)?linkedin\.com\/[^\s]+/i);
  return match ? match[0] : "";
}

function extractGitHub(text) {
  const match = text.match(/https?:\/\/(www\.)?github\.com\/[^\s]+/i);
  return match ? match[0] : "";
}

function extractWebsite(text) {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : "";
}

function extractLocation(text) {
  const match = text.match(/Hyderabad|Bangalore|Mumbai|Delhi|Chennai|Pune|India/i);
  return match ? match[0] : "";
}

/* ================= SUMMARY ================= */

function extractSummary(summarySection) {
  if (!summarySection) return "";
  return summarySection.replace(/SUMMARY/i, "").trim();
}

/* ================= SKILLS ================= */

const SKILLS = [
  "Java",
  "Spring",
  "Spring Boot",
  "Angular",
  "Python",
  "Git",
  "SQL",
  "Linux",
  "Docker",
  "AWS",
];

function extractSkills(text) {
  return SKILLS.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

/* ================= EXPERIENCE ================= */

function extractExperience(section) {
  if (!section) return [];

  const expText = section.replace(/EXPERIENCE/i, "").trim();

  const datePattern = /\d{2}\/\d{4}/g;
  const dates = expText.match(datePattern);

  if (!dates) return [];

  return [
    {
      company: extractCompany(expText),
      role: extractRole(expText),
      location: extractLocation(expText),
      startDate: dates[0] || "",
      endDate: /Present/i.test(expText) ? null : dates[1] || "",
      isCurrent: /Present/i.test(expText),
      description: expText,
      technologies: extractSkills(expText),
    },
  ];
}

function extractCompany(text) {
  const match = text.match(/([A-Z][a-zA-Z ]+ Limited|Bank|Technologies)/);
  return match ? match[0] : "";
}

function extractRole(text) {
  const match = text.match(/Full Stack Developer|Software Engineer|Developer/i);
  return match ? match[0] : "";
}

/* ================= EDUCATION ================= */

function extractEducation(section) {
  if (!section) return [];

  const degreeMatch = section.match(/Bachelor.*?(\d{2}\/\d{4}).*?(\d{2}\/\d{4})/);

  return [
    {
      institution: extractInstitution(section),
      degree: degreeMatch ? degreeMatch[0] : "",
      fieldOfStudy: "Computer Science",
      startYear: degreeMatch ? degreeMatch[1] : "",
      endYear: degreeMatch ? degreeMatch[2] : "",
    },
  ];
}

function extractInstitution(text) {
  const match = text.match(/Institute.*?Technology/);
  return match ? match[0] : "";
}

/* ================= PROJECTS ================= */

function extractProjects(section) {
  if (!section) return [];
  return [];
}

/* ================= CERTIFICATIONS ================= */

function extractCertifications(section) {
  if (!section) return [];
  return [];
}

/* ================= EMPTY ================= */

function emptyPortfolio() {
  return {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolioWebsite: "",
    },
    professionalSummary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };
}