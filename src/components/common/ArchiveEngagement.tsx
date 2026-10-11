import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { Bookmark, Check, Heart, MessageCircle, Send, ShieldCheck, Flag } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { auth } from '../../firebase';
import {
  EngagementType,
  fetchApprovedComments,
  fetchLikeCount,
  hasLiked,
  likeRecord,
  isSaved,
  signInForComment,
  submitComment,
  reportComment,
  toggleSaved,
} from '../../services/communityService';

interface ArchiveEngagementProps {
  contentType: EngagementType;
  contentId: string;
}

export const ArchiveEngagement: React.FC<ArchiveEngagementProps> = ({ contentType, contentId }) => {
  const { language } = useArchive();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [commentLoginBusy, setCommentLoginBusy] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');

  const load = async () => {
    const [count, alreadyLiked] = await Promise.all([
      fetchLikeCount(contentType, contentId),
      hasLiked(contentType, contentId),
    ]);
    setLikes(count);
    setLiked(alreadyLiked);
    if (showComments) setComments(await fetchApprovedComments(contentType, contentId));
  };

  useEffect(() => {
    void load();
    setSaved(isSaved(contentType, contentId));
  }, [contentType, contentId]);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (showComments) void fetchApprovedComments(contentType, contentId).then(setComments);
  }, [showComments, contentType, contentId]);

  useEffect(() => {
    if (user && !user.isAnonymous) {
      setName((current) => current || user.displayName || '');
      setEmail((current) => current || user.email || '');
    }
  }, [user]);

  const handleLike = async () => {
    if (liked) return;
    try {
      await likeRecord(contentType, contentId);
      setLiked(true);
      setLikes((value) => value + 1);
    } catch {
      setNotice(language === 'ne' ? 'मन परेको प्रतिक्रिया दर्ता गर्न सकिएन। फेरि प्रयास गर्नुहोस्।' : 'The like could not be recorded. Please try again.');
    }
  };

  const handleSave = () => {
    const nextSaved = toggleSaved(contentType, contentId);
    setSaved(nextSaved);
  };

  const handleCommentLogin = async () => {
    setCommentLoginBusy(true);
    setNotice('');
    try {
      await signInForComment();
    } catch {
      setNotice(language === 'ne' ? 'Google Login हुन सकेन। फेरि प्रयास गर्नुहोस्।' : 'Google sign-in could not be completed. Please try again.');
    } finally {
      setCommentLoginBusy(false);
    }
  };

  const handleReport = async (commentId: string) => {
    const reason = window.prompt(language === 'ne' ? 'यो प्रतिक्रियालाई किन report गर्दै हुनुहुन्छ?' : 'Why are you reporting this comment?');
    if (!reason?.trim()) return;
    try {
      await reportComment(commentId, reason);
      setNotice(language === 'ne' ? 'Report प्राप्त भयो। Admin ले समीक्षा गर्नेछ।' : 'Report received. The administrator will review it.');
    } catch {
      setNotice(language === 'ne' ? 'Report पठाउन सकिएन।' : 'The report could not be submitted.');
    }
  };

  const handleComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || user.isAnonymous) {
      setNotice(language === 'ne' ? 'प्रतिक्रिया पठाउन Google Login आवश्यक छ।' : 'Google sign-in is required to submit a comment.');
      return;
    }
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    setNotice('');
    try {
      const result = await submitComment({ contentType, contentId, name, email, message, language });
      setMessage('');
      setNotice(result.status === 'blocked'
        ? (language === 'ne' ? 'यो प्रतिक्रिया safety filter ले रोक्यो।' : 'This comment was blocked by the safety filter.')
        : (language === 'ne'
          ? 'प्रतिक्रिया प्राप्त भयो। safety system ले जाँच गरिरहेको छ।'
          : 'Your comment was received and is being checked by the safety system.'));
    } catch {
      setNotice(language === 'ne' ? 'प्रतिक्रिया पठाउन सकिएन। फेरि प्रयास गर्नुहोस्।' : 'The comment could not be submitted. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="archive-engagement" aria-label={language === 'ne' ? 'पाठक प्रतिक्रिया' : 'Reader engagement'}>
      <div className="archive-engagement-actions">
        <button type="button" className={`archive-engagement-button ${liked ? 'is-active' : ''}`} onClick={handleLike} disabled={liked}>
          <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
          {language === 'ne' ? 'मन पर्यो' : 'Like'} · {likes}
        </button>
        <button type="button" className={`archive-engagement-button ${saved ? 'is-active' : ''}`} onClick={handleSave}>
          <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
          {saved ? (language === 'ne' ? 'सुरक्षित' : 'Saved') : (language === 'ne' ? 'सुरक्षित राख्नुहोस्' : 'Save')}
        </button>
        <button type="button" className="archive-engagement-button" onClick={() => setShowComments((value) => !value)}>
          <MessageCircle size={15} />
          {language === 'ne' ? 'प्रतिक्रिया' : 'Comments'}
        </button>
        <span className="archive-engagement-note">
          <ShieldCheck size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {language === 'ne' ? 'प्रतिक्रिया प्रकाशनअघि safety system ले जाँच गर्छ।' : 'Comments are checked by the safety system before publication.'}
        </span>
      </div>

      {showComments && (
        <div>
          {comments.length > 0 && (
            <div className="archive-comment-list">
              {comments.map((comment) => (
                <div className="archive-comment" key={comment.id}>
                  <div className="archive-comment-meta">{comment.name}</div>
                  <div className="archive-comment-text">{comment.message}</div>
                  <button type="button" className="archive-engagement-note" onClick={() => void handleReport(comment.id)} style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 0 }}>
                    <Flag size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{language === 'ne' ? 'Report' : 'Report'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {!user || user.isAnonymous ? (
            <div className="archive-comment-form">
              <strong className="text-sm text-stone-900">{language === 'ne' ? 'प्रतिक्रिया दिन Google Login गर्नुहोस्' : 'Sign in with Google to comment'}</strong>
              <button className="addon-button addon-button-primary" type="button" onClick={handleCommentLogin} disabled={commentLoginBusy}>
                {commentLoginBusy ? (language === 'ne' ? 'Login गर्दै...' : 'Signing in...') : (language === 'ne' ? 'Google Login' : 'Sign in with Google')}
              </button>
              {notice && <div className="text-xs text-amber-900 bg-amber-50 border border-amber-100 rounded p-2">{notice}</div>}
            </div>
          ) : (
          <form className="archive-comment-form" onSubmit={handleComment}>
            <strong className="text-sm text-stone-900">{language === 'ne' ? 'आफ्नो प्रतिक्रिया लेख्नुहोस्' : 'Leave a response'}</strong>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder={language === 'ne' ? 'नाम *' : 'Name *'} required />
            <input value={email} onChange={(e) => setEmail(e.target.value)} maxLength={160} type="email" placeholder={language === 'ne' ? 'इमेल (ऐच्छिक)' : 'Email (optional)'} />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={4} placeholder={language === 'ne' ? 'तपाईंको प्रतिक्रिया...' : 'Your response...'} required />
            <button className="addon-button addon-button-primary" disabled={sending} type="submit">
              <Send size={14} /> {sending ? (language === 'ne' ? 'पठाउँदै...' : 'Sending...') : (language === 'ne' ? 'प्रतिक्रिया पठाउनुहोस्' : 'Submit response')}
            </button>
            <span className="archive-engagement-note"><Check size={12} style={{ verticalAlign: 'middle' }} /> {language === 'ne' ? 'स्पाम र अनुचित सामग्री रोक्न समीक्षा गरिन्छ।' : 'Moderation helps reduce spam and inappropriate submissions.'}</span>
            {notice && <div className="text-xs text-amber-900 bg-amber-50 border border-amber-100 rounded p-2">{notice}</div>}
          </form>
          )}
        </div>
      )}
    </section>
  );
};
