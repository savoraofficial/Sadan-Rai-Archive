import React, { useEffect, useMemo, useState } from 'react';
import { Check, MessageCircle, ShieldCheck, XCircle, DollarSign } from 'lucide-react';
import { auth } from '../../firebase';
import { getRedirectResult, onAuthStateChanged, signInWithRedirect, signOut, User } from 'firebase/auth';
import { googleProvider } from '../../firebase';
import { isUserAdmin } from '../../services/dbService';
import { useArchive } from '../../context/ArchiveContext';
import { adminText } from '../../data/adminTranslations';
import {
  fetchAllComments,
  fetchAllCommentReports,
  resolveCommentReport,
  fetchConfirmedEarnings,
  fetchSupportIntents,
  markSupportIntent,
  moderateComment,
  deleteComment,
  recordConfirmedEarning,
} from '../../services/communityService';

export const CommunityAdminView: React.FC = () => {
  const { language } = useArchive();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [comments, setComments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [intents, setIntents] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [notice, setNotice] = useState('');

  const isAdmin = isUserAdmin();
  const totalEarnings = useMemo(() => earnings.reduce((sum, item) => sum + Number(item.amountUsd || 0), 0), [earnings]);

  const load = async () => {
    if (!isUserAdmin()) return;
    const [c, r, i, e] = await Promise.all([fetchAllComments(), fetchAllCommentReports(), fetchSupportIntents(), fetchConfirmedEarnings()]);
    setComments(c); setReports(r); setIntents(i); setEarnings(e);
  };

  useEffect(() => onAuthStateChanged(auth, (next) => { setUser(next); void load(); }), []);

  useEffect(() => {
    void getRedirectResult(auth).catch(() => {
      setNotice(adminText(language, 'Google authentication failed.'));
    });
  }, [language]);

  const signIn = async () => {
    try { await signInWithRedirect(auth, googleProvider); }
    catch { setNotice(adminText(language, 'Google authentication failed.')); }
  };

  const moderate = async (id: string, status: 'approved' | 'rejected' | 'blocked') => {
    try { await moderateComment(id, status); await load(); }
    catch { setNotice(adminText(language, 'Comment moderation failed.')); }
  };

  const confirmSupport = async (intent: any) => {
    const reference = window.prompt(adminText(language, 'Enter the verified payment transaction reference. Do not enter card details.'));
    if (!reference?.trim()) return;
    try {
      await recordConfirmedEarning({
        supportIntentId: intent.id,
        amountUsd: Number(intent.amountUsd),
        plan: intent.plan,
        paymentProvider: 'Manual / configured provider',
        transactionReference: reference.trim().slice(0, 200),
      });
      await load();
    } catch { setNotice(adminText(language, 'Earning confirmation failed.')); }
  };

  if (!isAdmin) {
    return (
      <main className="addon-page addon-narrow">
        <section className="addon-success">
          <ShieldCheck size={34} />
          <h1>{adminText(language, 'Owner access' )}</h1>
          <p>{adminText(language, 'Community moderation and earnings are private. Sign in with the authorized owner account.' )}</p>
          <button className="addon-button addon-button-primary" onClick={signIn}>{adminText(language, 'Sign in with Google' )}</button>
          {user && <p className="text-xs">{adminText(language, 'Signed in as')} {user.email}. {adminText(language, 'This account is not authorized.')}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="addon-page">
      <section className="addon-hero addon-hero-compact">
        <div className="addon-eyebrow"><ShieldCheck size={15} /> {adminText(language, 'Owner-only community console')}</div>
        <h1>{adminText(language, 'Community & Earnings' )}</h1>
        <p>{adminText(language, 'Moderate visitor responses and record only verified support transactions. Visitor-submitted amounts never become earnings automatically.' )}</p>
        <button className="addon-button addon-button-secondary" onClick={() => signOut(auth)}>{adminText(language, 'Sign out' )}</button>
      </section>

      <section className="archive-community-grid">
        <div className="archive-community-card"><MessageCircle size={18} /><strong>{comments.filter((c) => c.status === 'pending').length}</strong><span>{adminText(language, 'Pending comments' )}</span></div>
        <div className="archive-community-card"><DollarSign size={18} /><strong>${totalEarnings.toFixed(2)}</strong><span>{adminText(language, 'Confirmed earnings' )}</span></div>
        <div className="archive-community-card"><ShieldCheck size={18} /><strong>{intents.filter((i) => i.status === 'pending').length}</strong><span>{adminText(language, 'Support intents awaiting review' )}</span></div>
      </section>

      <section className="addon-form" style={{ marginTop: 24 }}>
        <h2 className="font-serif text-xl mb-4">{adminText(language, 'Comments moderation' )}</h2>
        <div className="space-y-3">
          {comments.length === 0 && <p className="text-sm text-stone-500">{adminText(language, 'No comments yet.' )}</p>}
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 border border-stone-200 rounded-xl bg-stone-50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-sm">{comment.name}</strong>
                <span className="text-[11px] font-mono text-stone-500">{comment.status}</span>
              </div>
              <p className="text-sm text-stone-700 mt-2 whitespace-pre-wrap">{comment.message}</p>
              {comment.status === 'pending' && <div className="flex gap-2 mt-3"><button className="addon-button addon-button-primary" onClick={() => moderate(comment.id, 'approved')}><Check size={14}/> {adminText(language, 'Approve')}</button><button className="addon-button addon-button-secondary" onClick={() => moderate(comment.id, 'rejected')}><XCircle size={14}/> {adminText(language, 'Reject')}</button><button className="addon-button addon-button-secondary" onClick={() => moderate(comment.id, 'blocked')}>{adminText(language, 'Block')}</button><button className="addon-button addon-button-secondary" onClick={() => deleteComment(comment.id).then(load)}>{adminText(language, 'Delete')}</button></div>}
            </div>
          ))}
        </div>
      </section>

      <section className="addon-form" style={{ marginTop: 24 }}>
        <h2 className="font-serif text-xl mb-4">{adminText(language, 'Comment reports')}</h2>
        <div className="space-y-3">
          {reports.length === 0 && <p className="text-sm text-stone-500">{adminText(language, 'No comment reports yet.')}</p>}
          {reports.map((report) => (
            <div key={report.id} className="p-4 border border-stone-200 rounded-xl bg-stone-50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-sm">{adminText(language, 'Reported comment')}</strong>
                <span className="text-[11px] font-mono text-stone-500">{report.status}</span>
              </div>
              <p className="text-sm text-stone-700 mt-2">{report.reason}</p>
              <p className="text-xs text-stone-500 mt-1">Comment ID: {report.commentId}</p>
              {report.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button className="addon-button addon-button-secondary" onClick={() => resolveCommentReport(report.id).then(load)}>{adminText(language, 'Mark reviewed')}</button>
                  <button className="addon-button addon-button-primary" onClick={() => moderate(report.commentId, 'blocked').then(() => resolveCommentReport(report.id)).then(load)}>{adminText(language, 'Block comment')}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="addon-form" style={{ marginTop: 24 }}>
        <h2 className="font-serif text-xl mb-4">{adminText(language, 'Support intents & earnings' )}</h2>
        <p className="text-xs text-stone-600 mb-4">{adminText(language, 'Only confirm an earning after checking the actual transaction in the configured payment provider. Never store card numbers, CVV, passwords or other payment credentials here.' )}</p>
        <div className="space-y-3">
          {intents.length === 0 && <p className="text-sm text-stone-500">{adminText(language, 'No support requests yet.' )}</p>}
          {intents.map((intent) => (
            <div key={intent.id} className="p-4 border border-stone-200 rounded-xl bg-stone-50 flex flex-wrap items-center justify-between gap-4">
              <div><strong className="text-sm">{intent.name || adminText(language, 'Supporter')}</strong><p className="text-xs text-stone-600">{intent.plan} · ${intent.amountUsd} · {intent.email}</p><p className="text-xs text-stone-500 mt-1">{adminText(language, 'Status:')} {intent.status}</p></div>
              {intent.status === 'pending' && <div className="flex gap-2"><button className="addon-button addon-button-primary" onClick={() => confirmSupport(intent)}>{adminText(language, 'Confirm verified payment' )}</button><button className="addon-button addon-button-secondary" onClick={() => markSupportIntent(intent.id, 'cancelled').then(load)}>{adminText(language, 'Cancel' )}</button></div>}
            </div>
          ))}
        </div>
      </section>

      {notice && <div className="mt-4 text-xs text-amber-900 bg-amber-50 border border-amber-100 rounded p-3">{notice}</div>}
    </main>
  );
};
