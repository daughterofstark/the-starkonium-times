import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

import { chromium } from '@playwright/test';

const isCi = Boolean(process.env.CI);
const chromiumPath = chromium.executablePath();

if (!isCi && !existsSync(chromiumPath)) {
  console.warn(
    [
      'Warning: Playwright Chromium is not installed locally.',
      'Skipping local e2e smoke test; CI installs Chromium and enforces npm run test:e2e.',
    ].join(' '),
  );
  process.exit(0);
}

const result = spawnSync('npm', ['run', 'test:e2e'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
