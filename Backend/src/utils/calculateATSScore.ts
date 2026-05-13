export const calculateATSScore = (resumeText: string) => {
  let score = 0;
  const results: Record<string, string> = {};

  // Keywords match check
  const atsKeywords = [
    'experience',
    'skills',
    'education',
    'project',
    'achievement',
    'responsibility',
    'technical',
  ];
  const keywordMatches = atsKeywords.filter((keyword) =>
    resumeText.toLowerCase().includes(keyword)
  ).length;
  const keywordScore = (keywordMatches / atsKeywords.length) * 30;
  score += keywordScore;
  results.keywordsMatch = keywordScore >= 22.5 ? 'Good' : 'Average';

  // Formatting check (looking for structure indicators)
  const formatIndicators = resumeText.match(/[\n]{2,}|\t|•|\||---/g) || [];
  const formatScore = Math.min((formatIndicators.length / 10) * 25, 25);
  score += formatScore;
  results.formatting = formatScore >= 20 ? 'Excellent' : 'Good';

  // Readability check (average word length, sentence structure)
  const words = resumeText.split(/\s+/).filter((w) => w.length > 0);
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  const readabilityScore =
    avgWordLength >= 4 && avgWordLength <= 7
      ? 25
      : avgWordLength < 4
        ? 15
        : 20;
  score += readabilityScore;
  results.readability =
    readabilityScore >= 20 ? 'Good' : 'Needs Improvement';

  // Recruiter friendly check (looking for contact info, linkedin, etc)
  const recruiterFriendlyPatterns = [
    /email|@/i,
    /phone|\d{10}|\(\d{3}\)/,
    /linkedin|github|portfolio/i,
    /location|city|state/i,
  ];
  const recruiterScore = (recruiterFriendlyPatterns.filter((pattern) =>
    pattern.test(resumeText)
  ).length / recruiterFriendlyPatterns.length) * 20;
  score += recruiterScore;
  results.recruiterFriendly =
    recruiterScore >= 15 ? 'Strong' : 'Average';

  return {
    score: Math.round(score),
    result: results,
  };
};
