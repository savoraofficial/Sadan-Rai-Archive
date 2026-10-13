import React, { useEffect, useMemo, useState } from 'react';
import { adminText } from '../../data/adminTranslations';
import { useArchive } from '../../context/ArchiveContext';
import { RevisionItem } from '../../types';
import { fetchRevisions } from '../../services/dbService';
import { Clock, History, UserCheck, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

export const AdminRevisionHistoryView: React.FC = () => {
  const { language } = useArchive();
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRevision, setSelectedRevision] = useState<RevisionItem | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loadError, setLoadError] = useState(false);
  const filteredRevisions = useMemo(() => revisions.filter((rev) => {
    const matchesType = typeFilter === 'all' || rev.targetType === typeFilter;
    const haystack = [rev.targetId, rev.targetType, rev.author, rev.authorEmail, rev.changeNotes, String(rev.version)].filter(Boolean).join(' ').toLocaleLowerCase();
    return matchesType && haystack.includes(search.trim().toLocaleLowerCase());
  }), [revisions, search, typeFilter]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchRevisions();
        setRevisions(data);
        setLoadError(false);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-800">
            <History className="w-4 h-4 text-amber-800" />
            <span>{adminText(language, 'संस्करण इतिहास तथा परिवर्तन अडिट लग' )}</span>
          </div>
          <h3 className="font-serif-np text-xl font-bold text-stone-900">
            {adminText(language, 'अपरिवर्तनीय शोध अडिट (Immutable Research Revisions)')}
          </h3>
          <p className="text-xs text-stone-500 font-sans">
            {adminText(language, 'अनुसन्धान प्रविष्टिहरू कहिल्यै गोप्य रूपमा अधिलेखन (overwrite) हुँदैनन्; हरेक परिमार्जन संस्करण, टिप्पणी र लेखकसहित अभिलेख हुन्छ।')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_220px] gap-3">
        <label className="block text-xs font-semibold text-stone-700">
          {adminText(language, 'खोज्नुहोस्')}
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={adminText(language, 'लेखक, टिप्पणी, ID वा संस्करण खोज्नुहोस्')} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-normal" type="search" />
        </label>
        <label className="block text-xs font-semibold text-stone-700">
          {adminText(language, 'लक्ष्य प्रकार छान्नुहोस्')}
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-normal">
            <option value="all">{adminText(language, 'सबै प्रकार')}</option>
            {[...new Set(revisions.map((rev) => rev.targetType))].sort().map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
      </div>

      {loadError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{adminText(language, 'संस्करण इतिहास लोड गर्न सकिएन। प्रशासकको लगइन र Firebase connection जाँच्नुहोस्।')}</div>}

      {loading ? (
        <div className="p-10 text-center text-xs text-stone-500 font-mono">
          {adminText(language, 'संस्करण इतिहास लोड हुँदैछ...')}
        </div>
      ) : filteredRevisions.length > 0 ? (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border border-stone-200">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-stone-100 text-stone-700 font-mono uppercase text-[11px] border-b border-stone-200">
                <tr>
                  <th className="p-3">{adminText(language, 'मिति / समय' )}</th>
                  <th className="p-3">{adminText(language, 'लक्ष्य प्रकार' )}</th>
                  <th className="p-3">{adminText(language, 'संस्करण (Ver)' )}</th>
                  <th className="p-3">{adminText(language, 'सम्पादक / लेखक' )}</th>
                  <th className="p-3">{adminText(language, 'परिमार्जन टिप्पणी (Change Notes)' )}</th>
                  <th className="p-3 text-right">{adminText(language, 'कार्य' )}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {filteredRevisions.map(rev => (
                  <tr key={rev.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3 font-mono text-stone-600 whitespace-nowrap">
                      {new Date(rev.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-stone-800 uppercase">
                      {rev.targetType}
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-900">
                      v{rev.version}
                    </td>
                    <td className="p-3 text-stone-800 font-medium">
                      {rev.author}
                    </td>
                    <td className="p-3 text-stone-700 font-serif-np max-w-md truncate">
                      {rev.changeNotes}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedRevision(rev)}
                        className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                      >
                        {adminText(language, 'विवरण हेर्नुहोस्')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-stone-50 rounded-lg border border-dashed border-stone-300 space-y-2">
          <Clock className="w-8 h-8 text-stone-400 mx-auto" />
          <h4 className="font-serif-np font-bold text-stone-800">
            {revisions.length ? adminText(language, 'खोजी वा filter सँग मिल्ने संस्करण भेटिएन') : adminText(language, 'हाल कुनै परिमार्जन लग उपलब्ध छैन')}
          </h4>
          <p className="text-xs text-stone-500 font-sans">
            {adminText(language, 'अनुसन्धान वा लेखक प्रविष्टि सुरक्षित गर्दा स्वचालित रूपमा संस्करण अडिट सिर्जना हुनेछ।')}
          </p>
        </div>
      )}

      {/* Snapshot Modal */}
      {selectedRevision && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-stone-200">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-stone-900 font-serif-np">
                  {adminText(language, 'संस्करण विवरण')} #{selectedRevision.id} (v{selectedRevision.version})
                </h4>
                <p className="text-xs text-stone-500 font-mono">
                  {new Date(selectedRevision.createdAt).toLocaleString()} · {selectedRevision.author}
                </p>
              </div>
              <button
                onClick={() => setSelectedRevision(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs font-sans">
              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <span className="font-bold text-amber-950 block">{adminText(language, 'परिमार्जन टिप्पणी:' )}</span>
                <p className="text-stone-800 font-serif-np">{selectedRevision.changeNotes}</p>
              </div>

              <div>
                <span className="font-mono text-stone-500 block mb-1">{adminText(language, 'स्न्यापसट डेटा (JSON Snapshot):' )}</span>
                <pre className="p-3 bg-stone-900 text-stone-200 rounded font-mono text-[11px] overflow-x-auto max-h-64">
                  {JSON.stringify(selectedRevision.snapshotData, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-stone-500">{adminText(language, 'यो संस्करण केवल पढ्नका लागि हो; मूल अभिलेखमा restore गर्ने कार्य अझै उपलब्ध छैन।')}</span>
              <button
                onClick={() => setSelectedRevision(null)}
                className="px-4 py-1.5 bg-stone-800 text-white rounded text-xs cursor-pointer"
              >
                {adminText(language, 'बन्द गर्नुहोस्')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
