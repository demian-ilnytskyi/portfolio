import path from 'path';

type FileName = string;

const buildEslintCommand = (filenames: FileName[]): string =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

const config: Record<string, (string | ((filenames: FileName[]) => string))[]> = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};

export default config;