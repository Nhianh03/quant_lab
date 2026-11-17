import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT = path.resolve(__dirname, '..');

function copyDirRecursive(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function buildStaticBundle(appRoot = DEFAULT_ROOT, outDir = path.join(appRoot, 'dist')) {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  // 1. Copy web/ static shell & ES modules to dist/
  copyDirRecursive(path.join(appRoot, 'web'), outDir);

  // 2. Copy syllabus.json & problems.json into dist/static-content/
  const staticContentDir = path.join(outDir, 'static-content');
  const staticLessonsDir = path.join(staticContentDir, 'lessons');
  fs.mkdirSync(staticLessonsDir, { recursive: true });

  fs.copyFileSync(
    path.join(appRoot, 'content', 'syllabus.json'),
    path.join(staticContentDir, 'syllabus.json'),
  );
  fs.copyFileSync(
    path.join(appRoot, 'content', 'problems.json'),
    path.join(staticContentDir, 'problems.json'),
  );

  // 3. Copy all Markdown lessons into dist/static-content/lessons/
  const lessonsSrcDir = path.join(appRoot, 'content', 'lessons');
  let lessonCount = 0;
  for (const entry of fs.readdirSync(lessonsSrcDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      fs.copyFileSync(path.join(lessonsSrcDir, entry.name), path.join(staticLessonsDir, entry.name));
      lessonCount += 1;
    }
  }

  // 4. Copy content/library/ (.pdf & .md) into dist/library/ and build library-index.json
  const librarySrcDir = path.join(appRoot, 'content', 'library');
  const libraryDestDir = path.join(outDir, 'library');
  fs.mkdirSync(libraryDestDir, { recursive: true });

  const libraryFiles = [];
  if (fs.existsSync(librarySrcDir)) {
    for (const entry of fs.readdirSync(librarySrcDir, { withFileTypes: true })) {
      if (!entry.isFile() || entry.name.startsWith('.')) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (ext !== '.pdf' && ext !== '.md') continue;
      const srcFile = path.join(librarySrcDir, entry.name);
      const stat = fs.statSync(srcFile);
      fs.copyFileSync(srcFile, path.join(libraryDestDir, entry.name));
      libraryFiles.push({
        name: entry.name,
        ext,
        size_bytes: stat.size,
        url: `/library/${encodeURIComponent(entry.name)}`,
      });
    }
  }
  libraryFiles.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(
    path.join(staticContentDir, 'library-index.json'),
    JSON.stringify({ files: libraryFiles }, null, 2),
    'utf8',
  );

  return { outDir, lessonCount, libraryCount: libraryFiles.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const result = buildStaticBundle();
  console.log(
    `Built static Quant Research Academy bundle in ${result.outDir} (${result.lessonCount} lessons, ${result.libraryCount} library docs)`,
  );
}
