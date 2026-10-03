import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { auth, db } from '../firebase';
import { isUserAdmin } from './dbService';

const ADMIN_EMAIL = 'raiktosadan@gmail.com';

export type EngagementType = 'article' | 'photo' | 'media';
export type CommentStatus = 'pending' | 'approved' | 'rejected';
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

export async function submitComment(input: {
  contentType: EngagementType;
  contentId: string;
  name: string;
  email?: string;
  message: string;
  language: 'ne' | 'en';
}): Promise<void> {
  await ensureAnonymousSession();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Visitor session could not be created.');
  const name = input.name.trim().slice(0, 100);
  const email = (input.email || '').trim().slice(0, 160);
  const message = input.message.trim().slice(0, 2000);
  if (!name || !message) throw new Error('Name and comment are required.');
  await addDoc(collection(db, 'archive_comments'), {
    contentType: input.contentType,
    contentId: input.contentId,
    name,
    email,
    message,
    language: input.language,
    uid,
    status: 'pending' as CommentStatus,
    createdAt: serverTimestamp(),
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
