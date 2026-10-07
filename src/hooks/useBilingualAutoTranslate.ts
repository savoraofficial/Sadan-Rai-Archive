import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { translateArchiveText } from '../services/translationService';

type Setter<T> = Dispatch<SetStateAction<T>>;

/**
 * Debounced, non-destructive bilingual field helper. Generated text remains
 * fully editable; manual corrections are never overwritten by later source typing.
 */
export function useBilingualAutoTranslate<T extends Record<string, any>>(
  values: T,
  setValues: Setter<T>,
  primaryKey: keyof T,
  secondaryKey: keyof T
) {
  const valuesRef = useRef(values);
  const lastAutoPrimary = useRef('');
  const lastAutoSecondary = useRef('');
  const manualPrimary = useRef(false);
  const manualSecondary = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const requestId = useRef(0);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const scheduleTranslation = useCallback((source: string, targetLanguage: 'en' | 'ne', sourceKey: keyof T, targetKey: keyof T) => {
    if (timer.current) window.clearTimeout(timer.current);
    const currentRequest = ++requestId.current;
    timer.current = window.setTimeout(async () => {
      const current = source.trim();
      if (!current) return;
      const latest = valuesRef.current;
      const target = String(latest[targetKey] || '').trim();
      const lastAutoTarget = targetKey === secondaryKey ? lastAutoSecondary.current : lastAutoPrimary.current;
      const manualTarget = targetKey === secondaryKey ? manualSecondary.current : manualPrimary.current;
      if (manualTarget && target !== lastAutoTarget) return;
      if (target && target !== lastAutoTarget) return;
      const translated = await translateArchiveText(current, targetLanguage);
      if (currentRequest !== requestId.current) return;
      if (!translated) return;
      const afterRequest = valuesRef.current;
      const latestSource = String(afterRequest[sourceKey] || '').trim();
      // Never apply a stale translation after the user has continued typing/editing.
      if (latestSource !== current) return;
      if (targetKey === secondaryKey) {
        lastAutoSecondary.current = translated;
        manualSecondary.current = false;
      } else {
        lastAutoPrimary.current = translated;
        manualPrimary.current = false;
      }
      setValues(prev => ({ ...prev, [targetKey]: translated }));
    }, 650);
  }, [secondaryKey, setValues]);

  const setPrimary = useCallback((value: string) => {
    manualPrimary.current = value !== lastAutoPrimary.current;
    setValues(prev => ({ ...prev, [primaryKey]: value }));
    scheduleTranslation(value, 'ne', primaryKey, secondaryKey);
  }, [primaryKey, secondaryKey, scheduleTranslation, setValues]);

  const setSecondary = useCallback((value: string) => {
    manualSecondary.current = value !== lastAutoSecondary.current;
    setValues(prev => ({ ...prev, [secondaryKey]: value }));
    scheduleTranslation(value, 'en', secondaryKey, primaryKey);
  }, [primaryKey, secondaryKey, scheduleTranslation, setValues]);

  return { setPrimary, setSecondary };
}
