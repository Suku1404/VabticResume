type ScoreLabel = 'Excellent' | 'Strong' | 'Good' | 'Average' | 'Needs Improvement';

type ScoreBreakdown = {
  keywordsMatch: string;
  formatting: ScoreLabel;
  readability: ScoreLabel;
  recruiterFriendly: ScoreLabel;
  sectionCoverage: ScoreLabel;
};

type AtsScore = {
  score: number;
  result: ScoreBreakdown;
  recommendations: string[];
  metrics: {
    matchedJobKeywords: string[];
    missingJobKeywords: string[];
    detectedSections: string[];
  };
  analysis: {
    summary: string;
    grade: string;
    sectionScores: Array<{
      label: string;
      score: number;
    }>;
    risks: Array<{
      title: string;
      severity: 'high' | 'medium' | 'low';
      description: string;
      fix: string;
    }>;
    missingKeywords: string[];
    strongKeywords: string[];
    suggestions: Array<{
      title: string;
      priority: 'high' | 'medium' | 'low';
      detail: string;
      example: string;
    }>;
    parsingNotes: string;
  };
};

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'to',
  'with',
  'you',
  'your',
  'we',
  'our',
  'will',
  'can',
  'this',
  'role',
  'job',
  'work',
  'team',
  'candidate',
  'engineer',
  'developer',
  'responsibilities',
  'requirements',
  'preferred',
  'required',
  'experience',
  'skills',
]);

const KNOWN_PHRASES = [
  'rest api',
  'ci/cd',
  'machine learning',
  'data analysis',
  'data structures',
  'system design',
  'full stack',
  'front end',
  'back end',
  'unit testing',
  'cloud computing',
  'agile development',
  'project management',
  'responsive design',
  'performance optimization',
];

const COMMON_SKILLS = [
  'javascript',
  'typescript',
  'react',
  'node',
  'express',
  'mongodb',
  'postgresql',
  'sql',
  'python',
  'java',
  'spring',
  'aws',
  'docker',
  'kubernetes',
  'git',
  'rest',
  'graphql',
  'html',
  'css',
  'tailwind',
  'redux',
  'next',
  'frontend',
  'backend',
  'fullstack',
  'testing',
  'jest',
  'api',
  'microservices',
  'ci/cd',
];

const DEFAULT_ROLE_KEYWORDS = [
  'react',
  'node',
  'express',
  'mongodb',
  'typescript',
  'redux',
  'graphql',
  'aws',
  'docker',
  'kubernetes',
  'microservices',
  'unit testing',
  'jest',
  'ci/cd',
  'rest api',
];

const ACTION_VERBS = [
  'built',
  'created',
  'developed',
  'designed',
  'implemented',
  'improved',
  'optimized',
  'reduced',
  'increased',
  'led',
  'launched',
  'automated',
  'integrated',
  'migrated',
  'delivered',
  'deployed',
  'maintained',
];

const SECTION_PATTERNS: Record<string, RegExp> = {
  contact: /(@|linkedin|github|portfolio|phone|\+\d{1,3})/i,
  summary: /\b(summary|profile|objective|about)\b/i,
  skills: /\b(skills|technical skills|technologies|tools)\b/i,
  experience: /\b(experience|employment|work history|internship|professional experience)\b/i,
  projects: /\b(projects|selected projects|academic projects)\b/i,
  education: /\b(education|degree|university|college|bachelor|master|b\.?tech|m\.?tech)\b/i,
  certifications: /\b(certifications|certificates|licenses|achievements|awards)\b/i,
};

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w+#./-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const labelFromPercent = (percent: number): ScoreLabel => {
  if (percent >= 85) return 'Excellent';
  if (percent >= 72) return 'Strong';
  if (percent >= 58) return 'Good';
  if (percent >= 40) return 'Average';
  return 'Needs Improvement';
};

const gradeFromScore = (score: number) => {
  if (score >= 90) return 'A+';
  if (score >= 82) return 'A';
  if (score >= 74) return 'B';
  if (score >= 64) return 'C';
  return 'D';
};

