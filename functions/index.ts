import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { createSign } from 'node:crypto';

initializeApp();
const db = getFirestore();

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
  return text.normalize('NFKC').toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[4@]/g, 'a').replace(/[3]/g, 'e').replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o').replace(/[$5]/g, 's').replace(/[7]/g, 't')
    .replace(/(.)\1{3,}/g, '$1$1').replace(/\s+/g, ' ').trim();
}
function repeated(text: string): boolean {
  const compact = text.replace(/\s+/g, ' ').trim().toLowerCase();
  const words = compact.split(' ').filter(Boolean);
  if (words.length >= 6 && new Set(words).size / words.length <= 0.35) return true;
  const chunks = compact.split(/[.!?,;]+/).map(v => v.trim()).filter(Boolean);
  return chunks.length >= 3 && new Set(chunks).size / chunks.length <= 0.5;
}
function analyze(name: string, message: string) {
  const combined = normalize(`${name} ${message}`);
  const reasons: string[] = [];
  let score = 0;
  const threat = THREAT_PATTERNS.some(p => p.test(combined));
  const explicit = EXPLICIT_PATTERNS.some(p => p.test(combined));
  const abusive = ABUSIVE_PATTERNS.some(p => p.test(combined));
  const hate = HATE_PATTERNS.some(p => p.test(combined));
  const phishing = PHISHING_PATTERNS.some(p => p.test(combined));
  const urls = (message.match(/(?:https?:\/\/|www\.)[^\s<>"']+/gi) || []).length;
  if (threat) { score += 100; reasons.push('threat_or_violence'); }
  if (explicit) { score += 90; reasons.push('sexual_or_explicit'); }
  if (hate) { score += 80; reasons.push('hate_or_harassment'); }
  if (abusive) { score += 45; reasons.push('abusive_language'); }
  if (phishing) { score += 55; reasons.push('suspicious_link_or_scam_pattern'); }
  if (urls >= 2) { score += 45; reasons.push('multiple_urls'); }
  else if (urls === 1) { score += 20; reasons.push('contains_url'); }
  if (repeated(message)) { score += 45; reasons.push('repeated_or_spam_text'); }
  if (message.trim().length < 2) { score += 60; reasons.push('too_short'); }
  const action = threat || explicit || score >= 100 ? 'blocked' : score >= 20 ? 'pending' : 'approved';
  return { action, score, reasons };
}

export const moderateArchiveComment = onDocumentCreated(
  {
    document: 'archive_comments/{commentId}',
    database: 'ai-studio-f97e2084-1a3e-41da-84c9-e299d849fe7a',
    region: 'us-central1',
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const data = snapshot.data();
    if (data.status !== 'pending') return;

    const result = analyze(String(data.name || ''), String(data.message || ''));
    const nextStatus = result.action;

    await snapshot.ref.update({
      status: nextStatus,
      moderationScore: result.score,
      moderationReasons: result.reasons,
      moderationSource: 'firebase-server',
      moderatedAt: new Date(),
      moderatedBy: 'automatic-moderation',
    });
  },
);


// Secure media backup: Firebase Storage remains the primary serving store.
// When Drive secrets are configured, newly finalized archive media is copied to
// the owner's Google Drive folder by the trusted backend. No Drive credentials
// are shipped to the browser.
const GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON = defineSecret('GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON');
const GOOGLE_DRIVE_FOLDER_ID = defineSecret('GOOGLE_DRIVE_FOLDER_ID');

function base64Url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

async function getGoogleDriveAccessToken(serviceAccountJson: string): Promise<string> {
  const credentials = JSON.parse(serviceAccountJson) as {
    client_email?: string;
    private_key?: string;
  };
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Google Drive service-account JSON is missing client_email/private_key.');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/drive',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(credentials.private_key);
  const assertion = `${unsigned}.${base64Url(signature)}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!tokenResponse.ok) {
    throw new Error(`Google OAuth token request failed (${tokenResponse.status}).`);
  }
  const tokenData = await tokenResponse.json() as { access_token?: string };
  if (!tokenData.access_token) throw new Error('Google OAuth token response did not contain access_token.');
  return tokenData.access_token;
}

export const backupArchiveMediaToDrive = onObjectFinalized(
  {
    region: 'us-central1',
    secrets: [GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON, GOOGLE_DRIVE_FOLDER_ID],
    retry: true,
  },
  async (event) => {
    const object = event.data;
    const name = object.name || '';
    const contentType = object.contentType || 'application/octet-stream';
    const bucketName = object.bucket;

    const isArchiveMedia =
      name.startsWith('archive/photos/') ||
      name.startsWith('archive/videos/') ||
      name.startsWith('archive/research/');
    if (!isArchiveMedia || !bucketName) return;

    const serviceAccountJson = GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON.value();
    const folderId = GOOGLE_DRIVE_FOLDER_ID.value().trim();
    if (!serviceAccountJson || !folderId) {
      console.warn('Google Drive backup skipped: Drive secrets are not configured.');
      return;
    }

    const accessToken = await getGoogleDriveAccessToken(serviceAccountJson);
    const generation = String(object.generation || '');
    const existingQuery = `'${folderId.replace(/'/g, "\\'")}' in parents and appProperties has { key='firebaseStoragePath' and value='${name.replace(/'/g, "\\'")}' } and appProperties has { key='firebaseGeneration' and value='${generation.replace(/'/g, "\\'")}' } and trashed = false`;
    const existingResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=drive&fields=files(id,name)&pageSize=1&q=${encodeURIComponent(existingQuery)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!existingResponse.ok) {
      throw new Error(`Google Drive lookup failed (${existingResponse.status}).`);
    }
    const existingData = await existingResponse.json() as { files?: Array<{ id?: string }> };
    if (existingData.files?.length) {
      console.info('Google Drive backup already exists', {
        storagePath: name,
        driveFileId: existingData.files[0].id,
      });
      return;
    }

    const storageFile = getStorage().bucket(bucketName).file(name);
    const [buffer] = await storageFile.download();

    const metadata = JSON.stringify({
      name: name.split('/').pop() || 'archive-media',
      parents: [folderId],
      description: `SADAN RAI ARCHIVE Firebase Storage backup: ${name}`,
      appProperties: {
        firebaseStoragePath: name,
        firebaseGeneration: generation,
      },
    });

    const boundary = `sadan-rai-drive-${Date.now().toString(36)}`;
    const preamble = Buffer.from(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
      `--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`,
      'utf8',
    );
    const ending = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');

    const body = Buffer.concat([preamble, buffer, ending]);
    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Drive upload failed (${response.status}): ${errorText.slice(0, 500)}`);
    }

    const result = await response.json() as { id?: string; name?: string };
    console.info('Google Drive backup complete', {
      storagePath: name,
      driveFileId: result.id,
    });
  },
);
