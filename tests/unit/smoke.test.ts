import { describe, expect, it } from 'vitest';

import { SMOKE_PAGE_HEADING } from '../../src/lib/smoke';

describe('Phase 0 smoke page', () => {
  it('uses the expected temporary heading', () => {
    expect(SMOKE_PAGE_HEADING).toBe('The Starkonium Times — Phase 0');
  });
});
