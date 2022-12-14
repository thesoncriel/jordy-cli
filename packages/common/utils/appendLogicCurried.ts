import fs from 'node:fs/promises';
import { dirname } from 'path';
import { AppendLogicDictionaryModel, BaseFeatureFileInfoDto } from '../types';
import { readFile } from './fileSystem.util';

export const appendLogicCurried = (logicDic: AppendLogicDictionaryModel) =>
  async function <T extends BaseFeatureFileInfoDto>(
    targetPath: string,
    nextCode: string,
    data: T,
    logic: string
  ) {
    const fn = logicDic[logic];

    if (!fn) {
      throw new Error(
        `"${logic}" is not exist. append logic must be one of ${Object.keys(
          logicDic
        ).join(', ')}.`
      );
    }

    const prevCode = await readFile(targetPath);
    const newNextCode = fn(prevCode, nextCode, data);

    await fs.mkdir(dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, newNextCode, {
      encoding: 'utf8',
      flag: 'w',
    });

    return true;
  };
