export type ResearchStatus = 'verified' | 'oral_history' | 'further_research';

export type SourceCategory = 
  | 'book' 
  | 'academic_paper' 
  | 'government_doc' 
  | 'museum_archive' 
  | 'credible_web' 
  | 'interview' 
  | 'oral_history';

export interface Source {
  id: string;
  title: string;
  author: string;
  year?: string;
  publicationOrArchive: string;
  category: SourceCategory;
  isDocumentaryEvidence: boolean; // true = written/documentary, false = oral tradition
  url?: string;
  quotationOrNote?: string;
}

export type ArticleCategory = string;

export interface Article {
  id: string;
  slug: string;
  category: ArticleCategory;
  title: string;
  nepaliTitle?: string;
  englishTitle?: string;
  excerpt: string;
  content: string; // Markdown or formatted text
  author: string;
  publicationDate: string;
  location: string;
  researchStatus: ResearchStatus;
  statusDisclaimer?: string;
  sourceIds: string[];
  relatedSlugs: string[];
  featuredImage?: string;
  imageCaption?: string;
  isFeatured?: boolean;
  readingTimeMinutes?: number;
  published: boolean;
}

export interface PhotoItem {
  id: string;
  title: string;
  nepaliTitle: string;
  category: 'village' | 'monuments' | 'rituals' | 'archives' | 'attire';
  caption: string;
  location: string;
  dateKnown?: string;
  photographer: string;
  rightsHolder: string;
  license: string;
  imageUrl: string;
  tags: string[];
  recordId?: string;
  country?: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  place?: string;
  description?: string;
  historicalPeriod?: string;
  source?: string;
  evidence?: string;
  permission?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  nepaliTitle: string;
  type: 'audio' | 'video';
  category: 'song' | 'music_video' | 'performance' | 'cultural_recording' | 'documentary';
  duration: string;
  year: string;
  description: string;
  credits: string;
  rightsInfo: string;
  mediaUrl: string;
  lyricsOrNotes?: string;
  thumbnailUrl?: string;
  recordId?: string;
  country?: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  place?: string;
  recordingDate?: string;
  historicalPeriod?: string;
  location?: string;
  source?: string;
  evidence?: string;
  permission?: string;
  transcript?: string;
}

export type VillageSectionKey = 
  | 'intro'
  | 'history'
  | 'culture'
  | 'customs'
  | 'livelihood'
  | 'migration'
  | 'nature'
  | 'places'
  | 'elders'
  | 'archives'
  | 'stories';

export interface VillageSectionData {
  key: VillageSectionKey;
  nepaliTitle: string;
  englishTitle: string;
  summary: string;
  summaryEnglish?: string;
  content: string[];
  highlights?: string[];
  images?: { url: string; caption: string }[];
}

export type KiratHistorySectionKey = 
  | 'intro'
  | 'timeline'
  | 'authors_researchers'
  | 'evidence_archive'
  | 'civilization'
  | 'oral_history'
  | 'disputed_topics'
  | 'sources_references';

export interface KiratHistorySectionData {
  key: KiratHistorySectionKey;
  nepaliTitle: string;
  englishTitle: string;
  summary: string;
  summaryEnglish?: string;
  schema: {
    sourceLabel: string;
    authorLabel: string;
    dateLabel: string;
    evidenceTypeLabel: string;
    researchStatusLabel: string;
  };
}

export interface VerifiedPassage {
  pageOrChapter: string;
  originalEnglish: string;
  nepaliTranslation: string;
}

export interface InformantDetail {
  name: string;
  nameEnglish?: string;
  role: string;
  roleEnglish?: string;
  details: string;
  detailsEnglish?: string;
}

export interface HistoricalAuthorEntry {
  id: string;
  author: string;
  authorNepali: string;
  bookTitle: string;
  originalEnglishBookTitle: string;
  publicationYear: string;
  sourceType: string;
  topic: string;
  topicNepali: string;
  authorSummaryNepali: string;
  authorSummaryEnglish?: string;
  verifiedPassages: VerifiedPassage[];
  referenceLink: string;
  referenceCitation: string;
  pageOrChapterDisplay: string;
  pageOrChapterDisplayEnglish?: string;
  informationOrigins: {
    title: string;
    titleEnglish?: string;
    isDirectObservation: boolean;
    directObservationNote: string;
    directObservationNoteEnglish?: string;
    informants: InformantDetail[];
    methodologyNote: string;
    methodologyNoteEnglish?: string;
  };
  researchStatus: string;
  researchStatusEnglish?: string;
  researchNote: string;
  researchNoteEnglish?: string;
  modernEvaluation: string;
  modernEvaluationEnglish?: string;
}

export type WorkflowStatus = 'draft' | 'under_review' | 'published' | 'archived';

export type RightsStatus = 
  | 'original_sadan_rai' 
  | 'third_party_source' 
  | 'public_domain' 
  | 'licensed' 
  | 'oral_history_permission';

export type EvidenceType = 
  | 'book' 
  | 'academic_paper' 
  | 'government_doc' 
  | 'archive' 
  | 'museum_record' 
  | 'archaeological_evidence' 
  | 'inscription' 
  | 'manuscript' 
  | 'photograph' 
  | 'map' 
  | 'interview' 
  | 'oral_history' 
  | 'other';

