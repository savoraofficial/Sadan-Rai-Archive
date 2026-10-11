import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import {
  ResearchRecordItem,
  AuthorPerspectiveItem,
  EvidenceRecordItem,
  OralHistoryRecordItem,
  RevisionItem,
} from '../types';

const ADMIN_EMAIL = 'raiktosadan@gmail.com';
const RESEARCH_COLLECTION = 'research_records';
const RESEARCH_ADMIN_COLLECTION = 'research_admin_notes';
const AUTHORS_COLLECTION = 'authors_perspectives';
const EVIDENCE_COLLECTION = 'evidence_records';
const REVISIONS_COLLECTION = 'revisions';
const ORAL_HISTORY_COLLECTION = 'oral_history_records';

export function isUserAdmin(): boolean {
  return auth.currentUser?.email === ADMIN_EMAIL;
}

function assertAdmin(): void {
  if (!isUserAdmin()) throw new Error('Administrator authentication required.');
}

async function fetchWorkflowCollection<T>(collectionName: string, includeUnpublished: boolean): Promise<T[]> {
  const ref = collection(db, collectionName);
  const q = includeUnpublished ? query(ref) : query(ref, where('workflowStatus', '==', 'published'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as T));
}

function splitResearchRecordForPublic(record: ResearchRecordItem): { publicRecord: ResearchRecordItem; adminNotes: Record<string, unknown> } {
  const workflow = record.researchWorkflow;
  const publicWorkflow = workflow ? {
    ...workflow,
    crossCheckAgreements: '',
    crossCheckDifferences: '',
    evidenceAssessment: '',
    researcherAnalysis: '',
  } : workflow;

  const adminNotes = {
    crossCheckAgreements: workflow?.crossCheckAgreements || '',
    crossCheckDifferences: workflow?.crossCheckDifferences || '',
    evidenceAssessment: workflow?.evidenceAssessment || '',
    researcherAnalysis: workflow?.researcherAnalysis || '',
  };

  return { publicRecord: { ...record, researchWorkflow: publicWorkflow }, adminNotes };
}

export async function fetchResearchRecords(includeUnpublished = false): Promise<ResearchRecordItem[]> {
  try {
    const records = await fetchWorkflowCollection<ResearchRecordItem>(RESEARCH_COLLECTION, includeUnpublished);
    const publicRecords = records.map(record => record.researchWorkflow ? ({
      ...record,
      researchWorkflow: {
        ...record.researchWorkflow,
        crossCheckAgreements: '',
        crossCheckDifferences: '',
        evidenceAssessment: '',
        researcherAnalysis: '',
      },
    }) : record);
    if (!isUserAdmin()) return publicRecords;

    const notesSnapshot = await getDocs(collection(db, RESEARCH_ADMIN_COLLECTION));
    const notesById = new Map(notesSnapshot.docs.map(item => [item.id, item.data()]));
    return records.map(record => {
      const notes = notesById.get(record.id) as Record<string, unknown> | undefined;
      if (!notes) return record;
      return {
        ...record,
        researchWorkflow: record.researchWorkflow ? {
          ...record.researchWorkflow,
          crossCheckAgreements: String(notes.crossCheckAgreements || ''),
          crossCheckDifferences: String(notes.crossCheckDifferences || ''),
          evidenceAssessment: String(notes.evidenceAssessment || ''),
          researcherAnalysis: String(notes.researcherAnalysis || ''),
        } : record.researchWorkflow,
      };
    });
  } catch (error) { console.warn('Firestore research fetch failed:', error); return []; }
}

export async function saveResearchRecord(record: ResearchRecordItem, changeNotes = 'अभिलेख अद्यावधिक'): Promise<void> {
  assertAdmin();
  const user = auth.currentUser!;
  const updatedRecord: ResearchRecordItem = {
    ...record,
    version: (record.version || 0) + 1,
    updatedAt: new Date().toISOString(),
    createdBy: record.createdBy || user.displayName || 'SADAN RAI',
  };
  const { publicRecord, adminNotes } = splitResearchRecordForPublic(updatedRecord);

  // Cross-check, evidence assessment, and researcher working analysis are kept in a separate
  // owner-only document. Public research records never carry these working notes.
  await setDoc(doc(db, RESEARCH_COLLECTION, record.id), publicRecord, { merge: true });
  await setDoc(doc(db, RESEARCH_ADMIN_COLLECTION, record.id), {
    ...adminNotes,
    recordId: record.id,
    updatedAt: updatedRecord.updatedAt,
    updatedBy: user.email || ADMIN_EMAIL,
  }, { merge: true });

  await recordRevision({
    targetId: record.id,
    targetType: 'research',
    version: updatedRecord.version,
    author: user.displayName || 'SADAN RAI',
    authorEmail: user.email || ADMIN_EMAIL,
    changeNotes,
    snapshotData: updatedRecord,
  });
}

export async function deleteResearchRecord(id: string): Promise<void> {
  assertAdmin();
  await deleteDoc(doc(db, RESEARCH_COLLECTION, id));
  await deleteDoc(doc(db, RESEARCH_ADMIN_COLLECTION, id));
}

