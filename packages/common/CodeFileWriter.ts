import {
  BaseFeatureFileInfoDto,
  CodeGeneratorFileConfigDto,
  CodeGeneratorFolderConfigDto,
  CodeGeneratorPathConfigDto,
  DirectoryMakerFn,
  TemplateCompiler,
  TextFileAppendFn,
  TextFileReaderFn,
  TextFileWriterFn,
} from './types';
import { filterByExcludesCurried } from './utils';

export interface CodeFileWriter<T extends BaseFeatureFileInfoDto> {
  makeAll(config: CodeGeneratorPathConfigDto, fileInfo: T): Promise<number>;
}

export class CodeFileWriterService<T extends BaseFeatureFileInfoDto>
  implements CodeFileWriter<T>
{
  constructor(
    private read: TextFileReaderFn,
    private compile: TemplateCompiler<T>,
    private write: TextFileWriterFn,
    private mkdir: DirectoryMakerFn,
    private append: TextFileAppendFn<T>
  ) {}

  async makeDirectory(
    basePath: string,
    folderInfo: CodeGeneratorFolderConfigDto,
    fileInfo: T
  ) {
    const destPath = await this.compile(
      `${basePath}/${folderInfo.folderName}`,
      fileInfo
    );

    await this.mkdir(destPath);

    return true;
  }

  async readFile(path: string | undefined) {
    if (!path) {
      return '';
    }
    return this.read(path);
  }

  async readTemplates(pathInfoList: CodeGeneratorFileConfigDto[]) {
    return await Promise.all(
      pathInfoList.map((item) => this.readFile(item.template))
    );
  }

  async make(
    basePath: string,
    featInfo: CodeGeneratorFileConfigDto,
    template: string,
    fileInfo: T
  ) {
    const destPath = await this.compile(
      `${basePath}/${featInfo.fileName}`,
      fileInfo
    );
    const hasTemplate = Boolean(template);
    const sourceCode = hasTemplate
      ? await this.compile(template, fileInfo)
      : '';
    const { appendLogic } = featInfo;

    if (appendLogic) {
      try {
        await this.write(destPath, sourceCode, false);

        return;
      } catch (error) {
        if (error instanceof Error && error.message.includes('exists')) {
          await this.append(destPath, sourceCode, fileInfo, appendLogic);

          return;
        }
        throw error;
      }
    }

    await this.write(destPath, sourceCode, hasTemplate);
  }

  async makeAll(config: CodeGeneratorPathConfigDto, fileInfo: T) {
    const { base, folders, files, excludes } = config;

    if (excludes && excludes.includes(fileInfo.featureName)) {
      return 0;
    }

    const templates = await this.readTemplates(files);
    const filterFn = filterByExcludesCurried(fileInfo.featureName);

    const fileResult = await Promise.all(
      files
        .filter(filterFn)
        .map((info, index) => this.make(base, info, templates[index], fileInfo))
    );

    if (!folders) {
      return fileResult.length;
    }

    const folderResult = await Promise.all(
      folders
        .filter(filterFn)
        .map((info) => this.makeDirectory(base, info, fileInfo))
    );

    return fileResult.length + folderResult.length;
  }
}
