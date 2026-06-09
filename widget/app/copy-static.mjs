// Post-build step: copy everything under `static/` to the `dist/` root as-is.
//
// Safe (app.safe.global) loads us as a Safe App and fetches `<deploy-url>/manifest.json`
// (plus the icon it references) from the site root before rendering the widget in its
// iframe. Parcel only emits assets it sees referenced from the entry HTML, and it
// content-hashes their filenames — neither of which works for files that must live at
// fixed, unhashed URLs like `/manifest.json`, `/logo.svg`, and `/_headers`. So we keep
// those in `static/` and copy them verbatim after the Parcel build.
import { cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

cpSync(join(root, 'static'), join(root, 'dist'), { recursive: true });

console.log('[copy-static] copied static/ -> dist/');