export interface OralHistoryRecordItem {
  id: string;
  title: string;
  nepaliTitle?: string;
  englishTitle?: string;
  category: string;
  subject?: string;
  community?: string;
  informantName: string;
  informantAge?: string;
  informantRole?: string;
  informantOrigin?: string;
  informantLocation?: string;
  language?: string;
  interviewDate?: string;
  interviewLocation?: string;
  interviewer: string;
  recorder?: string;
  recordingType?: string;
  duration?: string;
  recordingReference?: string;
  transcript?: string;
  translation?: string;
  historicalPeriod?: string;
  placesMentioned?: string;
  peopleMentioned?: string;
  testimony: string;
  researcherNotes?: string;
  documentaryEvidence?: string;
  supportingSources?: string;
  evidenceDetails?: string;
  verificationStatus: ResearchStatus;
  contradictions?: string;
  consentStatus: string;
  rightsHolder?: string;
  publicationPermission?: string;
  privacyRestrictions?: string;
  copyrightNotes?: string;
  sourceDonor?: string;
  referenceId?: string;
  workflowStatus: WorkflowStatus;
  rightsStatus: RightsStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface ResearchSynthesis {
  documentedInfo: string;
  scholarlyInterpretation: string;
  oralTradition: string;
  disputedInfo: string;
  furtherResearchNeeded: string;
}

export interface ResearchWorkflowEvidenceAttachment {
  id: string;
  name: string;
  url: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

export interface ResearchWorkflowSourceEntry {
  id: string;
  sourceKind: 'foreign_scholar' | 'nepali_scholar' | 'local_researcher' | 'community_oral' | 'primary_document' | 'other';
  authorOrInformant: string;
  countryOrInstitution?: string;
  workOrSource: string;
  publicationYear?: string;
  publisher?: string;
  edition?: string;
  chapterSection?: string;
  pageNumber?: string;
  whatItSays: string;
  reference: string;
  evidenceNote: string;
  evidenceAttachments?: ResearchWorkflowEvidenceAttachment[];
  assessment?: string;
}

export interface ResearchWorkflow {
  subjectFamily: string;
  civilizationOrTradition: string;
  sourceEntries: ResearchWorkflowSourceEntry[];
  crossCheckAgreements: string;
  crossCheckDifferences: string;
  evidenceAssessment: string;
  localVerification: string;
  localVerificationLocation?: string;
  localVerificationInformants?: string;
  localVerificationDate?: string;
  localVerificationAttachments?: ResearchWorkflowEvidenceAttachment[];
  verificationOutcome: 'not_checked' | 'corroborated' | 'partially_supported' | 'conflicting' | 'not_verified' | 'further_research';
  researcherAnalysis: string;
  finalConclusion: string;
}

export interface ResearchRecordItem {
  id: string;
  title: string;
  nepaliTitle: string;
  englishTitle?: string;
  category: string;
  community?: string;
  topic: string;
  author?: string;
  publication?: string;
  publicationYear?: string;
  sourceUrl?: string;
  pageNumber?: string;
  chapterSection?: string;
  originalQuotation?: string;
  nepaliTranslation?: string;
  englishTranslation?: string;
  nepaliExplanation?: string;
  englishExplanation?: string;
  evidence?: string;
  evidenceType?: EvidenceType;
  otherAuthorsViews?: string;
  conflictingViews?: string;
  oralHistory?: string;
  researchConclusion?: string;
  researchStatus: ResearchStatus;
  location?: string;
  date?: string;
  mediaAttachments?: string;
  rightsStatus: RightsStatus;
  notes?: string;
  synthesis?: ResearchSynthesis;
  researchWorkflow?: ResearchWorkflow;
  workflowStatus: WorkflowStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  changeNotes?: string;
}

export interface AuthorPerspectiveItem {
  id: string;
  topic: string;
  topicNepali?: string;
  authorName: string;
  authorNameNepali?: string;
  bookTitle: string;
  publicationYear: string;
  page?: string;
  whatAuthorWrote: string;
  originalQuotation?: string;
  nepaliTranslation?: string;
  englishTranslation?: string;
  sourceUrl?: string;
  evidenceUsed?: string;
  localInformants?: string;
  isDirectObservation: boolean;
  otherAuthorsViews?: string;
  differences?: string;
  researchStatus: ResearchStatus;
  workflowStatus: WorkflowStatus;
  rightsStatus: RightsStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface EvidenceRecordItem {
  id: string;
  title: string;
  nepaliTitle?: string;
  type: EvidenceType;
  datePeriod?: string;
  location?: string;
  description: string;
  originalSource?: string;
  reference?: string;
  mediaUrl: string;
  rights: RightsStatus;
  verificationStatus: ResearchStatus;
  workflowStatus: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface RevisionItem {
  id: string;
  targetId: string;
  targetType: 'research' | 'author' | 'evidence' | 'article' | 'oral_history';
  version: number;
  author: string;
  authorEmail?: string;
  changeNotes: string;
  snapshotData?: any;
  createdAt: string;
}


