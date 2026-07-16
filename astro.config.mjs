import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

const LOCAL_SITE_URL = 'http://localhost:4321';
const PRODUCTION_SITE_URL = 'https://starkonium.com';
const contexts = new Set(['local', 'preview', 'production']);

function resolveSiteUrl(environment = process.env) {
  const context = environment.DEPLOY_CONTEXT ?? 'local';
  const configuredUrl = environment.SITE_URL;

  if (!contexts.has(context)) {
    throw new Error(
      `Invalid DEPLOY_CONTEXT "${context}". Use local, preview, or production.`,
    );
  }

  if (context === 'preview' && !configuredUrl) {
    throw new Error('Preview builds require an explicit SITE_URL.');
  }

  if (context === 'production' && configuredUrl !== PRODUCTION_SITE_URL) {
    throw new Error(
      `Production builds require SITE_URL=${PRODUCTION_SITE_URL}.`,
    );
  }

  const siteUrl = configuredUrl ?? LOCAL_SITE_URL;

  try {
    const parsedUrl = new URL(siteUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('unsupported protocol');
    }
    if (parsedUrl.username || parsedUrl.password) {
      throw new Error('credentials are not allowed');
    }
  } catch {
    throw new Error(
      `SITE_URL must be a valid HTTP(S) URL; received "${siteUrl}".`,
    );
  }

  return siteUrl;
}

export default defineConfig({
  site: resolveSiteUrl(),
  output: 'static',
  integrations: [mdx()],
});
