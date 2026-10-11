import { useState } from 'react';

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (token: { access_token?: string; error?: string }) => void | Promise<void>;
            error_callback?: (error: { type?: string }) => void;
          }) => { requestAccessToken: (options?: { prompt?: string }) => void };
        };
      };
    };
  }
}

export default function GoogleDriveUpload() {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    const clientId = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID as string | undefined;
    const folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID as string | undefined;

    if (!clientId || !folderId) {
      setStatus('Google Drive setup incomplete: configure VITE_GOOGLE_DRIVE_CLIENT_ID and VITE_GOOGLE_DRIVE_FOLDER_ID.');
      return;
    }
    if (!window.google?.accounts?.oauth2) {
      setStatus('Google Identity Services has not loaded. Refresh the page and try again.');
      return;
    }

    setBusy(true);
    setStatus('Waiting for Google Drive authorization…');

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive',
      callback: async (token) => {
        try {
          if (token.error || !token.access_token) throw new Error(token.error || 'No access token returned.');
          const boundary = `SadanRaiArchive${Date.now()}`;
          const metadata = { name: file.name, parents: [folderId] };
          const body = new Blob([
            `--${boundary}\r\n`,
            'Content-Type: application/json; charset=UTF-8\r\n\r\n',
            JSON.stringify(metadata),
            `\r\n--${boundary}\r\n`,
            `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`,
            file,
            `\r\n--${boundary}--`,
          ], { type: `multipart/related; boundary=${boundary}` });

          const response = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token.access_token}`,
                'Content-Type': body.type,
              },
              body,
            },
          );
          if (!response.ok) {
            const detail = await response.text();
            throw new Error(`Drive upload failed (${response.status}): ${detail.slice(0, 240)}`);
          }
          const result = await response.json() as { id?: string; name?: string; webViewLink?: string };
          setStatus(`Drive upload confirmed: ${result.name || file.name}${result.id ? ` · ID ${result.id}` : ''}`);
        } catch (error) {
          console.error('Google Drive upload error:', error);
          setStatus(error instanceof Error ? error.message : 'Google Drive upload failed.');
        } finally {
          setBusy(false);
        }
      },
      error_callback: (error) => {
        setBusy(false);
        setStatus(`Google authorization did not complete${error.type ? `: ${error.type}` : '.'}`);
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5 space-y-3">
      <div>
        <h3 className="font-serif-np font-bold text-stone-900">Google Drive backup / upload test</h3>
        <p className="mt-1 text-xs leading-5 text-stone-600">
          Upload one small test file, then open Google Drive and confirm it appears in the configured folder. A success message confirms the API response, not a complete backup of the archive.
        </p>
      </div>
      <label className="block text-xs font-semibold text-stone-700">
        Choose a test file
        <input
          type="file"
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.currentTarget.value = '';
          }}
          className="mt-2 block w-full rounded-md border border-stone-300 bg-stone-50 p-2 text-xs file:mr-3 file:rounded file:border-0 file:bg-stone-900 file:px-3 file:py-2 file:text-white"
        />
      </label>
      {status && <p role="status" className="break-words rounded-md bg-stone-50 p-3 text-xs leading-5 text-stone-700">{status}</p>}
      {busy && <p className="text-xs text-amber-800">Waiting for Google Drive…</p>}
    </section>
  );
}
