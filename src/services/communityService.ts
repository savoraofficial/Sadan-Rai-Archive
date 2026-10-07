import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  where,
} from 'firebase/firestore';
import { linkWithPopup, linkWithRedirect, signInAnonymously, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase';
import { isUserAdmin } from './dbService';
import { analyzeCommentSafety } from './commentSafety';

const ADMIN_EMAIL = 'raiktosadan@gmail.com';

export type EngagementType = 'article' | 'photo' | 'media';
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'blocked';
export type SupportPlan = 'supporter' | 'member' | 'patron' | 'one_time';
export type SupportStatus = 'pending' | 'confirmed' | 'cancelled';

async function ensureAnonymousSession(): Promise<void> {
  if (!auth.currentUser) await signInAnonymously(auth);
}

export async function likeRecord(contentType: EngagementType, contentId: string): Promise<boolean> {
  await ensureAnonymousSession();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Visitor session could not be created.');
  const contentKey = `${contentType}__${contentId}`;
  const ref = doc(db, 'archive_likes', contentKey, 'users', uid);
  await setDoc(ref, {
    contentType,
    contentId,
    uid,
    createdAt: serverTimestamp(),
  });
  return true;
}

export async function fetchLikeCount(contentType: EngagementType, contentId: string): Promise<number> {
  try {
    const snapshot = await getDocs(collection(db, 'archive_likes', `${contentType}__${contentId}`, 'users'));
    return snapshot.size;
  } catch {
    return 0;
  }
}

export async function hasLiked(contentType: EngagementType, contentId: string): Promise<boolean> {
  if (!auth.currentUser) return false;
  const uid = auth.currentUser.uid;
  const snapshot = await getDoc(doc(db, 'archive_likes', `${contentType}__${contentId}`, 'users', uid));
  return snapshot.exists();
}

const SAVED_ITEMS_KEY = 'sadan_rai_saved_items';

export interface SavedArchiveItem {
  contentType: EngagementType;
  contentId: string;
}

function readSavedItems(): SavedArchiveItem[] {
  try {
    const raw = localStorage.getItem(SAVED_ITEMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SavedArchiveItem =>
      item && ['article', 'photo', 'media'].includes(item.contentType) && typeof item.contentId === 'string'
    );
  } catch {
    return [];
  }
}

function writeSavedItems(items: SavedArchiveItem[]): void {
  try {
    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
  } catch {
    // Ignore unavailable browser storage.
  }
}

export function getSavedItems(): SavedArchiveItem[] {
  return readSavedItems();
}

export function isSaved(contentType: EngagementType, contentId: string): boolean {
  return readSavedItems().some((item) => item.contentType === contentType && item.contentId === contentId);
}

export function toggleSaved(contentType: EngagementType, contentId: string): boolean {
  const items = readSavedItems();
  const exists = items.some((item) => item.contentType === contentType && item.contentId === contentId);
  const next = exists
    ? items.filter((item) => !(item.contentType === contentType && item.contentId === contentId))
    : [...items, { contentType, contentId }];
  writeSavedItems(next);
  return !exists;
}

export async function signInForComment(): Promise<void> {
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (auth.currentUser?.isAnonymous) {
    try {
      if (isMobile) {
        await linkWithRedirect(auth.currentUser, googleProvider);
      } else {
        await linkWithPopup(auth.currentUser, googleProvider);
      }
      return;
    } catch (error) {
      if (!(error instanceof Error) || !('code' in error) || (error as { code?: string }).code !== 'auth/credential-already-in-use') {
        throw error;
      }
    }
  }
  if (isMobile) {
    await signInWithRedirect(auth, googleProvider);
  } else {
    await signInWithPopup(auth, googleProvider);
  }
}

export async function submitComment(input: {
  contentType: EngagementType;
  contentId: string;
  name: string;
  email?: string;
  message: string;
  language: 'ne' | 'en';
}): Promise<{ status: CommentStatus; reasons: string[] }> {
  if (!auth.currentUser || auth.currentUser.isAnonymous || !auth.currentUser.email) {
    throw new Error('Google authentication required.');
  }
  const uid = auth.currentUser.uid;
  const name = input.name.trim().slice(0, 100);
  // Do not persist the visitor email in the publicly-readable approved-comment document.
  // The Google account itself remains the authentication identity.
  const message = input.message.trim().slice(0, 2000);
  if (!name || !message) throw new Error('Name and comment are required.');

  const safety = analyzeCommentSafety({
    contentType: input.contentType,
    contentId: input.contentId,
    name,
    message,
  });
  // Client-side classification is an early safety layer only. Public approval is
  // performed by the trusted Firebase server-side moderation trigger.
  const status: CommentStatus = safety.action === 'block' ? 'blocked' : 'pending';

  const commentRef = doc(collection(db, 'archive_comments'));
  const rateRef = doc(db, 'comment_rate_limits', uid);
  const batch = writeBatch(db);

  // A fixed per-Google-user rate document is protected by Firestore rules.
  // The rules require this write to happen with the comment atomically.
  const now = serverTimestamp();
  batch.set(commentRef, {
    contentType: input.contentType,
    contentId: input.contentId,
    name,
    message,
    language: input.language,
    uid,
    status,
    moderationScore: safety.score,
    moderationReasons: safety.reasons,
    moderationSource: 'automatic',
    createdAt: now,
  });

  // Keep the public-facing rate limit intentionally simple and strict:
  // one comment submission per 30 seconds per Google account.
  batch.set(rateRef, {
    uid,
    lastSubmittedAt: now,
  }, { merge: false });

  await batch.commit();
  return { status, reasons: safety.reasons };
}

export async function reportComment(commentId: string, reason = 'inappropriate'): Promise<void> {
  await ensureAnonymousSession();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Visitor session could not be created.');
  const reportId = `${commentId}__${uid}`;
  await setDoc(doc(db, 'archive_comment_reports', reportId), {
    commentId,
    reporterUid: uid,
    reason: reason.trim().slice(0, 120) || 'inappropriate',
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function fetchAllCommentReports() {
  if (!isUserAdmin()) return [];
  const snapshot = await getDocs(collection(db, 'archive_comment_reports'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function resolveCommentReport(id: string): Promise<void> {
  if (!isUserAdmin()) throw new Error('Administrator authentication required.');
  await updateDoc(doc(db, 'archive_comment_reports', id), {
    status: 'resolved',
    reviewedAt: serverTimestamp(),
    reviewedBy: ADMIN_EMAIL,
  });
}

export async function fetchApprovedComments(contentType: EngagementType, contentId: string) {
  const snapshot = await getDocs(query(
    collection(db, 'archive_comments'),
    where('contentType', '==', contentType),
    where('contentId', '==', contentId),
  ));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() } as any))
    .filter((item) => item.status === 'approved')
    .sort((a, b) => String(b.createdAt?.toDate?.() || '').localeCompare(String(a.createdAt?.toDate?.() || '')));
}

export async function fetchAllComments() {
  if (!isUserAdmin()) return [];
  const snapshot = await getDocs(collection(db, 'archive_comments'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function moderateComment(id: string, status: Exclude<CommentStatus, 'pending'>): Promise<void> {
  if (!isUserAdmin()) throw new Error('Administrator authentication required.');
  await updateDoc(doc(db, 'archive_comments', id), {
    status,
    moderatedAt: serverTimestamp(),
    moderatedBy: ADMIN_EMAIL,
  });
}

export async function deleteComment(id: string): Promise<void> {
  if (!isUserAdmin()) throw new Error('Administrator authentication required.');
  await deleteDoc(doc(db, 'archive_comments', id));
}

export async function submitSupportIntent(input: {
  plan: SupportPlan;
  amountUsd: number;
  name: string;
  email: string;
  message?: string;
  language: 'ne' | 'en';
}): Promise<void> {
  await ensureAnonymousSession();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Visitor session could not be created.');
  const allowed = [3, 5, 10];
  if (!allowed.includes(input.amountUsd) && input.plan !== 'one_time') {
    throw new Error('Unsupported support amount.');
  }
  if (input.plan === 'one_time' && (input.amountUsd < 1 || input.amountUsd > 10000)) {
    throw new Error('Unsupported support amount.');
  }
  await addDoc(collection(db, 'support_intents'), {
    plan: input.plan,
    amountUsd: input.amountUsd,
    name: input.name.trim().slice(0, 100),
    email: input.email.trim().slice(0, 160),
    message: (input.message || '').trim().slice(0, 1000),
    language: input.language,
    uid,
    status: 'pending' as SupportStatus,
    createdAt: serverTimestamp(),
  });
}

export async function fetchSupportIntents() {
  if (!isUserAdmin()) return [];
  const snapshot = await getDocs(query(collection(db, 'support_intents'), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function markSupportIntent(id: string, status: Exclude<SupportStatus, 'pending'>): Promise<void> {
  if (!isUserAdmin()) throw new Error('Administrator authentication required.');
  await updateDoc(doc(db, 'support_intents', id), {
    status,
    reviewedAt: serverTimestamp(),
    reviewedBy: ADMIN_EMAIL,
  });
}

export async function recordConfirmedEarning(input: {
  supportIntentId: string;
  amountUsd: number;
  plan: SupportPlan;
  paymentProvider: string;
  transactionReference: string;
}): Promise<void> {
  if (!isUserAdmin()) throw new Error('Administrator authentication required.');
  if (!Number.isFinite(input.amountUsd) || input.amountUsd <= 0 || input.amountUsd > 10000) {
    throw new Error('Invalid earning amount.');
  }
  const id = `earning_${input.supportIntentId}`;
  await setDoc(doc(db, 'earnings', id), {
    ...input,
    status: 'confirmed',
    confirmedBy: ADMIN_EMAIL,
    confirmedAt: serverTimestamp(),
  }, { merge: false });
  await markSupportIntent(input.supportIntentId, 'confirmed');
}

export async function fetchConfirmedEarnings() {
  if (!isUserAdmin()) return [];
  const snapshot = await getDocs(query(collection(db, 'earnings'), orderBy('confirmedAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
