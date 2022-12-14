import fs from 'node:fs/promises';
import { dirname } from 'path';
import { CLI_ASSETS_NAME } from '../constants';

export async function existsFile(filepath: string) {
  try {
    await fs.access(filepath);

    return true;
  } catch (error) {
    return false;
  }
}

export async function makeDirectory(targetPath: string) {
  await fs.mkdir(targetPath, { recursive: true });

  return true;
}

export async function writeFile(
  targetPath: string,
  source: string,
  forceOverwrite: boolean
) {
  const isExists = await existsFile(targetPath);

  if (isExists) {
    if (!source) {
      return true;
    }
    if (!forceOverwrite) {
      throw new Error(`"${targetPath}" file already exists`);
    }
  }

  await fs.mkdir(dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, source, { encoding: 'utf8' });

  return true;
}

export async function readFile(filepath: string) {
  let path = filepath;

  if (filepath.startsWith('__defTemplates/')) {
    path = filepath.replace(
      '__defTemplates/',
      `${__dirname}/../${CLI_ASSETS_NAME}/templates/`
    );
  } else if (filepath.startsWith('/') === false) {
    path = `${__dirname}/${filepath}`;
  }

  return fs.readFile(path, { encoding: 'utf8' });
}
