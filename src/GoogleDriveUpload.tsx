import { useState } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleDriveUpload() {
  const [status, setStatus] = useState("");

  async function upload(file: File) {
    setStatus("Google Drive permission...");

    if (!window.google?.accounts?.oauth2) {
      setStatus("Google service loading... Refresh page.");
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/drive",
      callback: async (token: any) => {
        try {
          const boundary = "SadanRai" + Date.now();

          const metadata = {
            name: file.name,
            parents: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID],
          };

          const body = new Blob([
            --${boundary}\r\n,
            "Content-Type: application/json; charset=UTF-8\r\n\r\n",
            JSON.stringify(metadata),
            \r\n--${boundary}\r\n,
            Content-Type: ${file.type || "application/octet-stream"}\r\n\r\n,
            file,
            \r\n--${boundary}--,
          ], {
            type: multipart/related; boundary=${boundary},
          });

          const res = await fetch(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink",
            {
              method: "POST",
              headers: {
                Authorization: Bearer ${token.access_token},
                "Content-Type": body.type,
              },
              body,
            }
          );

          if (!res.ok) throw new Error(await res.text());

          const result = await res.json();
          setStatus(? Drive uploaded: ${result.name});
        } catch (e) {
          console.error(e);
          setStatus("? Drive upload failed");
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: "consent" });
  }

  return (
    <div style={{ margin: "16px 0" }}>
      <label>
        <strong>Google Drive Upload</strong>
        <br />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
        />
      </label>
      {status && <div style={{ marginTop: 8 }}>{status}</div>}
    </div>
  );
}
