import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import * as mammoth from 'mammoth/mammoth.browser.js';

// Setup pdf.js worker using UNPKG CDN to avoid complex bundler configurations
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * Extracts raw text from a PDF file.
 */
export const extractTextFromPDF = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        return fullText;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to parse PDF file');
    }
};

/**
 * Extracts raw text from a DOCX file.
 */
export const extractTextFromDOCX = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    } catch (error) {
        console.error('Error parsing DOCX:', error);
        throw new Error('Failed to parse DOCX file');
    }
};

/**
 * Common tech skills dictionary for matching
 */
const SKILL_DICTIONARY = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'HTML', 'CSS', 'Sass', 'Tailwind',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'SQL', 'MySQL', 'PostgreSQL',
    'MongoDB', 'Redis', 'GraphQL', 'REST API', 'Git', 'Linux', 'Vite', 'Webpack',
    'Next.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Angular', 'Vue.js'
];

/**
 * Regex-based data extractors
 */
export const extractEmail = (text) => {
    const match = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
    return match ? match[1] : '';
};

export const extractPhone = (text) => {
    // Matches various phone formats like (123) 456-7890, 123-456-7890, +1 123 456 7890
    const match = text.match(/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/i);
    return match ? match[0].trim() : '';
};

export const extractLinkedIn = (text) => {
    const match = text.match(/(?:linkedin\.com\/in\/)([a-zA-Z0-9-]+)/i);
    return match ? `linkedin.com/in/${match[1]}` : '';
};

export const extractGitHub = (text) => {
    const match = text.match(/(?:github\.com\/)([a-zA-Z0-9-]+)/i);
    return match ? `github.com/${match[1]}` : '';
};

export const extractSkills = (text) => {
    const foundSkills = new Set();
    const lowerText = text.toLowerCase();

    // Simple exact match logic against the dictionary
    SKILL_DICTIONARY.forEach(skill => {
        // Use word boundaries for alphabetic skills, direct match for things like C++
        const regex = skill.match(/^[a-zA-Z]+$/)
            ? new RegExp(`\\b${skill}\\b`, 'i')
            : new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

        if (regex.test(lowerText)) {
            foundSkills.add(skill);
        }
    });

    return Array.from(foundSkills).slice(0, 10); // Return up to 10 matched skills
};

export const extractName = (text) => {
    // very basic name extractor: take first few words of the document
    // assuming resume starts with the name
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 0) {
        // take first line, clean it up
        const potentialName = lines[0].replace(/[^a-zA-Z\s.-]/g, '').trim();
        // if it looks like a name (2-3 words)
        const wordCount = potentialName.split(/\s+/).length;
        if (wordCount >= 1 && wordCount <= 4) {
            return potentialName;
        }
    }
    return '';
};

export const extractLocation = (text) => {
    // Looks for City, ST format (e.g., San Francisco, CA)
    const match = text.match(/([A-Z][a-zA-Z\s.-]+,\s*[A-Z]{2}\b)/);
    return match ? match[1].trim() : '';
};

/**
 * Splits resume text into heuristic sections
 */
const splitIntoSections = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const sections = {
        experience: [],
        education: [],
        projects: [],
        unmatched: []
    };

    let currentSection = 'unmatched';

    const expRegex = /^(?:work\s+)?experience|employment|work\s+history$/i;
    const eduRegex = /^education|academic\s+background$/i;
    const projRegex = /^projects|personal\s+projects$/i;
    const skillRegex = /^skills|technical\s+skills$/i;

    for (const line of lines) {
        const lowerLine = line.toLowerCase();
        if (expRegex.test(lowerLine)) {
            currentSection = 'experience';
            continue;
        } else if (eduRegex.test(lowerLine)) {
            currentSection = 'education';
            continue;
        } else if (projRegex.test(lowerLine)) {
            currentSection = 'projects';
            continue;
        } else if (skillRegex.test(lowerLine) || /summary|profile|objective/.test(lowerLine)) {
            currentSection = 'unmatched';
            continue;
        }

        sections[currentSection].push(line);
    }

    return sections;
};

