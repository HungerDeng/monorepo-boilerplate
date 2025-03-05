// tailwind config is required for editor support

import type { Config } from 'tailwindcss';

import sharedConfig from '../../tailwind.config';

const config: Pick<Config, 'content' | 'presets'> = {
  // !!! warning: property content must contain all the files under the src folder, especially shadcn folder, otherwise shadcn will not work
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig],
};

export default config;
