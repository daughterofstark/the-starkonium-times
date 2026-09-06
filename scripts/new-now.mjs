import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const nowDir = join(process.cwd(), 'src', 'content', 'now');
const today = new Date().toISOString().slice(0, 10);
const target = join(nowDir, `${today}.md`);

mkdirSync(nowDir, { recursive: true });

if (existsSync(target)) {
  console.error(`Now entry already exists: ${target}`);
  process.exit(1);
}

const source = readdirSync(nowDir)
  .filter((file) => /^\d{4}-\d{2}-\d{2}\.md$/.test(file))
  .sort()
  .at(-1);

if (!source) {
  console.error('No existing Now entry found to copy.');
  process.exit(1);
}

copyFileSync(join(nowDir, source), target);
console.log(`Created ${target}`);
console.log(
  'Edit the copied entry, update the date, and write a ledgerNote only for meaningful changes.',
);

const editor = process.env.EDITOR;
if (editor) {
  spawnSync(editor, [target], { stdio: 'inherit', shell: true });
}