export const extractExperience = (expLines) => {
    const jobs = [];
    let currentJob = null;

    // Very broad date regex matching MM/YYYY, Mon YYYY, YYYY - Present
    const dateRegex = /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}|\b\d{4}\s*-\s*(?:present|current|\d{4})\b|\b\d{2}\/\d{4}\b/i;

    for (const line of expLines) {
        if (dateRegex.test(line) || (line.length < 60 && !line.includes('•') && !currentJob)) {
            if (currentJob) jobs.push(currentJob);
            currentJob = {
                title: line.replace(dateRegex, '').replace(/[-|()]/g, '').trim() || 'Role Title',
                company: '',
                duration: '',
                description: []
            };

            const dateMatch = line.match(dateRegex);
            if (dateMatch) {
                currentJob.duration = dateMatch[0];
            }
        } else if (currentJob) {
            if (!currentJob.company && line.length < 50 && !/^[•\-\*]/.test(line)) {
                currentJob.company = line;
            } else {
                currentJob.description.push(line.replace(/^[•\-\*]\s*/, ''));
            }
        }
    }
    if (currentJob) jobs.push(currentJob);

    return jobs.map((j, i) => ({
        id: `exp-${Date.now()}-${i}`,
        role: j.title || 'Role Title',
        company: j.company || 'Company Name',
        duration: j.duration || 'Duration',
        description: j.description.length > 0 ? j.description : ['Contributed to the team.']
    }));
};

export const extractEducation = (eduLines) => {
    const education = [];
    let currentEdu = null;

    for (const line of eduLines) {
        const isKeyLine = /university|college|institute|bachelor|master|bsc|msc|phd|degree/i.test(line);
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);

        if (isKeyLine || yearMatch || (line.length < 60 && !currentEdu)) {
            if (currentEdu) education.push(currentEdu);
            currentEdu = {
                institution: isKeyLine && /university|college|institute/i.test(line) ? line : '',
                degree: '',
                year: yearMatch ? yearMatch[0] : ''
            };
            if (!currentEdu.institution && !yearMatch) {
                currentEdu.degree = line;
            } else if (isKeyLine && /bachelor|master|msc|bsc/i.test(line)) {
                currentEdu.degree = line.replace(yearMatch ? yearMatch[0] : '', '').replace(/[-|,]/g, '').trim();
            }
        } else if (currentEdu) {
            if (!currentEdu.degree) currentEdu.degree = line;
            else if (!currentEdu.institution) currentEdu.institution = line;
        }
    }
    if (currentEdu) education.push(currentEdu);

    return education.map((e, i) => ({
        id: `edu-${Date.now()}-${i}`,
        institution: e.institution || 'University Name',
        degree: e.degree || 'Degree Field',
        year: e.year || ''
    }));
};

export const extractProjects = (projLines) => {
    const projects = [];
    let currentProj = null;

    for (const line of projLines) {
        if (line.length < 60 && !/^[•\-\*]/.test(line.trim())) {
            if (currentProj) projects.push(currentProj);
            currentProj = {
                title: line,
                description: '',
                technologies: []
            };
        } else if (currentProj) {
            currentProj.description += (currentProj.description ? ' ' : '') + line.replace(/^[•\-\*]\s*/, '');
        }
    }
    if (currentProj) projects.push(currentProj);

    return projects.map((p, i) => ({
        id: `proj-${Date.now()}-${i}`,
        title: p.title || 'Project Name',
        description: p.description || 'Description of the project.',
        link: '',
        technologies: p.technologies
    }));
};

/**
 * Main parser pipeline
 */
export const parseResume = async (file) => {
    let text = '';

    if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
    } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
    ) {
        text = await extractTextFromDOCX(file);
    } else {
        throw new Error('Unsupported file format. Please upload PDF or DOCX.');
    }

    if (!text || text.trim().length === 0) {
        throw new Error('Could not extract text from the document.');
    }

    const sections = splitIntoSections(text);

    // Attempt to extract structured data
    return {
        personalInfo: {
            fullName: extractName(text),
            email: extractEmail(text),
            phone: extractPhone(text),
            location: extractLocation(text),
            linkedin: extractLinkedIn(text),
            github: extractGitHub(text)
        },
        professionalSummary: '', // Leave for manual entry
        skills: extractSkills(text),
        experience: extractExperience(sections.experience),
        education: extractEducation(sections.education),
        projects: extractProjects(sections.projects)
    };
};
