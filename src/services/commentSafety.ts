export type EngagementType = 'article' | 'photo' | 'media';

export type CommentSafetyAction = 'publish' | 'pending' | 'block';

export interface CommentSafetyResult {
  action: CommentSafetyAction;
  score: number;
  reasons: string[];
}

const ABUSIVE_PATTERNS = [
  /\b(fuck|fucking|shit|bitch|bastard|asshole|motherfucker)\b/i,
  /\b(idiot|stupid|moron|loser|shut\s*up)\b/i,
  /\b(chutiya|chutiye|madarchod|bhosd|gaand|gandu|muji|randi|boksi)\b/i,
  /\b(murkha|gadha|kutta|kukur)\b/i,
];

const THREAT_PATTERNS = [
  /\b(i\s*will\s*kill|i['’]ll\s*kill|kill\s+you|murder\s+you|shoot\s+you|stab\s+you)\b/i,
  /\b(marchu|marne|maridinchhu|hanx[uau]|hanchhu|sakdinchhu)\b/i,
  /\b(you\s+will\s+die|you\s+are\s+dead)\b/i,
];

const EXPLICIT_PATTERNS = [
  /\b(porn|pornography|xxx|nude|nudes|sex\s+video|sex\s+pic|sexual\s+content)\b/i,
  /\b(blowjob|dick|penis|vagina|cum|semen|fuck)\b/i,
];

const HATE_PATTERNS = [
  /\b(kill\s+all|exterminate|wipe\s+out)\b/i,
  /\b(go\s+back\s+to\s+your\s+country)\b/i,
  /\b(terrorist|subhuman|vermin)\b/i,
];

const PHISHING_PATTERNS = [
  /bit\.ly|tinyurl\.com|t\.co|is\.gd|rb\.gy/i,
  /\b(verify\s+your\s+account|claim\s+prize|free\s+money|send\s+password|send\s+otp|login\s+here)\b/i,
];

function normalize(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[4@]/g, 'a')
    .replace(/[3]/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/[7]/g, 't')
    .replace(/(.)\1{3,}/g, '$1$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasRepeatedText(text: string): boolean {
  const compact = text.replace(/\s+/g, ' ').trim().toLowerCase();
  if (!compact) return false;
  const words = compact.split(' ').filter(Boolean);
  if (words.length >= 6) {
    const unique = new Set(words);
    if (unique.size / words.length <= 0.35) return true;
  }
  const chunks = compact.split(/[.!?,;]+/).map((v) => v.trim()).filter(Boolean);
  return chunks.length >= 3 && new Set(chunks).size / chunks.length <= 0.5;
}

function countUrls(text: string): number {
  return (text.match(/(?:https?:\/\/|www\.)[^\s<>"']+/gi) || []).length;
}

export function analyzeCommentSafety(input: {
  name: string;
  email?: string;
  message: string;
  contentType: EngagementType;
  contentId: string;
}): CommentSafetyResult {
  const combined = normalize(`${input.name} ${input.message}`);
  const reasons: string[] = [];
  let score = 0;

  const threat = THREAT_PATTERNS.some((pattern) => pattern.test(combined));
  const explicit = EXPLICIT_PATTERNS.some((pattern) => pattern.test(combined));
  const abusive = ABUSIVE_PATTERNS.some((pattern) => pattern.test(combined));
  const hate = HATE_PATTERNS.some((pattern) => pattern.test(combined));
  const phishing = PHISHING_PATTERNS.some((pattern) => pattern.test(combined));
  const urls = countUrls(input.message);
  const repeated = hasRepeatedText(input.message);

  if (threat) {
    score += 100;
    reasons.push('threat_or_violence');
  }
  if (explicit) {
    score += 90;
    reasons.push('sexual_or_explicit');
  }
  if (hate) {
    score += 80;
    reasons.push('hate_or_harassment');
  }
  if (abusive) {
    score += 45;
    reasons.push('abusive_language');
  }
  if (phishing) {
    score += 55;
    reasons.push('suspicious_link_or_scam_pattern');
  }
  if (urls >= 2) {
    score += 45;
    reasons.push('multiple_urls');
  } else if (urls === 1) {
    score += 20;
    reasons.push('contains_url');
  }
  if (repeated) {
    score += 45;
    reasons.push('repeated_or_spam_text');
  }
  if (input.message.trim().length < 2) {
    score += 60;
    reasons.push('too_short');
  }

  let action: CommentSafetyAction = 'publish';
  if (threat || explicit || score >= 100) {
    action = 'block';
  } else if (score >= 20) {
    action = 'pending';
  }

  return { action, score, reasons };
}
