# Google Drive media backup

Firebase Storage remains the primary media store. The trusted Firebase Function `backupArchiveMediaToDrive` mirrors newly finalized files under:

- `archive/photos/`
- `archive/videos/`
- `archive/research/`

to a Google Drive folder.

## Required one-time configuration

1. Create a Google Cloud service account dedicated to the archive backup.
2. Enable the Google Drive API for the Google Cloud project used by that service account.
3. Create a Drive folder for the archive backup.
4. Share that Drive folder with the service account's `client_email` as an Editor.
5. Store the service-account JSON as the Firebase Functions secret `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON`.
6. Store the Drive folder ID as the Firebase Functions secret `GOOGLE_DRIVE_FOLDER_ID`.
7. Deploy the Functions.

Do **not** put the service-account JSON, private key, or Drive credentials in the frontend, `.env`, GitHub, or this ZIP.

Until both secrets are configured, the backup function safely skips Drive mirroring; Firebase Storage continues to work normally.
