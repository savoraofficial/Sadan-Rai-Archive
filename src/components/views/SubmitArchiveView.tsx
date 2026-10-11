import React, { useMemo, useState } from 'react';
import { FileUp, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { ADDON_TRANSLATIONS } from '../../data/archiveAddonTranslations';
import { ARCHIVE_ADDON_CONFIG } from '../../data/archiveAddonConfig';

export const SubmitArchiveView: React.FC = () => {
  const { language, navigateTo } = useArchive();
  const t = ADDON_TRANSLATIONS[language].submit;
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', location: '', category: 'history', title: '', description: '', source: '', consent: false
  });

  const subject = useMemo(
    () => `[Archive Submission] ${form.category} — ${form.title || 'Untitled'}`,
    [form.category, form.title]
  );

  const body = useMemo(() => [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Location: ${form.location}`,
    `Type: ${form.category}`,
    '',
    `Title: ${form.title}`,
    '',
    'Description:',
    form.description,
    '',
    'Sources / References:',
    form.source,
    '',
    'Consent confirmed: YES',
    '',
    'Publication note: Submission requires editorial review and rights/permission verification before publication.',
  ].join('\n'), [form]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.consent) return;
    const mailto = `mailto:${ARCHIVE_ADDON_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="addon-page addon-narrow">
        <section className="addon-success">
          <CheckCircle2 size={34} />
          <h1>{t.successTitle}</h1>
          <p>{t.successText}</p>
          <button className="addon-button addon-button-primary" onClick={() => navigateTo('/')}>{t.back}</button>
        </section>
      </main>
    );
  }

  return (
    <main className="addon-page addon-narrow">
      <section className="addon-hero addon-hero-compact">
        <div className="addon-eyebrow"><FileUp size={15} /> {t.eyebrow}</div>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>

      <form className="addon-form" onSubmit={handleSubmit}>
        <label>{t.name}<input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></label>
        <label>{t.email}<input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></label>
        <label>{t.location}<input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></label>

        <label>{t.category}
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option value="history">{t.types.history}</option>
            <option value="research">{t.types.research}</option>
            <option value="document">{t.types.document}</option>
            <option value="photograph">{t.types.photograph}</option>
            <option value="oral-history">{t.types.oralHistory}</option>
            <option value="culture">{t.types.culture}</option>
          </select>
        </label>

        <label>{t.titleLabel}<input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></label>
        <label>{t.description}<textarea required rows={7} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></label>
        <label>{t.source}<textarea rows={5} value={form.source} onChange={e => setForm({...form, source: e.target.value})} /></label>

        <label className="addon-checkbox">
          <input type="checkbox" required checked={form.consent} onChange={e => setForm({...form, consent: e.target.checked})} />
          <span>{t.consent}</span>
        </label>

        <div className="addon-trust addon-trust-small">
          <ShieldCheck size={18} />
          <span>{t.trustLine}</span>
        </div>

        <button type="submit" className="addon-button addon-button-primary addon-submit">
          <Send size={15} /> {t.submit}
        </button>
      </form>
    </main>
  );
};