export async function fetchAuthorsPerspectives(includeUnpublished = false): Promise<AuthorPerspectiveItem[]> {
  try { return await fetchWorkflowCollection<AuthorPerspectiveItem>(AUTHORS_COLLECTION, includeUnpublished); }
  catch (error) { console.warn('Firestore author-perspective fetch failed:', error); return []; }
}

export async function saveAuthorPerspective(item: AuthorPerspectiveItem): Promise<void> {
  assertAdmin();
  const user = auth.currentUser!;
  const updatedItem: AuthorPerspectiveItem = {
    ...item,
    updatedAt: new Date().toISOString(),
    createdBy: item.createdBy || user.displayName || 'SADAN RAI',
  };
  await setDoc(doc(db, AUTHORS_COLLECTION, item.id), updatedItem, { merge: true });
  await recordRevision({
    targetId: item.id,
    targetType: 'author',
    version: 1,
    author: user.displayName || 'SADAN RAI',
    authorEmail: user.email || ADMIN_EMAIL,
    changeNotes: `लेखक दृष्टिकोण अद्यावधिक: ${item.authorName} (${item.bookTitle})`,
    snapshotData: updatedItem,
  });
}

export async function fetchEvidenceRecords(includeUnpublished = false): Promise<EvidenceRecordItem[]> {
  try { return await fetchWorkflowCollection<EvidenceRecordItem>(EVIDENCE_COLLECTION, includeUnpublished); }
  catch (error) { console.warn('Firestore evidence fetch failed:', error); return []; }
}

export async function saveEvidenceRecord(item: EvidenceRecordItem): Promise<void> {
  assertAdmin();
  const user = auth.currentUser!;
  const updatedItem: EvidenceRecordItem = {
    ...item,
    updatedAt: new Date().toISOString(),
    createdBy: item.createdBy || user.displayName || 'SADAN RAI',
  };
  await setDoc(doc(db, EVIDENCE_COLLECTION, item.id), updatedItem, { merge: true });
  await recordRevision({
    targetId: item.id,
    targetType: 'evidence',
    version: 1,
    author: user.displayName || 'SADAN RAI',
    authorEmail: user.email || ADMIN_EMAIL,
    changeNotes: 'प्रमाण अभिलेख अद्यावधिक',
    snapshotData: updatedItem,
  });
}

export async function fetchOralHistoryRecords(includeUnpublished = false): Promise<OralHistoryRecordItem[]> {
  try { return await fetchWorkflowCollection<OralHistoryRecordItem>(ORAL_HISTORY_COLLECTION, includeUnpublished); }
  catch (error) { console.warn('Firestore oral-history fetch failed:', error); return []; }
}

export async function saveOralHistoryRecord(item: OralHistoryRecordItem): Promise<void> {
  assertAdmin();
  const user = auth.currentUser!;
  const updatedItem: OralHistoryRecordItem = {
    ...item,
    updatedAt: new Date().toISOString(),
    createdBy: item.createdBy || user.displayName || 'SADAN RAI',
  };
  await setDoc(doc(db, ORAL_HISTORY_COLLECTION, item.id), updatedItem, { merge: true });
  await recordRevision({
    targetId: item.id, targetType: 'oral_history', version: 1,
    author: user.displayName || 'SADAN RAI', authorEmail: user.email || ADMIN_EMAIL,
    changeNotes: `मौखिक इतिहास अद्यावधिक: ${item.title}`, snapshotData: updatedItem,
  });
}

export async function deleteOralHistoryRecord(id: string): Promise<void> {
  assertAdmin();
  await deleteDoc(doc(db, ORAL_HISTORY_COLLECTION, id));
}

export async function recordRevision(revision: Omit<RevisionItem, 'id' | 'createdAt'>): Promise<void> {
  assertAdmin();
  const id = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const fullRevision: RevisionItem = { id, ...revision, createdAt: new Date().toISOString() };
  await setDoc(doc(db, REVISIONS_COLLECTION, id), fullRevision);
}

export async function fetchRevisions(): Promise<RevisionItem[]> {
  if (!isUserAdmin()) return [];
  try {
    const snapshot = await getDocs(query(collection(db, REVISIONS_COLLECTION), orderBy('createdAt', 'desc'), limit(50)));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as RevisionItem));
  } catch (error) {
    console.warn('Firestore revision fetch failed:', error);
    return [];
  }
}

export async function fetchArchiveCollection<T>(collectionName: string): Promise<T[]> {
  try {
    const ref = collection(db, collectionName);
    const q = collectionName === 'articles' && !isUserAdmin()
      ? query(ref, where('published', '==', true))
      : query(ref);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as T));
  } catch (error) {
    console.warn(`Firestore ${collectionName} fetch failed:`, error);
    return [];
  }
}

export async function saveArchiveRecord<T extends { id: string }>(collectionName: string, record: T): Promise<void> {
  assertAdmin();
  await setDoc(doc(db, collectionName, record.id), { ...record, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function deleteArchiveRecord(collectionName: string, id: string): Promise<void> {
  assertAdmin();
  await deleteDoc(doc(db, collectionName, id));
}
