import { describe, expect, it } from 'vitest';

import {
  PRIMARY_NAV_LINKS,
  SITE_NAME,
  WORDMARK_TEXT,
} from '../../src/lib/shell';
import { SMOKE_PAGE_HEADING } from '../../src/lib/smoke';

describe('Phase 1 shell contract', () => {
  it('uses the expected placeholder heading', () => {
    expect(SMOKE_PAGE_HEADING).toBe('The Starkonium Times');
  });

  it('keeps the compact wordmark distinct from the accessible site name', () => {
    expect(WORDMARK_TEXT).toBe('STARKONIUM');
    expect(SITE_NAME).toBe('The Starkonium Times');
  });

  it('defines the primary navigation links', () => {
    expect(PRIMARY_NAV_LINKS.map((link) => link.label)).toEqual([
      'Projects',
      'Writing',
      'Experience',
      'About',
    ]);
  });
});
