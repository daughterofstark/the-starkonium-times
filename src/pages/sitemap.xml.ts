const urls = ['/', '/projects/', '/writing/', '/about/'];
export function GET() {
  const items = urls.map(path => `<url><loc>https://starkonium.com${path}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
