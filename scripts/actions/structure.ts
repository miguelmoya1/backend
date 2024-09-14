import {} from 'fs';
import { mkdir, stat } from 'fs/promises';
import { join } from 'path';

const dirs = [
  'src',

  'src/application',
  'src/application/commands',
  'src/application/queries',
  'src/application/sagas',

  'src/domain',
  'src/domain/aggregates',
  'src/domain/entities',
  'src/domain/repositories',

  'src/infrastructure',
  'src/infrastructure/config',
  'src/infrastructure/persistence',
  'src/infrastructure/persistence/command-models',
  'src/infrastructure/persistence/query-models',
  'src/infrastructure/repositories',

  'src/presentation',
  'src/presentation/controllers',
  'src/presentation/routes',
];

export const createStructure = async () => {
  const baseDir = process.cwd();

  for (const dir of dirs) {
    await mkdir(join(baseDir, dir), { recursive: true, mode: 0o777 });
  }
};

export const checkStructure = async () => {
  const currentDir = process.cwd();

  for (const dir of dirs) {
    try {
      const src = await stat(join(currentDir, dir));

      if (!src.isDirectory()) {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  return true;
};
