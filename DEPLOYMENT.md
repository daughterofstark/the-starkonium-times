# Publishing The Starkonium Times

## Before anything: preserve Blogger

1. Back up Blogger via Settings → Manage blog → Back up content, and save the theme too.
2. In Blogger Settings → Publishing, change the custom domain from `www.starkonium.com` to `blog.starkonium.com`. Blogger may give you two specific CNAME records; follow **the values Blogger displays**, which are account-specific. Do not guess the verification CNAME.
3. At your DNS provider, create the Blogger CNAME for `blog` pointing to `ghs.google.com` and its additional Blogger verification CNAME if instructed. Enable Blogger HTTPS and HTTPS redirect when available.
4. Verify `https://blog.starkonium.com` works and old post content is present. Old `www.starkonium.com/YYYY/MM/...` permalinks may **not** automatically redirect to the new blog host; plan URL-level redirects separately if preserving historical links is important. Do not assume GitHub Pages provides wildcard redirects.

## GitHub Pages

1. Review the new public copy carefully before pushing. Upload this complete repository to `daughterofstark/the-starkonium-times` (not just the workflow). Be aware that this build replaces the previous public-facing fictional fixture pages; backup is in `development-fixtures/pages/`.
2. Repo Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Repo Actions → Deploy to GitHub Pages → Run workflow (or push to main). The action builds the Astro site and publishes `dist`.
4. Under Pages → Custom domain set `starkonium.com` after Blogger has been moved. Enforce HTTPS when certificate provisioned.
5. Configure the DNS for GitHub Pages with the records listed in GitHub's current official documentation: apex `@` A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; optionally corresponding AAAA values from the documentation. For `www`, point a CNAME at `daughterofstark.github.io` (without a URL scheme). Remove stale Blogger `www → ghs.google.com` after migration.
6. Verify apex and www, TLS/HTTPS, internal links, and blog subdomain using actual browsers. DNS propagation and certificate issuance may take time.

**Important:** On GitHub Pages, `starkonium.com` can be the canonical site and `www.starkonium.com` its redirect. `blog.starkonium.com` is a separate Blogger-hosted property. Blogger post URLs on the old www host will need an explicit migration/redirect plan if SEO and historical links matter.

## Local development

Node 24.18.0, npm 11.16.0 recommended. Run `npm ci`, `npm run build`, `npm run dev`.

## Scope and pending work

This is a safe-to-publish starter portfolio with concise project summaries, not a complete migration of research reports, CV PDFs or Blogger articles. Old fictional content and routes remain in `development-fixtures/pages` and `src/content`; they're not exposed by the production routes. Review summaries before making claims publicly. The blog subdomain is **not** functional until Blogger and DNS have been reconfigured. No registrar, Blogger or GitHub settings have been changed automatically.
