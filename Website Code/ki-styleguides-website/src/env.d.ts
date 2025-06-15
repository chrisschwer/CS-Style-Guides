/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly AUTH_SECRET: string;
  readonly AUTH_GOOGLE_ID: string;
  readonly AUTH_GOOGLE_SECRET: string;
  readonly AUTH_GITHUB_ID: string;
  readonly AUTH_GITHUB_SECRET: string;
  readonly DATABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}