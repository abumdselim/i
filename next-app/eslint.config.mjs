import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

/**
 * Lint rules for the port.
 *
 * `eslint-config-next/core-web-vitals` is the framework's own set — React hooks,
 * accessibility, the Next rules that catch a client component marked by accident.
 * The ignores mirror `.gitignore` plus the frozen QA artefacts: the reference
 * snapshot is legacy HTML and linting it would only report on the old build.
 */
export default defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'node_modules/**',
    'next-env.d.ts',
    'qa/**',
    'public/**',
  ]),
]);