const titleCaseKeyword = (keyword: string) =>
  keyword
    .split(' ')
    .map((part) => {
      const uppercaseTerms = ['api', 'aws', 'sql', 'html', 'css', 'ci/cd'];
      return uppercaseTerms.includes(part) ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');

const extractKeywords = (text: string) => {
  const normalized = normalize(text);
  const words = normalized.split(' ').filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  const terms = [
    ...KNOWN_PHRASES.filter((phrase) => normalized.includes(phrase)),
    ...COMMON_SKILLS.filter((skill) => normalized.includes(skill)),
    ...words,
  ];
  const frequency = new Map<string, number>();

  for (const term of terms) {
    if (term.length < 3 || STOP_WORDS.has(term)) continue;
    frequency.set(term, (frequency.get(term) || 0) + 1);
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term)
    .filter((term) => !/^\d+$/.test(term))
    .slice(0, 30);
};

const countMatches = (patterns: RegExp[], text: string) =>
  patterns.filter((pattern) => pattern.test(text)).length;

export const calculateATSScore = (resumeText: string, jobDescription = ''): AtsScore => {
  const cleanResumeText = resumeText.replace(/\r/g, '\n').trim();
  const normalizedResume = normalize(cleanResumeText);
  const recommendations: string[] = [];

  const detectedSections = Object.entries(SECTION_PATTERNS)
    .filter(([, pattern]) => pattern.test(cleanResumeText))
    .map(([section]) => section);

  const sectionScore = (detectedSections.length / Object.keys(SECTION_PATTERNS).length) * 18;
  if (!detectedSections.includes('skills')) recommendations.push('Add a clear Skills section with role-specific tools.');
  if (!detectedSections.includes('experience') && !detectedSections.includes('projects')) {
    recommendations.push('Add Experience or Projects with responsibilities and outcomes.');
  }

  const contactPatterns = [
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
    /(\+\d{1,3}[-.\s]?)?(\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4}/,
    /linkedin\.com|github\.com|portfolio|https?:\/\//i,
    /\b(remote|india|usa|united states|city|state|bangalore|mumbai|delhi|pune|hyderabad|chennai)\b/i,
  ];
  const contactScore = (countMatches(contactPatterns, cleanResumeText) / contactPatterns.length) * 12;
  if (contactScore < 9) recommendations.push('Include email, phone, location, and LinkedIn/GitHub or portfolio links.');

  const lines = cleanResumeText.split('\n').map((line) => line.trim()).filter(Boolean);
  const bulletLines = lines.filter((line) => /^[-*•]|^\d+\./.test(line));
  const longLines = lines.filter((line) => line.length > 130);
  const hasGoodLength = cleanResumeText.length >= 1200 && cleanResumeText.length <= 8000;
  const hasSectionSpacing = detectedSections.length >= 4;
  const hasBullets = bulletLines.length >= 4;
  const hasFewLongLines = longLines.length <= Math.max(2, lines.length * 0.15);
  const hasLowTableRisk = (cleanResumeText.match(/\|/g) || []).length < 20;
  const formattingChecks = [hasGoodLength, hasSectionSpacing, hasBullets, hasFewLongLines, hasLowTableRisk];
  const formattingScore = (formattingChecks.filter(Boolean).length / formattingChecks.length) * 20;
  if (!hasBullets) recommendations.push('Use concise bullet points for experience and projects.');
  if (!hasFewLongLines) recommendations.push('Shorten dense paragraphs so ATS parsers and recruiters can scan them.');
  if (!hasLowTableRisk) recommendations.push('Avoid table-heavy layouts because many ATS parsers read them poorly.');

  const words = normalizedResume.split(' ').filter(Boolean);
  const avgWordLength = words.length
    ? words.reduce((sum, word) => sum + word.length, 0) / words.length
    : 0;
  const quantifiedLines = lines.filter((line) => /(\d+%|\d+\+|\$\d+|\b\d+x\b|\b\d+\s*(users|clients|requests|projects|hours|ms|seconds)\b)/i.test(line));
  const actionVerbLines = lines.filter((line) =>
    ACTION_VERBS.some((verb) => new RegExp(`\\b${verb}\\b`, 'i').test(line))
  );
  const quantifiedRatio = bulletLines.length ? quantifiedLines.length / bulletLines.length : quantifiedLines.length / Math.max(lines.length, 1);
  const actionVerbRatio = bulletLines.length ? actionVerbLines.length / bulletLines.length : actionVerbLines.length / Math.max(lines.length, 1);
  const readabilityPercent =
    (avgWordLength >= 4 && avgWordLength <= 8 ? 35 : 20) +
    clamp(quantifiedRatio * 35, 0, 35) +
    clamp(actionVerbRatio * 30, 0, 30);
  const readabilityScore = (readabilityPercent / 100) * 20;
  if (quantifiedRatio < 0.25) recommendations.push('Add measurable results such as percentages, scale, latency, revenue, or user impact.');
  if (actionVerbRatio < 0.35) recommendations.push('Start more bullets with strong action verbs like built, optimized, led, shipped, or automated.');

  const jobKeywords = extractKeywords(jobDescription);
  const matchedJobKeywords = jobKeywords.filter((keyword) => normalizedResume.includes(keyword));
  const missingJobKeywords = jobKeywords.filter((keyword) => !normalizedResume.includes(keyword)).slice(0, 10);
  const resumeSkillMatches = COMMON_SKILLS.filter((skill) => normalizedResume.includes(skill));
  const keywordPercent = jobKeywords.length >= 6
    ? (matchedJobKeywords.length / jobKeywords.length) * 100
    : Math.min((resumeSkillMatches.length / 12) * 100, 72);
  const keywordScore = (keywordPercent / 100) * 30;

  if (jobKeywords.length < 6) {
    recommendations.push('Paste the target job description to calculate a real keyword match score.');
  } else if (missingJobKeywords.length > 0) {
    recommendations.push(`Consider adding relevant missing keywords: ${missingJobKeywords.slice(0, 5).join(', ')}.`);
  }

  const score = Math.round(clamp(sectionScore + contactScore + formattingScore + readabilityScore + keywordScore));
  const formattingPercent = Math.round((formattingScore / 20) * 100);
  const sectionPercent = Math.round((sectionScore / 18) * 100);
  const contactPercent = Math.round((contactScore / 12) * 100);
  const skillsPercent = Math.round(clamp((resumeSkillMatches.length / 10) * 100));
  const experiencePercent = Math.round(clamp(
    (detectedSections.includes('experience') ? 40 : 0) +
    clamp(actionVerbRatio * 35, 0, 35) +
    clamp(quantifiedRatio * 25, 0, 25)
  ));
  const educationPercent = detectedSections.includes('education') ? 85 : 35;
  const impactPercent = Math.round(clamp((quantifiedRatio * 70) + (actionVerbRatio * 30)));
  const keywordListForDisplay = jobKeywords.length >= 6 ? jobKeywords : DEFAULT_ROLE_KEYWORDS;
  const displayMissingKeywords = keywordListForDisplay
    .filter((keyword) => !normalizedResume.includes(keyword))
    .slice(0, 12)
    .map(titleCaseKeyword);
  const strongKeywords = [...new Set([
    ...resumeSkillMatches,
    ...KNOWN_PHRASES.filter((phrase) => normalizedResume.includes(phrase)),
    ...matchedJobKeywords,
  ])]
    .slice(0, 12)
    .map(titleCaseKeyword);

  const risks: AtsScore['analysis']['risks'] = [];

  if (!hasBullets) {
    risks.push({
      title: 'Inconsistent bullet point formatting and spacing',
      severity: 'medium',
      description: 'Limited bullet usage can make experience harder for ATS parsers and recruiters to scan.',
      fix: 'Use consistent bullet styles and spacing throughout experience and project sections.',
    });
  }

  if (quantifiedRatio < 0.25) {
    risks.push({
      title: 'Lack of quantified achievements in experience and projects',
      severity: 'medium',
      description: 'Quantified results help ATS and recruiters assess candidate value quickly.',
      fix: 'Add metrics such as performance improvements, user counts, revenue, time saved, or scale.',
    });
  }

  if (/[\u200B-\u200D\uFEFF]/.test(cleanResumeText)) {
    risks.push({
      title: 'Contact information includes hidden special characters',
      severity: 'low',
      description: 'Hidden characters can cause parsing issues in ATS systems.',
      fix: 'Remove hidden or special characters from email, phone, links, and contact fields.',
    });
  }

  if (!hasLowTableRisk) {
    risks.push({
      title: 'Table-heavy layout may reduce parser accuracy',
      severity: 'high',
      description: 'Many ATS parsers read tables and columns out of order.',
      fix: 'Use a simple single-column resume layout with clear section headings.',
    });
  }

  const suggestions: AtsScore['analysis']['suggestions'] = [
    {
      title: 'Quantify achievements',
      priority: quantifiedRatio < 0.25 ? 'high' : 'medium',
      detail: 'Add measurable outcomes to internship, project, and work bullets to demonstrate impact.',
      example: 'Improved API response time by 35% by optimizing database queries and caching frequent requests.',
    },
    {
      title: 'Keep formatting consistent',
      priority: hasBullets && hasFewLongLines ? 'low' : 'medium',
      detail: 'Standardize bullet points, spacing, headings, and line length for better ATS parsing and readability.',
      example: 'Built responsive frontend interfaces using React.js, TypeScript, and Tailwind CSS.',
    },
    {
      title: jobKeywords.length >= 6 ? 'Mirror role keywords naturally' : 'Add a target job description',
      priority: jobKeywords.length >= 6 ? 'medium' : 'high',
      detail: jobKeywords.length >= 6
        ? 'Use relevant missing terms from the job description only where they truthfully match your experience.'
        : 'Paste a target JD before scanning so keyword scoring reflects the role instead of generic resume quality.',
      example: 'Tools: Git, GitHub, Docker, AWS, Jest, REST APIs, CI/CD',
    },
  ];

  const summary = [
    `This resume scores ${score}/100 with a grade of ${gradeFromScore(score)}.`,
    sectionPercent >= 70
      ? 'It has a clear resume structure with recognizable sections.'
      : 'It needs clearer resume sections so ATS parsers can classify the content.',
    keywordListForDisplay.length && Math.round(keywordPercent) >= 70
      ? 'Keyword coverage is strong for the selected role.'
      : 'Keyword coverage can improve by aligning the resume with the target job description.',
    impactPercent >= 60
      ? 'The resume includes some measurable impact and action-oriented language.'
      : 'The biggest improvement area is adding quantified achievements and stronger bullet outcomes.',
  ].join(' ');

  const parsingNotes = [
    cleanResumeText.length < 1200
      ? 'Resume text is readable but may be too short for a complete ATS profile.'
      : 'Resume text is readable and long enough for analysis.',
    hasLowTableRisk
      ? 'No major table-heavy formatting risk was detected.'
      : 'Table-like formatting was detected and may reduce parsing accuracy.',
    jobKeywords.length >= 6
      ? 'Keyword matching used the pasted job description.'
      : 'No job description was provided, so keyword matching used typical software role keywords.',
  ].join(' ');

  return {
    score,
    result: {
      keywordsMatch: jobKeywords.length >= 6 ? `${Math.round(keywordPercent)}% match` : 'Add JD for accuracy',
      formatting: labelFromPercent((formattingScore / 20) * 100),
      readability: labelFromPercent(readabilityPercent),
      recruiterFriendly: labelFromPercent((contactScore / 12) * 100),
      sectionCoverage: labelFromPercent((sectionScore / 18) * 100),
    },
    recommendations: [...new Set(recommendations)].slice(0, 6),
    metrics: {
      matchedJobKeywords: matchedJobKeywords.slice(0, 12),
      missingJobKeywords,
      detectedSections,
    },
    analysis: {
      summary,
      grade: gradeFromScore(score),
      sectionScores: [
        { label: 'Formatting', score: formattingPercent },
        { label: 'Keywords', score: Math.round(keywordPercent) },
        { label: 'Experience', score: experiencePercent },
        { label: 'Education', score: educationPercent },
        { label: 'Skills', score: skillsPercent },
        { label: 'Impact', score: impactPercent },
        { label: 'Readability', score: Math.round(readabilityPercent) },
        { label: 'Contact', score: contactPercent },
      ],
      risks: risks.slice(0, 4),
      missingKeywords: displayMissingKeywords,
      strongKeywords,
      suggestions,
      parsingNotes,
    },
  };
};
