import React, { useEffect, useState } from 'react';
import { Check, Heart, MessageCircle, Send, ShieldCheck } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import {
  EngagementType,
  fetchApprovedComments,
  fetchLikeCount,
  hasLiked,
  likeRecord,
  submitComment,
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
  }, [contentType, contentId]);

  useEffect(() => {
    if (showComments) void fetchApprovedComments(contentType, contentId).then(setComments);
  }, [showComments, contentType, contentId]);

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

  const handleComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    setNotice('');
    try {
      await submitComment({ contentType, contentId, name, email, message, language });
      setMessage('');
      setNotice(language === 'ne'
        ? 'प्रतिक्रिया प्राप्त भयो। प्रकाशनअघि अभिलेखद्वारा समीक्षा गरिनेछ।'
        : 'Your comment was received and will be reviewed before publication.');
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
        <button type="button" className="archive-engagement-button" onClick={() => setShowComments((value) => !value)}>
          <MessageCircle size={15} />
          {language === 'ne' ? 'प्रतिक्रिया' : 'Comments'}
        </button>
        <span className="archive-engagement-note">
          <ShieldCheck size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {language === 'ne' ? 'प्रतिक्रिया प्रकाशनअघि समीक्षा हुन्छ।' : 'Comments are reviewed before publication.'}
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
                </div>
              ))}
            </div>
          )}

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
        </div>
      )}
    </section>
  );
};
