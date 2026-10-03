import { useEffect } from 'react';

function fieldPath(el: HTMLElement, form: HTMLFormElement): number[] {
  const path: number[] = [];
  let node: HTMLElement | null = el;
  while (node && node !== form) {
    const parent = node.parentElement;
    if (!parent) break;
    path.unshift(Array.prototype.indexOf.call(parent.children, node));
    node = parent;
  }
  return path;
}

function findByPath(form: HTMLFormElement, path: number[]): HTMLElement | null {
  let node: HTMLElement = form;
  for (const index of path) {
    const child = node.children.item(index) as HTMLElement | null;
    if (!child) return null;
    node = child;
  }
  return node;
}

/** Keeps admin text-field focus through controlled React state updates/remounts. */
export function useAdminTypingFocusGuard(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let focusedFormOrder = -1;
    let focusedPath: number[] = [];
    let focusedSelectionStart = 0;
    let focusedSelectionEnd = 0;
    let restoreTimer: number | undefined;

    const isTextField = (target: EventTarget | null): target is HTMLInputElement | HTMLTextAreaElement => {
      const el = target as HTMLElement | null;
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && !(el as HTMLInputElement).disabled;
    };

    const formOrder = (form: HTMLFormElement) => Array.from(document.querySelectorAll<HTMLFormElement>('form')).indexOf(form);

    const remember = (target: EventTarget | null) => {
      if (!isTextField(target)) return;
      const form = target.closest('form');
      if (!form) return;
      focusedFormOrder = formOrder(form);
      focusedPath = fieldPath(target, form);
      focusedSelectionStart = target.selectionStart ?? target.value.length;
      focusedSelectionEnd = target.selectionEnd ?? target.value.length;
    };

    const restore = () => {
      if (focusedFormOrder < 0 || !focusedPath.length) return;
      const forms = document.querySelectorAll<HTMLFormElement>('form');
      const form = forms.item(focusedFormOrder);
      if (!form) return;
      const field = findByPath(form, focusedPath);
      if (!isTextField(field)) return;
      if (document.activeElement !== field) {
        field.focus({ preventScroll: true });
      }
      try {
        field.setSelectionRange(focusedSelectionStart, focusedSelectionEnd);
      } catch { /* input types without selection ranges */ }
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
