import { useEffect } from 'react';

/**
 * Keeps admin text inputs usable through controlled React updates/remounts.
 * The guard is deliberately opt-in and only restores the field that was being
 * typed into immediately before React replaced its DOM node.
 */
export function useAdminTypingFocusGuard(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let activeKey = '';
    let selectionStart = 0;
    let selectionEnd = 0;
    let restoreTimer: number | undefined;

    const isTextField = (target: EventTarget | null): target is HTMLInputElement | HTMLTextAreaElement => {
      const el = target as HTMLInputElement | HTMLTextAreaElement | null;
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && !el.disabled && !el.readOnly;
    };

    const getKey = (el: HTMLInputElement | HTMLTextAreaElement) =>
      el.dataset.adminTypingKey || el.id || el.name || '';

    const remember = (target: EventTarget | null) => {
      if (!isTextField(target)) return;
      const key = getKey(target);
      if (!key) return;
      activeKey = key;
      selectionStart = target.selectionStart ?? target.value.length;
      selectionEnd = target.selectionEnd ?? target.value.length;
    };

    const restore = () => {
      if (!activeKey) return;
      const field = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `[data-admin-typing-key="${CSS.escape(activeKey)}"], #${CSS.escape(activeKey)}`
      );
      if (!field || field.disabled || field.readOnly) return;
      if (document.activeElement !== field) field.focus({ preventScroll: true });
      try { field.setSelectionRange(selectionStart, selectionEnd); } catch { /* non-text input */ }
    };

    const onFocusIn = (event: FocusEvent) => remember(event.target);
    const onInput = (event: Event) => {
      if (!isTextField(event.target)) return;
      remember(event.target);
      if (restoreTimer) window.clearTimeout(restoreTimer);
      restoreTimer = window.setTimeout(restore, 0);
    };

    document.addEventListener('focusin', onFocusIn, true);
    document.addEventListener('input', onInput, true);
    return () => {
      if (restoreTimer) window.clearTimeout(restoreTimer);
      document.removeEventListener('focusin', onFocusIn, true);
      document.removeEventListener('input', onInput, true);
    };
  }, [enabled]);
}
