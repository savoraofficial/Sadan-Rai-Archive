# Sadan Rai Archive — Start Here

This archive is distributed as a clean source project. Open the folder that contains **package.json** directly in VS Code.

## Windows / PowerShell

```powershell
cd "PATH\TO\THE\FOLDER\THAT\CONTAINS\package.json"
npm ci
npm run dev
```

Then open:

`http://localhost:3000`

## Important

Do not run `npm install` from a parent folder that does not contain `package.json`.

The project root contains:

- `package.json`
- `package-lock.json`
- `src/`
- `public/`
- `index.html`

## Admin language

The Admin Console has its own **नेपाली / English** switch. It controls the Admin Console language independently of the public header.

## Bilingual fields

English/Nepali paired fields support automatic translation. Common archive vocabulary has an immediate offline fallback so local development does not depend on a serverless translation route.
