import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

const OWNER_EMAIL = 'raiktosadan@gmail.com';

function isEditableTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
}

/** Strong client-side copy/selection deterrence for public visitors. Admin editing is unlocked only on the dedicated admin surface. */
export function PublicContentProtection() {
  useEffect(() => {
    let isOwner = auth.currentUser?.email?.toLowerCase() === OWNER_EMAIL;
    const root = document.documentElement;

    // Authentication alone must never unlock the public archive. Only the dedicated
    // editorial console is allowed to be fully editable/copyable for the owner.
    const isAdminSurface = () => {
      const hashRoute = window.location.hash.replace(/^#/, '').split('?')[0] || '/';
      const path = window.location.pathname.split('?')[0] || '/';
      const route = hashRoute !== '/' ? hashRoute : path;
      return route === '/sadan-rai-editorial-console' ||
        route === '/sadan-rai-editorial-login' ||
        route.startsWith('/sadan-rai-editorial-console/');
    };

    const applyMode = () => root.classList.toggle('archive-public-locked', !(isOwner && isAdminSurface()));
    applyMode();
    const unsubscribe = onAuthStateChanged(auth, user => {
      isOwner = user?.email?.toLowerCase() === OWNER_EMAIL;
      applyMode();
    });
    window.addEventListener('hashchange', applyMode);
    const routeObserver = window.setInterval(applyMode, 250);

    const block = (event: Event) => {
      if ((isOwner && isAdminSurface()) || isEditableTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const keydown = (event: KeyboardEvent) => {
      if ((isOwner && isAdminSurface()) || isEditableTarget(event.target)) return;
      const key = event.key.toLowerCase();
      const blockedCombo = (event.ctrlKey || event.metaKey) && ['c', 'x', 'a', 'u', 's', 'p'].includes(key);
      const blockedDevTools = event.key === 'F12' || ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key));
      if (blockedCombo || blockedDevTools) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', block, true);
    document.addEventListener('selectstart', block, true);
    document.addEventListener('copy', block, true);
    document.addEventListener('cut', block, true);
    document.addEventListener('dragstart', block, true);
    document.addEventListener('keydown', keydown, true);

    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', applyMode);
      window.clearInterval(routeObserver);
      root.classList.remove('archive-public-locked');
      document.removeEventListener('contextmenu', block, true);
      document.removeEventListener('selectstart', block, true);
      document.removeEventListener('copy', block, true);
      document.removeEventListener('cut', block, true);
      document.removeEventListener('dragstart', block, true);
      document.removeEventListener('keydown', keydown, true);
    };
  }, []);

  return null;
}
